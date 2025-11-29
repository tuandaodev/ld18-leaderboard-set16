export interface FindAllLogsResponse {
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
  id: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
  adminId: number;
  action: string;
}
