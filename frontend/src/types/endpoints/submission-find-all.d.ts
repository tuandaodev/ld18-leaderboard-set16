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
  userId: number
  videoUrl: string
  approvedAt?: string
  status: number
  videoId: string;
  likeCount: number
  viewCount: number
  point: number
  imageUrl: string
  verifiedVideoId: string
  verifiedAuthorId: string
  refreshedAt: string
  message: string
  creator: SubmissionCreator
}

export interface SubmissionCreator {
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
  langCode: string
  profileUrl: string
  profileId: string
  profileName: string
  profileImage: string
  verifiedProfileId: string
  verifiedProfileName: string
  verifiedUniqueId: string
  totalPoint: number
  address: string
  level: number
  claimedLevel: number
  riotId: string
  identityFrontImage: string
  identityBackImage: string
  followerCount: number
  heartCount: number
  identityNumber: string
  zalopayPhoneNumber: string
  zalopayId: string
  discordUsername: string
}