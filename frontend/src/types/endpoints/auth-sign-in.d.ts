export interface SignInResponse {
  success: number;
  requiresOTP?: boolean;
  message?: string;
  access_token?: string;
  refresh_token?: string;
  role?: number;
  roleString?: string;
  error?: string;
}
