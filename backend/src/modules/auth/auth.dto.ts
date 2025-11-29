import { UserRole } from "../../entity/User";

export type TokenPairDTO = {
  access_token: string;
  refresh_token: string;
};

export class CreateAdminDTO {
  username: string;
  email: string;
  password: string;
  role: UserRole;
}

export class SignInAdminDTO {
  username?: string;
  email?: string;
  password: string;
  isFromAdminCP?: boolean;
}

export class ResetPasswordDto {
  id: number;
  newPassword: string;
}

export class ForgotPasswordDto {
  email: string;
  username: string;
  newPassword: string;
}

export class SignUpDto {
  username: string;
  email: string;
  password: string;
  roleId?: string;
  uid?: string;
  socialUrl?: string;
  termsAgreedAt?: string;
}

export class VerifyOTPDTO {
  username: string;
  otpCode: string;
}