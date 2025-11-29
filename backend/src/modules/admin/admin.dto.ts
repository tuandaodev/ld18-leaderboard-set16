import { UserRole, User } from "../../entity/User";

export class UpdateAdminDTO {
  id: number;
  username: string;
  email: string;
  role: UserRole;
  fullname: string;
}

export class BaseUserDto {
  id: number;

  username: string;
  email: string;
  role: UserRole;
  isTwoFactorEnabled?: boolean;
  termsAgreedAt?: Date;

  init(user: User) {
    this.id = user.id;
    this.username = user.username;
    this.email = user.email;
    this.role = user.role;
    this.isTwoFactorEnabled = user.isTwoFactorEnabled;
    this.termsAgreedAt = user.termsAgreedAt;
  }
}
