export interface SignUpResponse {
  success: boolean;
  message: string;
  data: Data;
  access_token: string;
  refresh_token: string;
}

export interface Data {
  id: number;
  username: string;
  email: string;
  roleId?: string;
  uid?: string;
  socialUrl?: string;
}
