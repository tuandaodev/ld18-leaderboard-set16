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
  deleteAt: any
  campaignName: string
}

export interface Translate {
  lang: string
  text: string
  image: string
}


export interface FindAllCampaignsResponse {
  success: boolean;
  data: Result[];
}