import { Request, Response } from "express";
import fs from 'fs';
import crypto from 'crypto';
import multer from "multer";
import path from "path";
import rateLimit from "express-rate-limit";
import { In } from "typeorm";
import { asyncHandler } from "../../middleware/async";
import { AppDataSource } from "../../data-source";
import { CachedMatch } from "../../entity/CachedMatch";
import { CachedRiotAccount } from "../../entity/CachedRiotAccount";
import { AccountDto, CsvTeamDto, LeaderBoardDto, MatchInfo, RiotAccountDto } from "./leader-board.dto";
import { convertToAccountDto, convertToCsvTeamDto, getCSVForTeams, getCSVForUsers, getMatchDetail, getMatches, getRiotAccountById } from "./leader-board.service";

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
        existing.puuid = account.puuid;
        existing.totalPoints = account.totalPoints;
        existing.data = account;
        accountsToSave.push(existing);
      } else {
        // Create new account
        const newAccount = accountRepository.create({
          puuid: account.puuid,
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
export const processInitUsersLeaderBoard = async () => {

  console.log("Start processInitUsersLeaderBoard");

  const start = Date.now();

  const configFilePath = path.resolve(__dirname, '../../data/config.json');
  let configData;
  try {
    const configString = await fs.promises.readFile(configFilePath, 'utf-8');
    configData = JSON.parse(configString);
  } catch (error: any) {
    console.error('Error reading config file:', error.message);
    throw new Error('Unable to read configuration file');
  }

  // Resolve the relative path to an absolute path
  const filePath = path.resolve(__dirname, '../../', configData.userFilePath); // Đường dẫn tới file CSV
  // check file exists
  if (!fs.existsSync(filePath)) {
    console.log('file not found', filePath);
    return;
  }

  const records = await getCSVForUsers(filePath);
  
  const accounts: AccountDto[] = convertToAccountDto(records);

  // Load cached accounts from database
  const accountRepository = AppDataSource.getRepository(CachedRiotAccount);
  let cachedAccounts: CachedRiotAccount[] = [];
  try {
    cachedAccounts = await accountRepository.find();
    console.log('loaded cached accounts from database', cachedAccounts.length);
  } catch (error: any) {
    console.error('Error reading cached accounts from database:', error.message);
    cachedAccounts = [];
  }

  // Create a map for faster lookup
  const cachedAccountMap = new Map<string, RiotAccountDto>();
  for (const cached of cachedAccounts) {
    const key = `${cached.gameName.toLowerCase()}-${cached.tagLine.toLowerCase()}`;
    cachedAccountMap.set(key, cached.data || {
      puuid: cached.puuid,
      gameName: cached.gameName,
      tagLine: cached.tagLine,
      totalPoints: cached.totalPoints
    });
  }

  let dataAccounts: RiotAccountDto[] = [];
  let batchAccounts: RiotAccountDto[] = [];
  let processed = 0;
  for (const acc of accounts) {
    const cacheKey = `${acc.gameName.toLowerCase()}-${acc.tagLine.toLowerCase()}`;
    let accRes = cachedAccountMap.get(cacheKey);
    
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
    }
    if (accRes != null) {
      dataAccounts.push(accRes);
      batchAccounts.push(accRes);
    }
    processed++;
    if (processed % BATCH_SIZE === 0) {
      await persistCachedAccounts(batchAccounts);
      batchAccounts = [];
    }
  };
  await persistCachedAccounts(batchAccounts);

  const count = 100;
  let flatMatchIds: string[] = [];
  for (const acc of dataAccounts.filter(e => e != null)) {
    if (acc?.puuid == null) continue;
    let start = 0;
    let totalMatches = 0;
    while (true) {
      const startTime = Date.now();
      const accRes = await getMatches(acc.puuid, start, count, configData.startDate, configData.endDate);
      const elapsedTime = Date.now() - startTime;
      if (IS_DEBUG_PROCESS) {
        console.log('get matches', acc.gameName, accRes.length, new Date().toLocaleTimeString());
      }
      // Only delay if the request took less than 1 second to avoid rate limiting
      if (elapsedTime < 900) {
        await delay(900);
      }
      if (accRes == null) {
        break;
      }
      if (accRes != null) {
        totalMatches += accRes.length;
        flatMatchIds.push(...accRes);
        if (accRes.length < count) {
          if (IS_DEBUG_PROCESS) {
            console.log('get account matches', acc.gameName, totalMatches, new Date().toLocaleTimeString());
          }
          break;
        }
      }
      start = start + count;
    }
  }

  flatMatchIds = flatMatchIds.filter((value, index, array) => array.indexOf(value) === index);
  console.log('matchIds', flatMatchIds.length);

  // Load cached matches from database in chunks to handle thousands of matches
  const matchRepository = AppDataSource.getRepository(CachedMatch);
  const cachedMatchMap = new Map<string, MatchInfo>();
  const DB_QUERY_CHUNK_SIZE = 100; // Query database in chunks to avoid query size limits
  
  if (flatMatchIds.length > 0) {
    try {
      // Query cached matches in chunks
      for (let i = 0; i < flatMatchIds.length; i += DB_QUERY_CHUNK_SIZE) {
        const chunk = flatMatchIds.slice(i, i + DB_QUERY_CHUNK_SIZE);
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
      console.log('loaded cached matches from database', cachedMatchMap.size, 'out of', flatMatchIds.length);
    } catch (error: any) {
      console.error('Error reading cached matches from database:', error.message);
    }
  }

  // Initialize points map for incremental point calculation
  const pointsMap = new Map<string, number>();
  for (const acc of dataAccounts.filter(e => e != null)) {
    if (acc?.puuid != null) {
      const key = `${acc.gameName?.toLowerCase()}-${acc.tagLine?.toLowerCase()}`;
      pointsMap.set(key, 0);
    }
  }

  // Process matches in batches and persist incrementally to avoid memory issues
  let batchMatches: MatchInfo[] = [];
  let idx = 0;
  
  for (const matchId of flatMatchIds) {
    let matchRes = cachedMatchMap.get(matchId);
    if (matchRes == null) {
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
          endOfGameResult:    rawRes.info.endOfGameResult,
          gameCreation:       rawRes.info.gameCreation,
          gameMode:           rawRes.info.tft_game_type,
          participants:       rawRes.info.participants.map(x => {
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
              riotIdGameName:                 x.riotIdGameName,
              riotIdTagline:                  x.riotIdTagline,
              placement:                      x.placement,
              timeEliminated:                 x.time_eliminated,
              totalPoints:                    totalPoints,
              lastRound:                      x.last_round,
            }
          })
        }
      }
    }
    if (matchRes != null) {
      matchRes.participants = matchRes?.participants?.filter(x => x.totalPoints != null && x.totalPoints > 0) ?? [];
      batchMatches.push(matchRes);
      
      // Calculate points incrementally to avoid storing all matches in memory
      for (const participant of matchRes.participants) {
        const key = `${participant.riotIdGameName?.toLowerCase()}-${participant.riotIdTagline?.toLowerCase()}`;
        const currentPoints = pointsMap.get(key) || 0;
        pointsMap.set(key, currentPoints + (participant.totalPoints || 0));
      }
    }
    idx++;
    
    // Persist matches in batches to avoid memory issues and improve performance
    if (idx % BATCH_SIZE == 0) {
      console.log(`processed ${idx}/${flatMatchIds.length} matches at ${new Date().toLocaleTimeString()}`);
      await persistCachedMatches(batchMatches);
      batchMatches = []; // Clear batch to free memory
    }
  }
  console.log(`completed ${idx}/${flatMatchIds.length} matches`);
  // Persist remaining matches
  if (batchMatches.length > 0) {
    await persistCachedMatches(batchMatches);
  }

  // Apply calculated points to accounts
  for (const acc of dataAccounts.filter(e => e != null)) {
    if (acc?.puuid != null) {
      const key = `${acc.gameName?.toLowerCase()}-${acc.tagLine?.toLowerCase()}`;
      acc.totalPoints = pointsMap.get(key) || 0;
    }
  }

  // Update totalPoints in database
  await updateCachedAccountsTotalPoints(dataAccounts);

  let result: LeaderBoardDto = {
    users: dataAccounts,
    createdIn: (Date.now() - start) / 1000,
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

  return {
    users: result.users,
    accounts: accounts.length,
  }
}

export const initUsersLeaderBoard = [
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

    const { startDate, endDate } = req.body;
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

      res.status(200).json({
        success: true,
        message: 'File uploaded',
        data: {
          config: configData,
          totalUsers: userAccounts.length,
          demo3users: userAccounts.slice(0, 5),
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