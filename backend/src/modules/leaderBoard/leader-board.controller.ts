import { Request, Response } from "express";
import fs from 'fs';
import multer from "multer";
import path from "path";
import { Like } from "typeorm";
import { ContentConfig } from "../../entity/ContentConfig";
import { asyncHandler } from "../../middleware/async";
import { AccountDto, CsvTeamDto, LeaderBoardDto, RiotAccountDto } from "./leader-board.dto";
import { convertToAccountDto, convertToCsvTeamDto, getChampionMasteriesDetail, getCSVForTeams, getCSVForUsers, getRiotAccountById } from "./leader-board.service";

// Configure multer for file upload
const upload = multer({ dest: 'uploads/' }).fields([
  { name: 'usersFile', maxCount: 1 },
  // { name: 'teamsFile', maxCount: 1 },
]);

export const getLeaderBoardList = asyncHandler(
  async (req: Request, res: Response) => {
    // get string yyyy-mm-dd from request
    const dateString = req.query.date as string;
    let userFilePath = path.resolve(__dirname, "../../data/user-leaderboard.json");
    if (dateString) {
      userFilePath = path.resolve(__dirname, `../../data/user-leaderboard-${dateString}.json`);
    }

    let userData;
    try {
      const jsonString = fs.readFileSync(userFilePath, 'utf-8');
      userData = JSON.parse(jsonString);
    } catch (error) {
      userData = [];
    }

    res.status(200).json({
      success: true,
      user: userData
    });
  }
);

export const delay = (ms: number) => {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const processInitUsersLeaderBoard = async () => {

  console.log("Start processInitUsersLeaderBoard");

  const start = Date.now();

  const configs = await ContentConfig.findBy({
    contentId: Like("config_%")
  })

  const configFilePath = path.resolve(__dirname, '../../data/config.json');
  const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

  // Resolve the relative path to an absolute path
  const filePath = path.resolve(__dirname, '../../', configData.userFilePath); // Đường dẫn tới file CSV
  // check file exists
  if (!fs.existsSync(filePath)) {
    console.log('file not found', filePath);
    return;
  }

  const records = await getCSVForUsers(filePath);
  
  const accounts: AccountDto[] = convertToAccountDto(records);

  // cache
  let jsonData: RiotAccountDto[] = [];
  const cachedPath = path.resolve(__dirname, "../../data/user-riot-accounts.json");
  try {
    const jsonString = fs.readFileSync(cachedPath, 'utf-8');
    jsonData = JSON.parse(jsonString);
    console.log('loaded cached accounts', jsonData.length);
  } catch (error) {
    jsonData = [];
  }

  let dataAccounts: RiotAccountDto[] = [];
  for (const acc of accounts) {
    let accRes = jsonData.find(e => e.gameName == acc.gameName)
    if (accRes == null) {
      accRes = await getRiotAccountById(acc.gameName, acc.tagLine);
      await delay(1000);
    }
    if (accRes != null) {
      dataAccounts.push(accRes);
    }
  };
  fs.writeFileSync(cachedPath, JSON.stringify(dataAccounts), 'utf8');

  // console.log('dataAccounts', dataAccounts);

  const champion_id_raw = configs.find(e => e.contentId == 'config_champion_id');
  const champion_id = champion_id_raw?.translate[0].value;
  if (!champion_id) {
    console.log('champion_id is required');
    return;
  }

  // console.log('champion_id', champion_id);
  // console.log('dataAccounts', dataAccounts);

  for (const acc of dataAccounts.filter(e => e != null)) {
    if (acc?.puuid == null) continue;
    const championDetail = await getChampionMasteriesDetail(acc.puuid, champion_id);
    if (championDetail != null) {
      acc.championPoints = championDetail.championPoints;
    }
  }

  let result: LeaderBoardDto = {
    users: dataAccounts,
    createdIn: (Date.now() - start) / 1000,
    createdDate: new Date().toISOString()
  };
  
  const outputPath = path.resolve(__dirname, "../../data/user-leaderboard.json")
  fs.writeFile(outputPath, JSON.stringify(result), 'utf8', function(err: any) {
    if (err) throw err;
    console.log('write user json complete');
    }
  );

  // backup user-leaderboard.json by date string yyyy-mm-dd
  const dateString = new Date().toISOString().split('T')[0];
  const outputBackupPath = path.resolve(__dirname, `../../data/user-leaderboard-${dateString}.json`);
  fs.writeFile(outputBackupPath, JSON.stringify(result), 'utf8', function(err: any) {
    if (err) throw err;
    console.log('write user json backup complete');
    }
  );

  return {
    users: result.users,
    accounts: accounts.length,
  }
}

export const initUsersLeaderBoard = asyncHandler(
  async (req: Request, res: Response) => {

    const apiKey = (req.query.apiKey as string) || "0";
    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const result = await processInitUsersLeaderBoard();

    res.status(200).json({
      success: true,
      ...result,
    });
  }
);

export const testCron = async () => {
  const configFilePath = path.resolve(__dirname, '../../data/config.json');
    const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

    // Resolve the relative path to an absolute path
    const filePath = path.resolve(__dirname, '../../', configData.teamFilePath); // Đường dẫn tới file CSV
    const records = await getCSVForTeams(filePath);

    const teams: CsvTeamDto[] = convertToCsvTeamDto(records);
    const accounts = teams.flatMap(x => x.users);

    return accounts;
}

export const testController = asyncHandler(
  async (req: Request, res: Response) => {

    // const startDate: any = process.env.RIOT_START_DATE;
    // const unixStartTimestamp = new Date(startDate).getTime() / 1000;

    // const endDate: any = process.env.RIOT_END_DATE;
    // const unixEndTimestamp = Date.UTC(
    //   new Date(endDate).getUTCFullYear(),
    //   new Date(endDate).getUTCMonth(),
    //   new Date(endDate).getUTCDate(),
    //   23, 59, 59
    // ) / 1000;

    const configFilePath = path.resolve(__dirname, '../../data/config.json');
    const configData = JSON.parse(fs.readFileSync(configFilePath, 'utf-8'));

    // Resolve the relative path to an absolute path
    const filePath = path.resolve(__dirname, '../../', configData.teamFilePath); // Đường dẫn tới file CSV
    const records = await getCSVForTeams(filePath);

    const teams: CsvTeamDto[] = convertToCsvTeamDto(records);
    const accounts = teams.flatMap(x => x.users);

    res.status(200).json({
      success: true,
      accounts: accounts
      // start: unixStartTimestamp,
      // end: unixEndTimestamp,
    });
  }
);

// New POST endpoint to upload a CSV file with startDate and endDate
export const uploadCSV = [
  upload,
  asyncHandler(async (req: Request, res: Response) => {
    const { apiKey, startDate, endDate } = req.body;
    if (apiKey !== process.env.API_KEY) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

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

    // Define the destination path in the data folder
    const dataFolderPath = path.resolve(__dirname, "../../data/uploads");
    const clonedFilePaths: string[] = [];

    // Ensure the data folder exists
    if (!fs.existsSync(dataFolderPath)) {
      fs.mkdirSync(dataFolderPath);
    }

    // Copy the uploaded files to the data folder
    const filesToClone = [usersFile];
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-'); // Generate a timestamp string

    for (const file of filesToClone) {
      // Determine the file type and format the filename accordingly
      const fileType = 'user';
      const formattedFilename = `${fileType}_${timestamp}${path.extname(file.originalname)}`;
      const clonedFilePath = path.join(dataFolderPath, formattedFilename);

      // Copy the file to the data folder with the new formatted filename
      fs.copyFileSync(file.path, clonedFilePath);
      clonedFilePaths.push(clonedFilePath);

      // Clean up the original uploaded file
      fs.unlink(file.path, (err) => {
        if (err) {
          console.error('Error deleting the uploaded file:', err);
        }
      });
    }

    // Process the cloned CSV files
    const userAccounts: AccountDto[] = [];
    let userFilePath: string | null = null;

    for (const clonedFilePath of clonedFilePaths) {
      if (clonedFilePath.includes('user')) {
        const records = await getCSVForUsers(clonedFilePath);
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
    fs.writeFileSync(configFilePath, JSON.stringify(configData, null, 2), 'utf-8');

    res.status(200).json({
      success: true,
      message: 'File uploaded',
      data: {
        config: configData,
        totalUsers: userAccounts.length,
        demo3users: userAccounts.slice(0, 5),
      }
    });
  })
];

export const exportLeaderBoardCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const userFilePath = path.resolve(__dirname, "../../data/user-leaderboard.json");

    let userData: any[] = [];
    try {
      userData = JSON.parse(fs.readFileSync(userFilePath, 'utf-8'));
    } catch {}

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
);

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