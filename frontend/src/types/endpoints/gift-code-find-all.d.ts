export interface FindAllResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  total: number;
  page: number;
  pageSize: number;
  result: Result[];
  hasNext: boolean;
}

export interface Result {
  id: number
  createdAt: string
  updatedAt: string
  deleteAt: Date
  createdBy: number
  updatedBy: number
  deleteBy: number
  userId: number
  creator: GiftCodeCreator
  redeemedAt: Date
  level: number
  itemId: string
  itemName: string
  quantity: number
  translate: ContentTranslate[]
}

export interface ContentTranslate {
  lang: string
  value: string
  image: string
}

export interface GiftCodeCreator {
  id: number
  createdAt: string
  updatedAt: string
  deleteAt: Date
  userId: number
  creatorName: string
  inGameName: string
  email: string
  inGameId: string
  roleId: string
  countryCode: string
  profileUrl: string
  profileId: string
  profileName: string
  verifiedProfileId: string
  verifiedProfileName: string
  verifiedUniqueId: string
  totalPoint: number
  level: number
  claimedLevel: number
  agree: boolean
}