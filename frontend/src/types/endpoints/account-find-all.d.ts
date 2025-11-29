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
  id: number;
  username: string;
  email: string;
  role: number;
  isTwoFactorEnabled?: boolean;
}


