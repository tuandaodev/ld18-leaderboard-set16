import { Request, Response } from "express";
import fs from 'fs';
import crypto from 'crypto';
import multer from "multer";
import path from "path";
import rateLimit from "express-rate-limit";
import { In, IsNull, Not } from "typeorm";
import { asyncHandler } from "../../middleware/async";
import { AppDataSource } from "../../data-source";
import { CachedMatch } from "../../entity/CachedMatch";
import { CachedRiotAccount } from "../../entity/CachedRiotAccount";
import { AccountDto, CsvTeamDto, LeaderBoardDto, MatchInfo, RiotAccountDto } from "./leader-board.dto";
import { convertToAccountDto, convertToCsvTeamDto, getCSVForTeams, getCSVForUsers, getMatchDetail, getMatches, getRiotAccountById } from "./leader-board.service";
import { format, parseISO } from "date-fns";

const { xss } = require('express-xss-sanitizer');

// Secure multer configuration for CSV uploads
const csvUploadOptions: multer.Options = {
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max
    files: 1,
  },
  fileFilter: (req, file, cb) => {
    // Validate MIME type and extension
    const allowedMimes = ['text/csv', 'application/csv', 'text/plain', 'application/vnd.ms-excel'];
    const allowedExtensions = ['.csv'];
    const ext = path.extname(file.originalname).toLowerCase();
    
    if ((allowedMimes.includes(file.mimetype) || file.mimetype === '') && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  }
};

// Configure multer for file upload
const upload = multer(csvUploadOptions).fields([
  { name: 'usersFile', maxCount: 1 },
  // { name: 'teamsFile', maxCount: 1 },
]);

// Rate limiters for sensitive endpoints
const initLeaderBoardRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // 5 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many requests, please try again later'
});

const uploadCSVRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // 10 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many upload requests, please try again later'
});

const exportCSVRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20, // 20 requests per minute
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Too many export requests, please try again later'
});

// Helper function to validate API key from headers
const validateApiKey = (req: Request): boolean => {
  const apiKey = req.headers['x-api-key'] as string || 
                 (req.body?.apiKey as string) || 
                 "0";
  return apiKey === process.env.API_KEY;
};

// Helper function to sanitize and validate date string
const sanitizeDateString = (dateString: string | undefined): string | null => {
  if (!dateString) return null;
  
  // Strict validation: only YYYY-MM-DD format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateRegex.test(dateString)) {
    return null;
  }
  
  // Additional validation: ensure it's a valid date
  const date = new Date(dateString);
  if (isNaN(date.getTime()) || !date.toISOString().startsWith(dateString)) {
    return null;
  }
  
  return dateString;
};

// Helper function to ensure path stays within data directory
const validateDataFilePath = (filePath: string, baseDir: string): string | null => {
  const resolvedPath = path.resolve(filePath);
  const resolvedBase = path.resolve(baseDir);
  
  if (!resolvedPath.startsWith(resolvedBase)) {
    return null;
  }
  
  return resolvedPath;
};

export const getLeaderBoardList = asyncHandler(
  async (req: Request, res: Response) => {
    // Get and sanitize date string from request
    const dateString = sanitizeDateString(req.query.date as string);
    const dataDir = path.resolve(__dirname, "../../data");
    
    let userFilePath = path.resolve(dataDir, "user-leaderboard.json");
    
    if (dateString) {
      // Construct path safely
      const fileName = `user-leaderboard-${dateString}.json`;
      const potentialPath = path.join(dataDir, fileName);
      
      // Validate path stays within data directory (prevent path traversal)
      const validatedPath = validateDataFilePath(potentialPath, dataDir);
      if (validatedPath) {
        userFilePath = validatedPath;
      } else {
        return res.status(400).json({
          success: false,
          message: 'Invalid date parameter'
        });
      }
    }

    let userData;
    try {
      // Use async file operations
      const jsonString = await fs.promises.readFile(userFilePath, 'utf-8');
      userData = JSON.parse(jsonString);
    } catch (error: any) {
      // Don't expose internal error details
      console.error('Error reading leaderboard file:', error.message);
      userData = { users: [] };
    }

    const users: RiotAccountDto[] = (userData?.users ?? [])
      .filter((user: RiotAccountDto) => (user.totalPoints ?? 0) > 0)
      .sort((a: RiotAccountDto, b: RiotAccountDto) => (b.totalPoints ?? 0) - (a.totalPoints ?? 0))
      .slice(0, 100);
    res.status(200).json({
      success: true,
      data: users
    });
  }
);

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

const persistCachedAccounts = async (dataAccounts: RiotAccountDto[]) => {
  try {
    if (dataAccounts.length === 0) return;
    
    const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
    
    // Filter valid accounts
    const validAccounts = dataAccounts.filter(acc => acc && acc.gameName && acc.tagLine);
    if (validAccounts.length === 0) return;
    
    // Get all existing accounts in one query using OR conditions
    const queryBuilder = accountRepository.createQueryBuilder('account');
    const conditions = validAccounts.map((acc, index) => 
      `(account.gameName = :gameName${index} AND account.tagLine = :tagLine${index})`
    ).join(' OR ');
    
    const parameters: any = {};
    validAccounts.forEach((acc, index) => {
      parameters[`gameName${index}`] = acc.gameName;
      parameters[`tagLine${index}`] = acc.tagLine;
    });
    
    const existingAccounts = conditions ? await queryBuilder
      .where(conditions, parameters)
      .getMany() : [];
    
    // Create a map for faster lookup
    const existingMap = new Map<string, CachedRiotAccount>();
    for (const existing of existingAccounts) {
      const key = `${existing.gameName.toLowerCase()}-${existing.tagLine.toLowerCase()}`;
      existingMap.set(key, existing);
    }
    
    // Prepare accounts for batch save
    const accountsToSave: CachedRiotAccount[] = [];
    for (const account of validAccounts) {
      const key = `${account.gameName.toLowerCase()}-${account.tagLine.toLowerCase()}`;
      const existing = existingMap.get(key);
      
      if (existing) {
        // Update existing account
        existing.puuid = account.puuid ?? null;
        existing.totalPoints = account.totalPoints;
        existing.data = account;
        accountsToSave.push(existing);
      } else {
        // Create new account
        const newAccount = accountRepository.create({
          puuid: account.puuid ?? null,
          gameName: account.gameName,
          tagLine: account.tagLine,
          totalPoints: account.totalPoints,
          data: account
        });
        accountsToSave.push(newAccount);
      }
    }
    
    // Batch save all accounts
    if (accountsToSave.length > 0) {
      await accountRepository.save(accountsToSave);
    }
  } catch (error: any) {
    console.error('Error saving cached accounts to database:', error.message);
    throw new Error('Unable to save cached accounts');
  }
};

const updateCachedAccountsTotalPoints = async (dataAccounts: RiotAccountDto[]) => {
  try {
    if (dataAccounts.length === 0) return;
    
    const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
    
    // Filter valid accounts with totalPoints
    const accountsToUpdate = dataAccounts.filter(acc => 
      acc && acc.gameName && acc.tagLine && acc.totalPoints !== undefined
    );
    if (accountsToUpdate.length === 0) return;
    
    // Get all existing accounts in one query using OR conditions
    const queryBuilder = accountRepository.createQueryBuilder('account');
    const conditions = accountsToUpdate.map((acc, index) => 
      `(account.gameName = :gameName${index} AND account.tagLine = :tagLine${index})`
    ).join(' OR ');
    
    const parameters: any = {};
    accountsToUpdate.forEach((acc, index) => {
      parameters[`gameName${index}`] = acc.gameName;
      parameters[`tagLine${index}`] = acc.tagLine;
    });
    
    const existingAccounts = conditions ? await queryBuilder
      .where(conditions, parameters)
      .getMany() : [];
    
    // Create a map for faster lookup
    const pointsMap = new Map<string, number>();
    accountsToUpdate.forEach(acc => {
      const key = `${acc.gameName.toLowerCase()}-${acc.tagLine.toLowerCase()}`;
      pointsMap.set(key, acc.totalPoints || 0);
    });
    
    // Update totalPoints for existing accounts
    const accountsToSave: CachedRiotAccount[] = [];
    for (const existing of existingAccounts) {
      const key = `${existing.gameName.toLowerCase()}-${existing.tagLine.toLowerCase()}`;
      const totalPoints = pointsMap.get(key);
      if (totalPoints !== undefined && existing.totalPoints !== totalPoints) {
        existing.totalPoints = totalPoints;
        accountsToSave.push(existing);
      }
    }
    
    // Batch save updated accounts
    if (accountsToSave.length > 0) {
      await accountRepository.save(accountsToSave);
      console.log(`Updated totalPoints for ${accountsToSave.length} accounts`);
    }
  } catch (error: any) {
    console.error('Error updating cached accounts totalPoints:', error.message);
    throw new Error('Unable to update cached accounts totalPoints');
  }
};

const persistCachedMatches = async (matches: MatchInfo[]) => {
  try {
    if (matches.length === 0) return;
    
    const matchRepository = AppDataSource.getRepository(CachedMatch);
    
    // Filter valid matches
    const validMatches = matches.filter(m => m && m.matchId);
    if (validMatches.length === 0) return;
    
    // Get all existing matches in one query
    const matchIds = validMatches.map(m => m.matchId);
    const existingMatches = await matchRepository.find({
      where: { matchId: In(matchIds) }
    });
    
    // Create a map for faster lookup
    const existingMap = new Map<string, CachedMatch>();
    for (const existing of existingMatches) {
      existingMap.set(existing.matchId, existing);
    }
    
    // Prepare matches for batch save
    const matchesToSave: CachedMatch[] = [];
    for (const match of validMatches) {
      const existing = existingMap.get(match.matchId);
      
      if (existing) {
        // Update existing match
        existing.endOfGameResult = match.endOfGameResult;
        existing.gameMode = match.gameMode;
        existing.gameCreation = match.gameCreation;
        existing.participants = match.participants;
        matchesToSave.push(existing);
      } else {
        // Create new match
        const newMatch = matchRepository.create({
          matchId: match.matchId,
          endOfGameResult: match.endOfGameResult,
          gameMode: match.gameMode,
          gameCreation: match.gameCreation,
          participants: match.participants
        });
        matchesToSave.push(newMatch);
      }
    }
    
    // Batch save all matches
    if (matchesToSave.length > 0) {
      await matchRepository.save(matchesToSave);
    }
  } catch (error: any) {
    console.error('Error saving cached matches to database:', error.message);
    throw new Error('Unable to save cached matches');
  }
};

export const BATCH_SIZE = 20;
export const IS_DEBUG_PROCESS = true;

// Helper function to load config data
const loadConfigData = async () => {
  const configFilePath = path.resolve(__dirname, '../../data/config.json');
  try {
    const configString = await fs.promises.readFile(configFilePath, 'utf-8');
    const configData = JSON.parse(configString);
    return configData;
  } catch (error: any) {
    console.error('Error reading config file:', error.message);
    throw new Error('Unable to read configuration file');
  }
};

// Helper function to load accounts from CSV
const loadAccountsFromCSV = async (configData: any): Promise<AccountDto[]> => {
  const filePath = path.resolve(__dirname, '../../', configData.userFilePath);
  if (!fs.existsSync(filePath)) {
    console.log('file not found', filePath);
    throw new Error('CSV file not found');
  }
  const records = await getCSVForUsers(filePath);
  return convertToAccountDto(records);
};

// Helper function to load 5 accounts from CachedRiotAccount where refreshedDate is null or not today
const loadAccountsFromCachedRiotAccount = async (limit: number = 5): Promise<CachedRiotAccount[]> => {
  const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
  
  try {
    // Get today's date in 'yyyy-MM-dd' format
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Query for accounts where refreshedDate is null or not today
    const cachedAccounts = await accountRepository
      .createQueryBuilder('account')
      .where('account.puuid IS NOT NULL')
      .andWhere('(account.refreshedDate IS NULL OR account.refreshedDate <> :today)', { today })
      .limit(limit)
      .getMany();
    
    console.log(`Found ${cachedAccounts.length} accounts from CachedRiotAccount (refreshedDate is null or not today)`);
    
    return cachedAccounts;
  } catch (error: any) {
    console.error('Error reading accounts from CachedRiotAccount:', error.message);
    throw new Error('Unable to read accounts from database');
  }
};

// Helper function to load cached accounts map from database
const loadCachedAccountsMap = async (): Promise<Map<string, RiotAccountDto>> => {
  const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
  const cachedAccountMap = new Map<string, RiotAccountDto>();
  
  try {
    const cachedAccounts = await accountRepository.find();
    console.log('loaded cached accounts from database', cachedAccounts.length);
    
    for (const cached of cachedAccounts) {
      const key = `${cached.gameName.toLowerCase()}-${cached.tagLine.toLowerCase()}`;
      cachedAccountMap.set(key, cached.data || {
        puuid: cached.puuid,
        gameName: cached.gameName,
        tagLine: cached.tagLine,
        totalPoints: cached.totalPoints
      });
    }
  } catch (error: any) {
    console.error('Error reading cached accounts from database:', error.message);
  }
  
  return cachedAccountMap;
};

// Helper function to get or fetch Riot account
const getOrFetchRiotAccount = async (
  acc: CachedRiotAccount,
  cachedAccountMap: Map<string, RiotAccountDto>
): Promise<RiotAccountDto | null> => {
  const cacheKey = `${acc.gameName.toLowerCase()}-${acc.tagLine.toLowerCase()}`;
  let accRes = cachedAccountMap.get(cacheKey) || null;
  
  if (accRes == null) {
    const startTime = Date.now();
    accRes = await getRiotAccountById(acc.gameName, acc.tagLine);
    const elapsedTime = Date.now() - startTime;
    
    if (IS_DEBUG_PROCESS) {
      console.log('get riot account', acc.gameName, acc.tagLine, new Date().toLocaleTimeString());
    }
    
    // Only delay if the request took less than 900ms to avoid rate limiting
    if (elapsedTime < 900) {
      await delay(900);
    }
    
    // Persist account immediately after fetching
    if (accRes != null) {
      await persistCachedAccounts([accRes]);
    }
  }
  
  return accRes || null;
};

// Helper function to get all match IDs for an account
const getAccountMatches = async (
  puuid: string,
  gameName: string,
  startDate: string,
  endDate: string
): Promise<string[]> => {
  const count = 100;
  const matchIds: string[] = [];
  let start = 0;
  let totalMatches = 0;
  
  while (true) {
    const startTime = Date.now();
    const accRes = await getMatches(puuid, start, count, startDate, endDate);
    const elapsedTime = Date.now() - startTime;
    
    if (IS_DEBUG_PROCESS) {
      console.log('get matches', gameName, accRes?.length || 0, new Date().toLocaleTimeString());
    }
    
    // Only delay if the request took less than 900ms to avoid rate limiting
    if (elapsedTime < 900) {
      await delay(900);
    }
    
    if (accRes == null || accRes.length === 0) {
      break;
    }
    
    totalMatches += accRes.length;
    matchIds.push(...accRes);
    
    if (accRes.length < count) {
      if (IS_DEBUG_PROCESS) {
        console.log('get account matches', gameName, totalMatches, new Date().toLocaleTimeString());
      }
      break;
    }
    
    start = start + count;
  }
  
  return matchIds;
};

// Helper function to process a single match
const processMatch = async (matchId: string): Promise<MatchInfo | null> => {
  let matchRes: MatchInfo | null = null;
  
  const startTime = Date.now();
  const rawRes = await getMatchDetail(matchId);
  const elapsedTime = Date.now() - startTime;
  
  if (IS_DEBUG_PROCESS) {
    console.log('get match detail', matchId, new Date().toLocaleTimeString());
  }
  
  // Only delay if the request took less than 900ms to avoid rate limiting
  if (elapsedTime < 900) {
    await delay(900);
  }
  
  const isStandardGame = rawRes?.info?.tft_game_type == 'standard';
  if (rawRes != null && rawRes?.info?.endOfGameResult == 'GameComplete') {
    matchRes = {
      matchId: rawRes.metadata.match_id,
      endOfGameResult: rawRes.info.endOfGameResult,
      gameCreation: rawRes.info.gameCreation,
      gameMode: rawRes.info.tft_game_type,
      participants: rawRes.info.participants.map(x => {
        let totalPoints = 0;
        if (x.time_eliminated > 1200 && x.last_round > 30 && isStandardGame) {
          if (x.placement == 1) {
            totalPoints = 10;
          }
          if (x.placement == 2) {
            totalPoints = 8;
          }
          if (x.placement == 3) {
            totalPoints = 6;
          }
          if (x.placement == 4) {
            totalPoints = 4;
          }
        }
        return {
          riotIdGameName: x.riotIdGameName,
          riotIdTagline: x.riotIdTagline,
          placement: x.placement,
          timeEliminated: x.time_eliminated,
          totalPoints: totalPoints,
          lastRound: x.last_round,
        }
      })
    };
  }
  if (matchRes != null) {
    matchRes.participants = matchRes?.participants?.filter(x => x.totalPoints != null && x.totalPoints > 0) ?? [];
    return matchRes;
  }
  
  return null;
};

// Helper function to load cached matches for a list of match IDs
const loadCachedMatches = async (matchIds: string[]): Promise<Map<string, MatchInfo>> => {
  const matchRepository = AppDataSource.getRepository(CachedMatch);
  const cachedMatchMap = new Map<string, MatchInfo>();
  const DB_QUERY_CHUNK_SIZE = 100;
  
  if (matchIds.length === 0) {
    return cachedMatchMap;
  }
  
  try {
    // Query cached matches in chunks
    for (let i = 0; i < matchIds.length; i += DB_QUERY_CHUNK_SIZE) {
      const chunk = matchIds.slice(i, i + DB_QUERY_CHUNK_SIZE);
      const cachedMatches = await matchRepository.find({
        where: { matchId: In(chunk) }
      });
      
      // Add to map
      for (const cached of cachedMatches) {
        cachedMatchMap.set(cached.matchId, {
          matchId: cached.matchId,
          endOfGameResult: cached.endOfGameResult,
          gameMode: cached.gameMode,
          gameCreation: cached.gameCreation,
          participants: cached.participants || []
        });
      }
    }
  } catch (error: any) {
    console.error('Error reading cached matches from database:', error.message);
  }
  
  return cachedMatchMap;
};

// Helper function to process matches for a single account
const processAccountMatches = async (
  matchIds: string[],
  cachedMatchMap: Map<string, MatchInfo>
): Promise<MatchInfo[]> => {
  // Remove duplicates
  const uniqueMatchIds = matchIds.filter((value, index, array) => array.indexOf(value) === index);
  // Only process matches that are still missing from cache
  const matchesToProcess = uniqueMatchIds.filter(id => !cachedMatchMap.has(id));
  // Process each match one by one
  const matchesToSave: MatchInfo[] = [];
  for (const matchId of matchesToProcess) {
    const matchRes = await processMatch(matchId);
    if (matchRes != null) {
      matchesToSave.push(matchRes);
      cachedMatchMap.set(matchId, matchRes);
    }
  }
  await persistCachedMatches(matchesToSave);

  return matchesToSave;
};

// Helper function to save leaderboard results
const saveLeaderBoardResults = async (
  dataAccounts: RiotAccountDto[],
  startTime: number
): Promise<void> => {
  const result: LeaderBoardDto = {
    users: dataAccounts,
    createdIn: (Date.now() - startTime) / 1000,
    createdDate: new Date().toISOString()
  };
  
  const outputPath = path.resolve(__dirname, "../../data/user-leaderboard.json");
  try {
    await fs.promises.writeFile(outputPath, JSON.stringify(result), 'utf8');
    console.log('write user json complete');
  } catch (error: any) {
    console.error('Error writing user leaderboard:', error.message);
    throw new Error('Unable to save user leaderboard');
  }

  // backup user-leaderboard.json by date string yyyy-mm-dd
  const dateString = new Date().toISOString().split('T')[0];
  const outputBackupPath = path.resolve(__dirname, `../../data/user-leaderboard-${dateString}.json`);
  try {
    await fs.promises.writeFile(outputBackupPath, JSON.stringify(result), 'utf8');
    console.log('write user json backup complete');
  } catch (error: any) {
    console.error('Error writing user leaderboard backup:', error.message);
    // Don't throw here, backup failure is not critical
  }
};

export const initUserList = asyncHandler(
  async (req: Request, res: Response) => {
    if (!validateApiKey(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    // Load configuration
    const configData = await loadConfigData();
    const processedAccounts = await processUserList();

    // Get total count of accounts in CachedRiotAccount
    const totalAccounts = await AppDataSource.getRepository(CachedRiotAccount).count();
    const totalProcessedAccounts = await AppDataSource.getRepository(CachedRiotAccount).count({
      where: { puuid: Not(IsNull()) }
    });
    console.log(`Total accounts in CachedRiotAccount: ${totalAccounts}`);
    console.log(`Total processed accounts in CachedRiotAccount: ${totalProcessedAccounts}`);

    res.status(200).json({
      success: true,
      data: {
        config: configData,
        totalUsers: totalAccounts,
        totalProcessedUsers: totalProcessedAccounts,
        processedUsers: processedAccounts.length,
        demo5processedUsers: processedAccounts.slice(0, 5),
      }
    });
  }
);

// Helper function to load accounts from CachedRiotAccount without puuid
const loadAccountsWithoutPuuid = async (): Promise<CachedRiotAccount[]> => {
  const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
  
  try {
    const cachedAccounts = await accountRepository.find({
      where: { puuid: IsNull() }
    });
    console.log(`Found ${cachedAccounts.length} accounts without puuid`);
    
    return cachedAccounts;
  } catch (error: any) {
    console.error('Error reading accounts without puuid from database:', error.message);
    throw new Error('Unable to read accounts from database');
  }
};

export const processUserList = async (): Promise<RiotAccountDto[]> => {
  // Load accounts from CachedRiotAccount that don't have puuid
  const accounts = await loadAccountsWithoutPuuid();
  
  // Load cached accounts map
  const cachedAccountMap = await loadCachedAccountsMap();
  
  // Initialize points map
  const dataAccounts: RiotAccountDto[] = [];
  // Process each account one by one
  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];
    console.log(`Processing account ${i + 1}/${accounts.length}: ${acc.gameName}-${acc.tagLine}`);
    // Get or fetch Riot account
    const accRes = await getOrFetchRiotAccount(acc, cachedAccountMap);
    if (accRes == null) {
      console.log(`Skipping account ${acc.gameName}-${acc.tagLine} (not found)`);
      continue;
    }
    dataAccounts.push(accRes);
  }

  return dataAccounts;
}

// Main function - processes accounts one by one
export const processInitUsersLeaderBoard = async () => {
  console.log("Start processInitUsersLeaderBoard");

  // Load configuration
  const configData = await loadConfigData();
  
  // Load 5 accounts from CachedRiotAccount where refreshedDate is null or not today
  const accounts = await loadAccountsFromCachedRiotAccount();
  
  // Process each account one by one
  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];
    console.log(`Processing account ${i + 1}/${accounts.length}: ${acc.gameName}-${acc.tagLine}`);

    if (acc.puuid == null) {
      console.log(`Skipping account ${acc.gameName}-${acc.tagLine} (no puuid)`);
      continue;
    }

    const matchIds = await getAccountMatches(acc.puuid, acc.gameName, configData.startDate, configData.endDate);
    if (matchIds.length === 0) {
      console.log(`No matches found for ${acc.gameName}-${acc.tagLine}`);
      continue;
    }

    console.log(`Found ${matchIds.length} matches for ${acc.gameName}-${acc.tagLine}`);
    
    // Load cached matches for this account's matches
    const cachedMatchMap = await loadCachedMatches(matchIds);
    
    // Process matches for this account
    await processAccountMatches(matchIds, cachedMatchMap);
    
    // Loop through cachedMatchMap and update account's total points
    let totalPoints = 0;
    for (const [matchId, matchInfo] of cachedMatchMap.entries()) {
      // loop through matchInfo.participants and update account's total points
      for (const participant of matchInfo.participants) {
        if (participant.riotIdGameName?.toLowerCase() === acc.gameName?.toLowerCase()
           && participant.riotIdTagline?.toLowerCase() === acc.tagLine?.toLowerCase()) {
          totalPoints += participant.totalPoints || 0;
        }
      }
    }

    acc.totalPoints = totalPoints;
    acc.totalMatches = matchIds.length;
    
    console.log(`Completed account ${i + 1}/${accounts.length}: ${acc.gameName}-${acc.tagLine} | (${totalPoints} points, ${matchIds.length} matches)`);
  }
  
  return {
    totalAccounts: accounts.length,
    demo5Accounts: accounts.slice(0, 5),
  };
}

export const processUsersLeaderBoard = [
  initLeaderBoardRateLimiter,
  asyncHandler(
    async (req: Request, res: Response) => {
      if (!validateApiKey(req)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      try {
        const result = await processInitUsersLeaderBoard();
        res.status(200).json({
          success: true,
          ...result,
        });
      } catch (error: any) {
        console.error('Error initializing leaderboard:', error.message);
        res.status(500).json({
          success: false,
          message: 'Unable to initialize leaderboard'
        });
      }
    }
  )
];

export const testCron = async () => {
  const configFilePath = path.resolve(__dirname, '../../data/config.json');
  try {
    const configString = await fs.promises.readFile(configFilePath, 'utf-8');
    const configData = JSON.parse(configString);

    // Resolve the relative path to an absolute path
    const filePath = path.resolve(__dirname, '../../', configData.teamFilePath); // Đường dẫn tới file CSV
    const records = await getCSVForTeams(filePath);

    const teams: CsvTeamDto[] = convertToCsvTeamDto(records);
    const accounts = teams.flatMap(x => x.users);

    return accounts;
  } catch (error: any) {
    console.error('Error in testCron:', error.message);
    throw new Error('Unable to process test cron');
  }
}

export const testController = asyncHandler(
  async (req: Request, res: Response) => {
    // Only allow in development/test environments
    if (process.env.NODE_ENV === 'production') {
      return res.status(403).json({ success: false, message: 'Test endpoint not available in production' });
    }

    try {
      const configFilePath = path.resolve(__dirname, '../../data/config.json');
      const configString = await fs.promises.readFile(configFilePath, 'utf-8');
      const configData = JSON.parse(configString);

      // Resolve the relative path to an absolute path
      const filePath = path.resolve(__dirname, '../../', configData.teamFilePath); // Đường dẫn tới file CSV
      const records = await getCSVForTeams(filePath);

      const teams: CsvTeamDto[] = convertToCsvTeamDto(records);
      const accounts = teams.flatMap(x => x.users);

      res.status(200).json({
        success: true,
        accounts: accounts
      });
    } catch (error: any) {
      console.error('Error in testController:', error.message);
      res.status(500).json({
        success: false,
        message: 'Unable to process test request'
      });
    }
  }
);

// New POST endpoint to upload a CSV file with startDate and endDate
export const uploadCSV = [
  uploadCSVRateLimiter,
  xss(),
  upload,
  asyncHandler(async (req: Request, res: Response) => {
    if (!validateApiKey(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { startDate, endDate, clearCache } = req.body;
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const usersFile = files['usersFile'] ? files['usersFile'][0] : null;

    if (!usersFile) {
      return res.status(400).json({ success: false, message: 'usersFile must be uploaded' });
    }
    
    if (!startDate || !endDate) {
      return res.status(400).json({ success: false, message: 'startDate and endDate are required' });
    }

    // Validate startDate and endDate
    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Please use YYYY-MM-DD format.',
      });
    }

    // Validate date range
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (start > end) {
      return res.status(400).json({
        success: false,
        message: 'startDate must be before endDate',
      });
    }

    // Clear cache tables if clearCache is true
    if (clearCache === true || clearCache === 'true') {
      try {
        const matchRepository = AppDataSource.getRepository(CachedMatch);
        const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
        
        await matchRepository.clear();
        await accountRepository.clear();
        
        console.log('Cache tables cleared: CachedMatch and CachedRiotAccount');
      } catch (error: any) {
        console.error('Error clearing cache tables:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Unable to clear cache tables'
        });
      }
    }

    // Define the destination path in the data folder
    const dataFolderPath = path.resolve(__dirname, "../../data/uploads");
    const clonedFilePaths: string[] = [];

    try {
      // Ensure the data folder exists
      await fs.promises.mkdir(dataFolderPath, { recursive: true });

      // Copy the uploaded files to the data folder with secure random names
      const filesToClone = [usersFile];
      
      for (const file of filesToClone) {
        // Use cryptographically secure random name instead of predictable timestamp
        const randomId = crypto.randomBytes(16).toString('hex');
        const fileType = 'user';
        const ext = path.extname(file.originalname);
        const formattedFilename = `${fileType}_${randomId}${ext}`;
        const clonedFilePath = path.join(dataFolderPath, formattedFilename);

        // Validate the cloned path stays within data folder
        const validatedPath = validateDataFilePath(clonedFilePath, dataFolderPath);
        if (!validatedPath) {
          throw new Error('Invalid file path');
        }

        // Copy the file to the data folder with the new formatted filename
        await fs.promises.copyFile(file.path, validatedPath);
        clonedFilePaths.push(validatedPath);

        // Clean up the original uploaded file
        try {
          await fs.promises.unlink(file.path);
        } catch (err: any) {
          console.error('Error deleting the uploaded file:', err.message);
        }
      }

      // Process the cloned CSV files with validation
      const userAccounts: AccountDto[] = [];
      let userFilePath: string | null = null;

      for (const clonedFilePath of clonedFilePaths) {
        if (clonedFilePath.includes('user')) {
          const records = await getCSVForUsers(clonedFilePath);
          
          // Validate CSV content
          if (records.length > 10000) {
            return res.status(400).json({
              success: false,
              message: 'CSV file too large. Maximum 10000 rows allowed.',
            });
          }
          
          // Validate each record structure
          for (const record of records) {
            if (!Array.isArray(record) || !record[0] || typeof record[0] !== 'string') {
              return res.status(400).json({
                success: false,
                message: 'Invalid CSV format. Each row must contain a valid game name.',
              });
            }
          }
          
          userAccounts.push(...convertToAccountDto(records));
          userFilePath = clonedFilePath;
        }
      }

      // Convert absolute paths to relative paths
      const basePath = path.resolve(__dirname, '../../');
      const relativeUserFilePath = userFilePath ? path.relative(basePath, userFilePath) : null;

      // Create a JSON object with the required data
      const configData = {
        startDate,
        endDate,
        userFilePath: relativeUserFilePath,
      };

      // Define the path for the config file
      const configFilePath = path.resolve(__dirname, '../../data/config.json');

      // Write the JSON object to the config file
      await fs.promises.writeFile(configFilePath, JSON.stringify(configData, null, 2), 'utf-8');

      // Add userAccounts to CachedRiotAccount table
      let riotAccountAccounts: RiotAccountDto[] = userAccounts.filter(x => x.gameName && x.tagLine).map(x => {
        return {
          gameName: x.gameName,
          tagLine: x.tagLine,
          puuid: null,
          totalPoints: 0,
        } as RiotAccountDto;
      });

      // Remove duplicates
      riotAccountAccounts = riotAccountAccounts.filter((x, index, self) =>
        index === self.findIndex((t) => t.gameName === x.gameName && t.tagLine === x.tagLine)
      );
      
      // Save in batches of 50
      const BATCH_SIZE = 50;
      for (let i = 0; i < riotAccountAccounts.length; i += BATCH_SIZE) {
        const batch = riotAccountAccounts.slice(i, i + BATCH_SIZE);
        await persistCachedAccounts(batch);
      }

      // Count failed accounts
      const failedAccounts = userAccounts.filter(x => !x.gameName || !x.tagLine);
      console.log(`Failed accounts: ${failedAccounts.length}`);

      res.status(200).json({
        success: true,
        message: 'File uploaded',
        data: {
          config: configData,
          totalUsers: userAccounts.length,
          totalFailedUsers: failedAccounts.length,
          demo3users: userAccounts.slice(0, 5),
          failedUsers: failedAccounts,
        }
      });
    } catch (error: any) {
      // Clean up uploaded files on error
      for (const filePath of clonedFilePaths) {
        try {
          await fs.promises.unlink(filePath);
        } catch (err: any) {
          console.error('Error cleaning up file:', err.message);
        }
      }
      
      console.error('Error uploading CSV:', error.message);
      res.status(500).json({
        success: false,
        message: 'Unable to process file upload'
      });
    }
  })
];

export const exportLeaderBoardCSV = [
  exportCSVRateLimiter,
  asyncHandler(
    async (req: Request, res: Response) => {
      if (!validateApiKey(req)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const userFilePath = path.resolve(__dirname, "../../data/user-leaderboard.json");

      let userData: any = null;
      try {
        const jsonString = await fs.promises.readFile(userFilePath, 'utf-8');
        userData = JSON.parse(jsonString);
      } catch (error: any) {
        console.error('Error reading leaderboard file:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Unable to read leaderboard data'
        });
      }

      // Helper to convert array of objects to CSV
      function toCSV(data: any[], sectionName: string): string {
        if (!Array.isArray(data) || data.length === 0) return '';
        const keys = Object.keys(data[0]);
        let csv = `\n# ${sectionName}\n`;
        csv += keys.join(',') + '\n';
        for (const row of data) {
          csv += keys.map(k => JSON.stringify(row[k] ?? '')).join(',') + '\n';
        }
        return csv;
      }

      // If the JSON has a 'users' or 'teams' property, use that
      let userRows = Array.isArray(userData) ? userData : (userData as any).users || [];

      let csv = '';
      csv += toCSV(userRows, 'Users');

      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="leaderboard.csv"');
      res.send(csv);
    }
  )
];

function isValidDate(dateString: string): boolean {
  // Regular expression to match YYYY-MM-DD format
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  if (!dateString.match(regex)) {
    return false;
  }

  // Parse the date string to a Date object
  const date = new Date(dateString);
  const timestamp = date.getTime();

  // Check if the date is valid
  if (typeof timestamp !== 'number' || Number.isNaN(timestamp)) {
    return false;
  }

  return date.toISOString().startsWith(dateString);
}