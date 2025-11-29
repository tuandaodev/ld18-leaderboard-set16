export interface FindOneAccountResponse {
  success: boolean;
  data: Data;
}

export interface Data {
  id: number;
  createdAt: string;
  updatedAt: string;
  deleteAt: string | null;
  username: string;
  email: string;
  password: string;
  refreshToken: string | null;
  resetPasswordCode: string | null;
  role: number;
}
