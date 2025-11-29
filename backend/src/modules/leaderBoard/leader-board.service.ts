import axios from "axios";
import { parse } from 'csv-parse';
import fs from "fs";
import { AccountDto, CsvTeamDto, LeaderBoardTeamDto, LeaderBoardTeamsDto, MatchDetailDto, MatchInfo, MinParticipant } from "./leader-board.dto";
import { ChampionMasteriesDetail, Participant, RiotMatchDto } from "./leader-board.riot-dto";
import path from "path";

export const getRiotAccountByIdURL = (gameName: string, gameTag: string): string => {
  const apiKey = process.env.RIOT_TOKEN;
  return `https://asia.api.riotgames.com/riot/account/v1/accounts/by-riot-id/${gameName}/${gameTag}?api_key=${apiKey}`;
};

export const getRiotAccountById = async (gameName: string, gameTag: string): Promise<any> => {
  const url = getRiotAccountByIdURL(gameName, gameTag);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Error calling API for ${gameName} ${gameTag}:`, error.message);
    return null;
  }
};

export const groupBy = (input: any, key: any) => {
  return input.reduce((acc: any, currentValue: any) => {
    let groupKey = currentValue[key];
    if (!acc[groupKey]) {
      acc[groupKey] = [];
    }
    acc[groupKey].push(currentValue);
    return acc;
  }, {});
};

export const getMatchesURL = (puuid: string, start: number, count: number, startDate: string, endDate: string): string => {
  const apiKey = process.env.RIOT_TOKEN; // Thay YOUR_API_KEY bằng API Key của bạn
  // const startTime = process.env.RIOT_START_TIMESTAMP;
  // const endTime = process.env.RIOT_END_TIMESTAMP;
  // const startDate: any = process.env.RIOT_START_DATE;
  const localStartDate = `${startDate}T00:00:00+07:00`;
  const localEndDate = `${endDate}T23:59:59+07:00`;
  const startTime = new Date(localStartDate).getTime() / 1000;
  const endTime = new Date(localEndDate).getTime() / 1000;

  return `https://sea.api.riotgames.com/tft/match/v1/matches/by-puuid/${puuid}/ids?start=${start}&count=${count}&api_key=${apiKey}&startTime=${startTime}&endTime=${endTime}`;
}

export const getMatches = async (puuid: string, start: number, count: number, startDate: string, endDate: string): Promise<string[]> => {
  const url = getMatchesURL(puuid, start, count, startDate, endDate);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Error calling API to get matches for ${puuid} - start: ${start}:`, error.message);
    return [];
  }
};

export const getMatchDetailURL = (matchId: string): string => {
  const apiKey = process.env.RIOT_TOKEN; // Thay YOUR_API_KEY bằng API Key của bạn
  return `https://sea.api.riotgames.com/tft/match/v1/matches/${matchId}?api_key=${apiKey}`;
}

export const getMatchDetail = async (matchId: string): Promise<RiotMatchDto> => {
  const url = getMatchDetailURL(matchId);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    console.error(`Error calling API to get match detail: ${matchId}`, error.message);
    return null as any;
  }
};

export const getChampionMasteriesURL = (puuid: string, championId: string): string => {
  const apiKey = process.env.RIOT_TOKEN; // Thay YOUR_API_KEY bằng API Key của bạn
  // const championId = process.env.CHAMPION_ID;
  return `https://vn2.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-puuid/${puuid}/by-champion/${championId}?api_key=${apiKey}`;
}

export const getChampionMasteriesDetail = async (puuid: string, championId: string): Promise<ChampionMasteriesDetail> => {
  const url = getChampionMasteriesURL(puuid, championId);
  try {
    const response = await axios.get(url);
    return response.data;
  } catch (error: any) {
    // console.log('url', url);
    console.error(`Error calling API to get champion masteries: ${puuid}`, error.message);
    return null as any;
  }
};

export const getCSVForTeams = async (filePath: string) => {
  const records = [];
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse(
      { delimiter: ';', columns: true }
    ));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

export const getCSVForUsers = async (filePath: string) => {
  const records = [];
  const parser = fs
    .createReadStream(filePath)
    .pipe(parse(
    ));
  for await (const record of parser) {
    // Work with each record
    records.push(record);
  }
  return records;
};

export const extractGameNameAndTagLine = (input: string): AccountDto => {
  const [gameName, tagLine] = input.split('-');
  return new AccountDto(gameName, tagLine);
}

export const convertToCsvTeamDto = (records: any[]): CsvTeamDto[] => {
  return records.map(record => {
    const teamNumber = record.TeamNumber;
    const teamName = record.TeamName;
    const users = [record.User1, record.User2]
      .filter(user => user?.includes('-')) // Ensure it matches the gameName-TagLine format
      .map(user => extractGameNameAndTagLine(user));

    return new CsvTeamDto(teamNumber, teamName, users);
  });
}


export const convertToAccountDto = (records: any[]): AccountDto[] => {
  return records.map(record => {
    const user = extractGameNameAndTagLine(record[0]);
    return new AccountDto(user.gameName, user.tagLine);
  });
}

// firstHeroId is championId
export const calculateLeaderBoardForTeams = (teamAccounts: CsvTeamDto[], matches: MatchInfo[], firstHeroId: string, secondHeroList: string[]): LeaderBoardTeamsDto => {

  let teamResults: LeaderBoardTeamDto[] = teamAccounts.map(x => (
    {
      teamNumber: x.teamNumber,
      teamName: x.teamName,
      users: x.users,
      totalWinMatchCount: 0
    }
  ));

  // TODO: turn this on prod
  const filterMatches = matches.filter(e => e.endOfGameResult == 'GameComplete');
  // const filterMatches = matches;
  for (let i = 0; i < filterMatches.length; i++) {
   
    const match = filterMatches[i];
    if (match == null) {
      continue;
    }

    // skip if there is any puuid = 'BOT'
    if (match.participants.some(p => p.riotIdTagline === 'BOT')) {
      continue;
    }

    const teamParticipants = groupBy(match.participants, 'teamId');
    for (const key in teamParticipants)
      {
         const _participants: Participant[] = teamParticipants[key];
         const participants = _participants.map(x => `${x.riotIdGameName}-${x.riotIdTagline}`.toLowerCase());
         const team = teamResults.find(e => e.users.every(user => participants.includes(user.fullName.toLowerCase())));
         if (team != null) {
          // check all users in same team
          const teamParticipants = _participants.filter(e => team.users.map(x => x.fullName.toLowerCase()).includes(`${e.riotIdGameName}-${e.riotIdTagline}`.toLowerCase()));
          if (teamParticipants.every(e => e.win)) {
            // console.log(`${team.teamName} has the first hero ${firstHeroId}`, match.matchId);
            // check if the team has the first hero
            const firstHero = teamParticipants.find(e => e.championId == parseInt(firstHeroId));
            // console.log('firstHero', firstHero);
            if (firstHero != null) {
              // console.log(`${team.teamName} has the first hero ${firstHero.championName}`);
              // other users in the team must have the second hero
              // console.log('teamParticipants', teamParticipants);
              const otherUsers = teamParticipants.filter(e => e.riotIdGameName != firstHero.riotIdGameName);
              if (otherUsers.every(e => secondHeroList.includes(e.championName.toLowerCase()))) {
                // console.log(`${team.teamName} has the second hero ${otherUsers.map(e => e.championName).join(", ")}`);
                team.totalWinMatchCount++;
              }
            }
          }
         }
      }
  }

  let matchDetails: MatchDetailDto[] = [];

  for (let i = 0; i < matches.length; i++) {
    const match = matches[i];
    if (match == null) {
      continue;
    }
    
    let matchDetail: MatchDetailDto = {
      teamId: "",
      teamName: "",
      matchId: match.matchId,
      numofParticipants: -1,
      gameMode: match.gameMode,
      errors: [],
    };
    
    const _participants: MinParticipant[] = match.participants;
    const participants = match.participants.map(x => `${x.riotIdGameName}-${x.riotIdTagline}`);

    if (match.participants.some(p => p.riotIdTagline === 'BOT')) {
      matchDetail.errors.push("GAME MODE IS BOT");
    }

    let countP = 0;
    const team = teamResults.find(e => e.users.some(user => participants.includes(user.fullName)));
    if (team != null) {
      // Count number of participants in the team
      countP = _participants.filter(e => team.users.map(x => x.fullName).includes(`${e.riotIdGameName}-${e.riotIdTagline}`)).length;

      matchDetail.teamId = team.teamNumber;
      matchDetail.teamName = team.teamName;
      matchDetail.numofParticipants = countP;

      if (countP < 2) {
        matchDetail.errors.push("NUMER OF PLAYERS");
      }
    }

    matchDetails.push(matchDetail);
    
  }

  const dataCSV = matchDetails.reduce((acc, user) => {
      acc += `${user.matchId}, ${user.teamId}, ${user.gameMode}, ${user.numofParticipants}, ${user.errors.join("-")}\n`;
      return acc;
    }, 
    `MatchId, TeamId, GameMode, NumOfParticipants, Error\n` // column names for csv
  );

  const outputPath = path.resolve(__dirname, "../../data/team-match-details.csv")
  fs.writeFileSync(outputPath, dataCSV, 'utf8')

  return {
    teams: teamResults,
    createdDate: new Date().toLocaleString(),
    createdIn: 0
  };
};
