import { UTCDate } from "@date-fns/utc";
import crypto from 'crypto';
import { differenceInDays, format, startOfDay } from "date-fns";
import { Request, Response } from "express";
import rateLimit from "express-rate-limit";
import fs from 'fs';
import multer from "multer";
import path from "path";
import { In, IsNull, Not } from "typeorm";
import { AppDataSource } from "../../data-source";
import { CachedMatch } from "../../entity/CachedMatch";
import { CachedRiotAccount } from "../../entity/CachedRiotAccount";
import { asyncHandler } from "../../middleware/async";
import { AccountDto, ConfigData, CsvTeamDto, MatchInfo, RiotAccountDto } from "./leader-board.dto";
import { RiotMatchDto } from "./leader-board.riot-dto";
import { convertToAccountDto, convertToCsvTeamDto, getCSVForTeams, getCSVForUsers, getMatchDetail, getMatches, getMatchesDetails, getRiotAccountById, IS_DEBUG_PROCESS } from "./leader-board.service";

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
    try {
      const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
      
      // Query accounts from database with totalPoints > 0, sorted by totalPoints descending, limit 100
      const cachedAccounts = await accountRepository
        .createQueryBuilder('account')
        .where('account.totalPoints > :minPoints', { minPoints: 0 })
        .orderBy('account.totalPoints', 'DESC')
        .addOrderBy('account.csvOrder', 'ASC')
        .limit(100)
        .getMany();

      // Map CachedRiotAccount entities to RiotAccountDto
      const users: RiotAccountDto[] = cachedAccounts.map(account => ({
        gameName: account.gameName,
        tagLine: account.tagLine,
        // puuid: account.puuid ?? null,
        totalPoints: account.totalPoints ?? 0,
      }));

      res.status(200).json({
        success: true,
        data: users
      });
    } catch (error: any) {
      // Don't expose internal error details
      console.error('Error loading leaderboard from database:', error.message);
      res.status(500).json({
        success: false,
        message: 'Unable to load leaderboard data'
      });
    }
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
    
    // Get all existing accounts in one query using OR conditions (case-insensitive)
    const queryBuilder = accountRepository.createQueryBuilder('account');
    const conditions = validAccounts.map((acc, index) => 
      `(LOWER(account.gameName) = :gameName${index} AND LOWER(account.tagLine) = :tagLine${index})`
    ).join(' OR ');
    
    const parameters: any = {};
    validAccounts.forEach((acc, index) => {
      parameters[`gameName${index}`] = acc.gameName.toLowerCase();
      parameters[`tagLine${index}`] = acc.tagLine.toLowerCase();
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
    
    // Prepare accounts for batch save, preserving CSV order
    const accountsToSave: CachedRiotAccount[] = [];
    for (const account of validAccounts) {
      const key = `${account.gameName.toLowerCase()}-${account.tagLine.toLowerCase()}`;
      const existing = existingMap.get(key);
      
      if (existing) {
        // Update existing account

        // Update existing account with new gameName and tagLine to match the CSV order
        existing.gameName = account.gameName;
        existing.tagLine = account.tagLine;

        if (account.puuid !== undefined) {
          existing.puuid = account.puuid;
        }
        if (account.totalPoints !== undefined) {
          existing.totalPoints = account.totalPoints;
        }
        // Update csvOrder to preserve CSV order
        if (account.csvOrder !== undefined && account.csvOrder !== null) {
          existing.csvOrder = account.csvOrder;
        }
        accountsToSave.push(existing);
      } else {
        // Create new account with csvOrder
        const newAccount = accountRepository.create({
          puuid: account.puuid ?? null,
          gameName: account.gameName,
          tagLine: account.tagLine,
          totalPoints: account.totalPoints,
          csvOrder: account.csvOrder ?? null,
        });
        accountsToSave.push(newAccount);
      }
    }
    
    // Sort accounts by csvOrder before saving to ensure order is preserved
    accountsToSave.sort((a, b) => {
      const orderA = a.csvOrder ?? Number.MAX_SAFE_INTEGER;
      const orderB = b.csvOrder ?? Number.MAX_SAFE_INTEGER;
      return orderA - orderB;
    });
    
    // Batch save all accounts
    if (accountsToSave.length > 0) {
      await accountRepository.save(accountsToSave);
    }
  } catch (error: any) {
    console.error('Error saving cached accounts to database:', error.message);
    throw new Error('Unable to save cached accounts');
  }
};

const persistCachedMatches = async (matches: MatchInfo[], ignoreExistingMatches: boolean = false) => {
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
        if (!ignoreExistingMatches) {
          matchesToSave.push(existing);
        }
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

// Helper function to load config data
const loadConfigData = async (): Promise<ConfigData> => {
  const configFilePath = path.resolve(__dirname, '../../data/config.json');
  try {
    const configString = await fs.promises.readFile(configFilePath, 'utf-8');
    const configData = JSON.parse(configString) as ConfigData;
    return configData;
  } catch (error: any) {
    console.error('Error reading config file:', error.message);
    throw new Error('Unable to read configuration file');
  }
};


// Helper function to load 5 accounts from CachedRiotAccount where refreshedDate is null or not today
const loadAccountsFromCachedRiotAccount = async (limit: number = 5, isRefreshingTodayMatches: boolean = false): Promise<CachedRiotAccount[]> => {
  const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
  
  try {
    // Get today's date in 'yyyy-MM-dd' format
    const today = format(new Date(), 'yyyy-MM-dd');
    
    // Query for accounts where refreshedDate is null or not today
    const queryBuilder = accountRepository
      .createQueryBuilder('account')
      .where('account.puuid IS NOT NULL');
    
    // Only add the refreshedDate condition if not refreshing today's matches
    if (!isRefreshingTodayMatches) {
      queryBuilder.andWhere('(account.refreshedDate IS NULL OR account.refreshedDate <> :today)', { today });
    } else {
      queryBuilder.andWhere('account.isCompleted = :isCompleted', { isCompleted: true });
    }

    queryBuilder.orderBy('account.refreshedAt', 'ASC');
    
    // Only apply limit if it's not -1
    if (limit !== -1) {
      queryBuilder.limit(limit);
    }
    
    const cachedAccounts = await queryBuilder.getMany();
    
    if (IS_DEBUG_PROCESS)
      console.log(`Found ${cachedAccounts.length} accounts from CachedRiotAccount (refreshedDate is null or not today)`);
    
    return cachedAccounts;
  } catch (error: any) {
    console.error('Error reading accounts from CachedRiotAccount:', error.message);
    throw new Error('Unable to read accounts from database');
  }
};

// Helper function to get or fetch Riot account
// Rate limiting is handled by getRiotAccountById in the service layer
const getOrFetchRiotAccount = async (
  acc: CachedRiotAccount,
): Promise<RiotAccountDto | null> => {
  let accRes = await getRiotAccountById(acc.gameName, acc.tagLine);
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
// Helper function to transform RiotMatchDto to MatchInfo
const transformMatchToMatchInfo = (rawRes: RiotMatchDto | null, matchId?: string): MatchInfo | null => {
  if (!rawRes) return null;
  
  const isStandardGame = rawRes?.info?.tft_game_type == 'standard';
  if (rawRes?.info?.endOfGameResult == 'GameComplete') {
    const matchRes: MatchInfo = {
      matchId: matchId || rawRes.metadata.match_id,
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
    
    matchRes.participants = matchRes?.participants?.filter(x => x.totalPoints != null && x.totalPoints > 0) ?? [];
    return matchRes;
  }
  
  return null;
};

const processMatch = async (matchId: string): Promise<MatchInfo | null> => {
  // const startTime = Date.now();
  const rawRes = await getMatchDetail(matchId);
  // const elapsedTime = Date.now() - startTime;
  
  if (IS_DEBUG_PROCESS) {
    console.log('get match detail', matchId, new Date().toLocaleTimeString());
  }
  
  // // Only delay if the request took less than 900ms to avoid rate limiting
  // if (elapsedTime < 900) {
  //   await delay(900);
  // }
  
  return transformMatchToMatchInfo(rawRes, matchId);
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
  
  if (matchesToProcess.length === 0) {
    return [];
  }
  
  // Use getMatchesDetails which handles rate limiting automatically
  const startTime = Date.now();
  const matchDetails = await getMatchesDetails(matchesToProcess);
  const elapsedTime = (Date.now() - startTime) / 1000;
  if (IS_DEBUG_PROCESS) {
    console.log(`Get new ${matchesToProcess.length} matches details ${elapsedTime}s | ${new Date().toLocaleTimeString()}`);
  }
  
  // Transform results and update cache
  const matchesToSave: MatchInfo[] = [];
  for (let i = 0; i < matchesToProcess.length; i++) {
    const matchId = matchesToProcess[i];
    const rawRes = matchDetails[i];
    const matchRes = transformMatchToMatchInfo(rawRes, matchId);
    
    if (matchRes != null) {
      cachedMatchMap.set(matchId, matchRes);
      matchesToSave.push(matchRes);
    }
  }
  
  await persistCachedMatches(matchesToSave);

  return matchesToSave;
};

export const processUsersController = asyncHandler(
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

    if (IS_DEBUG_PROCESS) {
      console.log(`Total accounts in CachedRiotAccount: ${totalAccounts}`);
      console.log(`Total processed accounts in CachedRiotAccount: ${totalProcessedAccounts}`);
    }

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

    if (IS_DEBUG_PROCESS) {
      console.log(`Found ${cachedAccounts.length} accounts without puuid`);
    }
    
    return cachedAccounts;
  } catch (error: any) {
    console.error('Error reading accounts without puuid from database:', error.message);
    throw new Error('Unable to read accounts from database');
  }
};

// Helper function to process accounts in parallel batches with concurrency control
const processAccountsInParallel = async (
  accounts: CachedRiotAccount[],
  concurrency: number = 20
): Promise<RiotAccountDto[]> => {
  const dataAccounts: RiotAccountDto[] = [];
  const results: (RiotAccountDto | null)[] = new Array(accounts.length);
  
  // Process accounts in batches to control concurrency
  for (let i = 0; i < accounts.length; i += concurrency) {
    const batch = accounts.slice(i, i + concurrency);
    const batchIndex = i;
    
    if (IS_DEBUG_PROCESS) {
      console.log(`Processing batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(accounts.length / concurrency)} (${batch.length} accounts)`);
    }
    
    // Process batch in parallel
    const batchPromises = batch.map(async (acc, batchOffset) => {
      const globalIndex = batchIndex + batchOffset;
      if (IS_DEBUG_PROCESS) {
        console.log(`Processing account ${globalIndex + 1}/${accounts.length}: ${acc.gameName}-${acc.tagLine}`);
      }
      try {
        const accRes = await getOrFetchRiotAccount(acc);
        if (accRes == null) {
          console.log(`Skipping account ${acc.gameName}-${acc.tagLine} (not found)`);
        }
        return accRes;
      } catch (error: any) {
        console.error(`Error processing account ${acc.gameName}-${acc.tagLine}:`, error.message);
        return null;
      }
    });
    
    // Wait for all promises in the batch to complete
    const batchResults = await Promise.all(batchPromises);
    
    // Store results and collect valid accounts
    const batchValidAccounts: RiotAccountDto[] = [];
    batchResults.forEach((result, batchOffset) => {
      const globalIndex = batchIndex + batchOffset;
      results[globalIndex] = result;
      if (result != null) {
        dataAccounts.push(result);
        batchValidAccounts.push(result);
      }
    });
    
    // Save batch instantly after processing
    if (batchValidAccounts.length > 0) {
      try {
        await persistCachedAccounts(batchValidAccounts);
        if (IS_DEBUG_PROCESS) {
          console.log(`Saved batch ${Math.floor(i / concurrency) + 1}/${Math.ceil(accounts.length / concurrency)} (${batchValidAccounts.length} accounts)`);
        }
      } catch (error: any) {
        console.error(`Error saving batch ${Math.floor(i / concurrency) + 1}:`, error.message);
        // Continue processing other batches even if one fails
      }
    }
  }
  
  return dataAccounts;
};

export const processUserList = async (): Promise<RiotAccountDto[]> => {
  // Load accounts from CachedRiotAccount that don't have puuid
  const accounts = await loadAccountsWithoutPuuid();
  
  if (accounts.length === 0) {
    return [];
  }
  
  // Process accounts in parallel with concurrency control (20 concurrent requests)
  // Accounts are saved instantly after each batch is processed
  const dataAccounts = await processAccountsInParallel(accounts, 20);

  return dataAccounts;
}

export const checkCronDate = async () => {
  // Load configuration
  const configData = await loadConfigData();

  if (configData?.isStopJob) {
    console.log("Config data is stop job, skipping checkCronDate");
    return false;
  }

  const processDate = new Date();
  const currentDate = startOfDay(processDate);
  const endOfCampaignDate = startOfDay(new Date(configData.endDate));
  // if today is a day after end date, do not execute function
  const days = differenceInDays(currentDate, endOfCampaignDate);
  if (days >= 2) {
      return false;
  }
  return false;
}

// Main function - processes accounts one by one
export const processMatchesForLeaderboard = async (limitAccounts: number = 5, isRefreshingTodayMatches: boolean = false, accountName: string | null = null) => {
  console.log("Start processMatchesForLeaderboard | isRefreshingTodayMatches:", isRefreshingTodayMatches);

  // Load configuration
  const configData = await loadConfigData();
  if (configData?.isStopJob) {
    console.log("Config data is stop job, skipping processMatchesForLeaderboard");
    return;
  }

  let startDateString: string = configData.startDate;
  let endDateString: string = configData.endDate;
  if (isRefreshingTodayMatches) {
    startDateString = format(new Date(), 'yyyy-MM-dd');
    endDateString = format(new Date(), 'yyyy-MM-dd');

    // if today is greater than endDate, set endDate to configData.endDate
    if (new Date() > new Date(configData.endDate)) {
      startDateString = configData.endDate;
      endDateString = configData.endDate;
    }
  }

  let accounts: CachedRiotAccount[] = [];
  if (accountName != null) {
    const [gameName, tagLine] = accountName.split('#');
    // Load account from CachedRiotAccount where gameName and tagLine match accountName
    const account = await AppDataSource.getRepository(CachedRiotAccount).findOne({
      where: { gameName: gameName, tagLine: tagLine }
    });
    if (account != null) {
      accounts.push(account);
    }
  } else {
    // Load 5 accounts from CachedRiotAccount where refreshedDate is null or not today
    accounts = await loadAccountsFromCachedRiotAccount(limitAccounts, isRefreshingTodayMatches);
  }
  
  let debugAccountMatches: MatchInfo[] = [];
  // Process each account one by one
  for (let i = 0; i < accounts.length; i++) {
    const acc = accounts[i];
    if (IS_DEBUG_PROCESS) {
      console.log(`Processing account ${i + 1}/${accounts.length}: ${acc.gameName}-${acc.tagLine}`);
    }

    if (acc.puuid == null) {
      console.log(`Skipping account ${acc.gameName}-${acc.tagLine} (no puuid)`);
      continue;
    }

    const matchIds = await getAccountMatches(acc.puuid, acc.gameName, startDateString, endDateString);
    if (matchIds.length === 0) {
      console.log(`No matches found for ${acc.gameName}-${acc.tagLine}`);
      if (!isRefreshingTodayMatches) {
        acc.refreshedAt = new UTCDate();
        acc.refreshedDate = format(new Date(), 'yyyy-MM-dd');
        acc.isCompleted = true;
        await AppDataSource.getRepository(CachedRiotAccount).save(acc);
      }
      continue;
    }
    // Load cached matches for this account's matches
    const cachedMatchMap = await loadCachedMatches(matchIds);
    
    // Process matches for this account
    await processAccountMatches(matchIds, cachedMatchMap);

    if (isRefreshingTodayMatches) {
      // Skip updating total points and total matches
      if (IS_DEBUG_PROCESS) {
        console.log(`Refreshing today matches, skipping updating total points and total matches for ${acc.gameName}-${acc.tagLine}`);
      }
      acc.refreshedAt = new UTCDate();
      await AppDataSource.getRepository(CachedRiotAccount).save(acc);
      continue;
    }
    
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

      if (accountName != null) {
        const [gameName, tagLine] = accountName.split('#');
        matchInfo.participants = matchInfo.participants.filter(participant => participant.riotIdGameName?.toLowerCase() === gameName?.toLowerCase() && participant.riotIdTagline?.toLowerCase() === tagLine?.toLowerCase());
        debugAccountMatches.push(matchInfo);
      }
    }

    // length of cachedMatchMap should be equal to matchIds.length
    let isCompleted = true;
    if (cachedMatchMap.size !== matchIds.length) {
      isCompleted = false;
      console.error(`Cached match map size ${cachedMatchMap.size} does not match matchIds length ${matchIds.length} for ${acc.gameName}-${acc.tagLine}`);
    }

    acc.totalPoints = totalPoints;
    acc.totalMatches = matchIds.length;
    acc.refreshedAt = new UTCDate();
    if (isCompleted) {
      acc.refreshedDate = format(new Date(), 'yyyy-MM-dd');
      acc.isCompleted = true;
    }
    await AppDataSource.getRepository(CachedRiotAccount).save(acc);

    if (IS_DEBUG_PROCESS) {
      console.log(`Completed account ${i + 1}/${accounts.length}: ${acc.gameName}-${acc.tagLine} | (${totalPoints} points, ${matchIds.length} matches)`);
    }
  }
  
  return {
    totalAccounts: accounts.length,
    demo5Accounts: accounts.slice(0, 5),
    accountMatches: debugAccountMatches,
  };
}

export const getProcessStatusController = asyncHandler(
  async (req: Request, res: Response) => {
    if (!validateApiKey(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const configData = await loadConfigData();
    const totalAccounts = await AppDataSource.getRepository(CachedRiotAccount).count();
    const totalProcessedAccounts = await AppDataSource.getRepository(CachedRiotAccount).count({
      where: { puuid: Not(IsNull()) }
    });

    const totalMatches = await AppDataSource.getRepository(CachedMatch).count();
    
    // get last 50 accounts has refreshedDate is NULL or not today
    const today = format(new Date(), 'yyyy-MM-dd');
    const last50Accounts = await AppDataSource.getRepository(CachedRiotAccount)
      .createQueryBuilder('account')
      .where('account.refreshedDate IS NULL OR account.refreshedDate <> :today', { today })
      .orderBy('account.refreshedAt', 'ASC')
      .limit(50)
      .getMany();

    // get last 10 accounts has refreshedDate is today
    const last10Accounts = await AppDataSource.getRepository(CachedRiotAccount)
      .createQueryBuilder('account')
      .where('account.refreshedDate = :today', { today })
      .orderBy('account.refreshedAt', 'DESC')
      .limit(10)
      .getMany();

    // count isCompleted accounts
    const totalCompletedAccounts = await AppDataSource.getRepository(CachedRiotAccount).count({
      where: { puuid: Not(IsNull()), isCompleted: true }
    });

    // count accounts has puuid and isCompleted is false
    const totalUncompletedAccounts = await AppDataSource.getRepository(CachedRiotAccount).count({
      where: { puuid: Not(IsNull()), isCompleted: false }
    });

    res.status(200).json({
      success: true,
      configData: configData,
      totalAccounts: totalAccounts,
      totalProcessedAccounts: totalProcessedAccounts,
      totalMatches: totalMatches,
      totalCompletedAccounts: totalCompletedAccounts,
      totalUncompletedAccounts: totalUncompletedAccounts,
      unprocessed50Accounts: last50Accounts,
      processed10Accounts: last10Accounts,
    });
  }
);

export const processMatchesController = [
  initLeaderBoardRateLimiter,
  asyncHandler(
    async (req: Request, res: Response) => {
      if (!validateApiKey(req)) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }

      const limit = req.body.limit ? parseInt(req.body.limit as string) : 5;
      const isRefreshingTodayMatches = req.body.isRefreshingTodayMatches ?? false;
      const accountName = req.body.accountName ?? null;

      try {
        const result = await processMatchesForLeaderboard(limit, isRefreshingTodayMatches, accountName);
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
export const uploadLeaderboardConfigController = [
  uploadCSVRateLimiter,
  xss(),
  upload,
  asyncHandler(async (req: Request, res: Response) => {
    if (!validateApiKey(req)) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { startDate, endDate, clearCache, isStopJob } = req.body;
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
        isStopJob: isStopJob,
      } as ConfigData;

      // Define the path for the config file
      const configFilePath = path.resolve(__dirname, '../../data/config.json');

      // Write the JSON object to the config file
      await fs.promises.writeFile(configFilePath, JSON.stringify(configData, null, 2), 'utf-8');

      // Add userAccounts to CachedRiotAccount table
      // Map with csvOrder to preserve CSV order (before filtering)
      let riotAccountAccounts: RiotAccountDto[] = userAccounts
        .map((x, index) => ({
          gameName: x.gameName,
          tagLine: x.tagLine,
          puuid: null,
          totalPoints: 0,
          csvOrder: index + 1, // 1-based index to preserve CSV order
        } as RiotAccountDto))
        .filter(x => x.gameName && x.tagLine);

      // Remove duplicates within CSV (case-insensitive) while preserving the first occurrence's order and csvOrder
      const seenInCSV = new Set<string>();
      riotAccountAccounts = riotAccountAccounts.filter((x) => {
        const key = `${x.gameName.toLowerCase()}-${x.tagLine.toLowerCase()}`;
        if (seenInCSV.has(key)) {
          // Skip duplicates, keep only the first occurrence
          return false;
        }
        seenInCSV.add(key);
        return true;
      });

      // Query database for existing accounts (case-insensitive comparison)
      const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
      // Build OR conditions for each account pair (case-insensitive)
      const conditions = riotAccountAccounts.map((acc, index) => 
        `(LOWER(account.gameName) = :gameName${index} AND LOWER(account.tagLine) = :tagLine${index})`
      ).join(' OR ');
      
      const parameters: any = {};
      riotAccountAccounts.forEach((acc, index) => {
        parameters[`gameName${index}`] = acc.gameName.toLowerCase();
        parameters[`tagLine${index}`] = acc.tagLine.toLowerCase();
      });
      
      const existingAccounts = conditions ? await accountRepository
        .createQueryBuilder('account')
        .where(conditions, parameters)
        .getMany() : [];

      // Create a map of existing accounts (case-insensitive key)
      const existingMap = new Map<string, CachedRiotAccount>();
      for (const existing of existingAccounts) {
        const key = `${existing.gameName.toLowerCase()}-${existing.tagLine.toLowerCase()}`;
        existingMap.set(key, existing);
      }

      // Filter out accounts that already exist in database (case-insensitive)
      riotAccountAccounts = riotAccountAccounts.filter((x) => {
        const key = `${x.gameName.toLowerCase()}-${x.tagLine.toLowerCase()}`;
        return !existingMap.has(key);
      });
      
      // Save in batches of 50
      const BATCH_SIZE = 50;
      for (let i = 0; i < riotAccountAccounts.length; i += BATCH_SIZE) {
        const batch = riotAccountAccounts.slice(i, i + BATCH_SIZE);
        await persistCachedAccounts(batch);
      }

      // Count failed accounts
      const failedAccounts = userAccounts.filter(x => !x.gameName || !x.tagLine);
      if (IS_DEBUG_PROCESS) {
        console.log(`Failed accounts: ${failedAccounts.length}`);
      }

      // get total user in db
      const totalUsersSaved = await AppDataSource.getRepository(CachedRiotAccount).count();
      // get total user in db with puuid not null
      const totalUsersSavedWithPuuid = await AppDataSource.getRepository(CachedRiotAccount).count({
        where: { puuid: Not(IsNull()) }
      });


      res.status(200).json({
        success: true,
        message: 'File uploaded',
        data: {
          config: configData,
          totalUsersInCSV: userAccounts.length,
          totalFailedUsersInCSV: failedAccounts.length,
          demo3usersInCSV: userAccounts.slice(0, 5),
          failedUsersInCSV: failedAccounts,
          totalUsersSaved: totalUsersSaved,
          totalUsersSavedWithPuuid: totalUsersSavedWithPuuid,
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

      try {
        const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
        
        // Query accounts from database with totalPoints > 0, sorted by totalPoints descending
        const cachedAccounts = await accountRepository
          .createQueryBuilder('account')
          .where('account.totalPoints > :minPoints', { minPoints: 0 })
          .orderBy('account.totalPoints', 'DESC')
          .addOrderBy('account.csvOrder', 'ASC')
          .getMany();

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

        // Map CachedRiotAccount entities to CSV rows
        const userRows = cachedAccounts.map(account => ({
          gameName: account.gameName,
          tagLine: account.tagLine,
          totalPoints: account.totalPoints ?? 0,
          totalMatches: account.totalMatches ?? 0,
          puuid: account.puuid ?? '',
          refreshedAt: account.refreshedAt ? account.refreshedAt.toISOString() : '',
          refreshedDate: account.refreshedDate ?? '',
          isCompleted: account.isCompleted ?? false,
        }));

        let csv = '';
        csv += toCSV(userRows, 'Users');

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="leaderboard.csv"');
        res.send(csv);
      } catch (error: any) {
        console.error('Error exporting leaderboard from database:', error.message);
        return res.status(500).json({
          success: false,
          message: 'Unable to export leaderboard data'
        });
      }
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

export const saveMatchesController = asyncHandler(
  async (req: Request, res: Response) => {
    try {
      const { matches } = req.body;

      // Validate input
      if (!matches) {
        return res.status(400).json({
          success: false,
          message: 'Matches data is required'
        });
      }

      // Ensure matches is an array
      const matchesArray = Array.isArray(matches) ? matches : [matches];

      if (matchesArray.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'At least one match is required'
        });
      }

      // Validate and transform match data
      const validMatches: MatchInfo[] = [];
      const errors: string[] = [];

      for (let i = 0; i < matchesArray.length; i++) {
        const match = matchesArray[i];

        // Validate required fields
        if (!match.matchId) {
          errors.push(`Match at index ${i}: matchId is required`);
          continue;
        }

        // Create MatchInfo object
        const matchInfo: MatchInfo = {
          matchId: String(match.matchId),
          endOfGameResult: match.endOfGameResult || null,
          gameMode: match.gameMode || null,
          gameCreation: match.gameCreation || null,
          participants: Array.isArray(match.participants) ? match.participants : []
        };

        if (match.participants.length === 0) {
          errors.push(`Match at index ${i}: participants is required`);
          continue;
        }

        validMatches.push(matchInfo);
      }

      if (validMatches.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'No valid matches to save',
          errors
        });
      }

      // Save matches using the existing persistCachedMatches function
      await persistCachedMatches(validMatches, true);

      res.status(200).json({
        success: true,
        message: `Successfully saved ${validMatches.length} match(es)`,
        data: {
          saved: validMatches.length,
          total: matchesArray.length,
          errors: errors.length > 0 ? errors : undefined
        }
      });
    } catch (error: any) {
      console.error('Error saving matches:', error.message);
      res.status(500).json({
        success: false,
        message: 'Unable to save matches',
        error: error.message
      });
    }
  }
);