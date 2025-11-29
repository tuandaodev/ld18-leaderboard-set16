export interface FindAllGiftCodeConfigResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  total: number;
  page: number;
  pageSize: number;
  result: GiftCodeConfigResult[];
  hasNext: boolean;
}

export interface GiftCodeConfigResult {
  id: number
  createdAt: string
  updatedAt: string
  deleteAt: any
  level: number
  itemId: number
  itemName: string
  quantity: number
}