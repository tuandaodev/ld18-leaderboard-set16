export interface AuthMeResponse {
  success: boolean | number;
  data: {
    email: string | null;
    socialUrl?: string | null;
    roleId?: string | null;
    uid?: string | null;
  };
}




