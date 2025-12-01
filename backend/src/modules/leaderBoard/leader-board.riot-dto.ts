export interface RiotMatchDto {
  metadata: Metadata;
  info:     Info;
}

export interface Info {
  endOfGameResult:    string;
  gameCreation:       number;
  gameId:             number;
  game_datetime:      number;
  game_length:        number;
  game_version:       string;
  mapId:              number;
  participants:       Participant[];
  queueId:            number;
  queue_id:           number;
  tft_game_type:      string; // "pairs" or "standard"
  tft_set_core_name:  string;
  tft_set_number:     number;
}

export interface Participant {
  companion:                Companion;
  gold_left:               number;
  last_round:              number;
  level:                   number;
  missions:                { [key: string]: number };
  partner_group_id:        number;
  placement:               number;
  players_eliminated:      number;
  puuid:                   string;
  riotIdGameName:          string;
  riotIdTagline:           string;
  time_eliminated:         number;  // in seconds
  total_damage_to_players: number;
  traits:                  Trait[];
  units:                   Unit[];
  win:                     boolean;
}

export interface Companion {
  content_ID: string;
  item_ID:    number;
  skin_ID:    number;
  species:    string;
}

export interface Trait {
  name:        string;
  num_units:   number;
  style:       number;
  tier_current: number;
  tier_total:  number;
}

export interface Unit {
  character_id: string;
  itemNames:    string[];
  name:         string;
  rarity:       number;
  tier:         number;
}

export interface Metadata {
  data_version:  string;
  match_id:      string;
  participants: string[];
}


export interface ChampionMasteriesDetail {
  puuid: string
  championId: number
  championLevel: number
  championPoints: number
  lastPlayTime: number
  championPointsSinceLastLevel: number
  championPointsUntilNextLevel: number
  markRequiredForNextLevel: number
  tokensEarned: number
  championSeasonMilestone: number
}