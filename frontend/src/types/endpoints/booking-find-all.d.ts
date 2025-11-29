export interface BookingFindAllResponse {
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
  time: string;
  email: string;
  name: string;
  riotId: string;
  isBlocked: boolean;
}
