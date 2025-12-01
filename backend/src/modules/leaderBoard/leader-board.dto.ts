export class NotFoundAccountDto {
  gameName: string;
  tagLine: string;
  fullName: string;
  error: string;
}

export class AccountDto {
  gameName: string;
  tagLine: string;
  fullName: string;

  constructor(gameName: string, tagLine: string) {
    this.gameName = gameName?.trim();
    this.tagLine = tagLine?.trim();
    this.fullName = `${this.gameName}-${this.tagLine}`;
  }
}

export class CsvTeamDto {
  teamNumber: string;
  teamName: string;
  users: AccountDto[];

  constructor(teamNumber: string, teamName: string, users: AccountDto[]) {
    this.teamNumber = teamNumber;
    this.teamName = teamName;
    this.users = users;
  }
}

export class LeaderBoardDto {
  users: RiotAccountDto[];
  createdIn: number;
  createdDate: string;
}

export class RiotAccountDto {
  puuid: string;
  gameName: string;
  tagLine: string;
  totalPoints?: number;
}

export class MatchDetailDto {
  matchId: string;
  teamId: string;
  teamName: string;
  numofParticipants: number;
  gameMode: string;
  errors: string[];
}

export interface MatchInfo {
  matchId: string;
  endOfGameResult:    string;
  gameMode:           string;
  participants:       MinParticipant[];
}

export interface MinParticipant {
  riotIdGameName:                 string;
  riotIdTagline:                  string;
  placement:                        number;
  playersEliminated:               number;
  totalPoints?:                    number;
}

// export class LeaderBoardTeamsDto {
//   teams: LeaderBoardTeamDto[];
//   createdDate: string;
//   createdIn: number;
// }

export class LeaderBoardUserDto {
  gameName: string;
  tagLine: string;

  totalDamageDealt: number;
  matchId: string;
}

export class LeaderBoardUsersDto {
  users: LeaderBoardUserDto[];
  createdDate: string;
  createdIn: number;
}
