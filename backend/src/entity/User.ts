import { Column, Entity, OneToMany, ManyToOne } from "typeorm";
import { Base } from "./Base";

export enum UserRole {
  USER = 1,
  ADMIN = 2
}

export enum UserSource {
  LOCAL = 1,
  GOOGLE,
  FACEBOOK,
  TIKTOK,
}

@Entity()
export class User extends Base {

  @Column({
    name: "fullname",
    nullable: false,
  })
  fullname: string;

  @Column()
  username: string;

  // @Column({
  //   unique: true,
  // })
  @Column({
    name: "email",
    nullable: true,
  })
  email: string;

  @Column({
    name: "password",
    nullable: true,
  })
  password: string;

  @Column({
    name: "profilePhoto",
    nullable: true,
  })
  profilePhoto: string;

  @Column({
    name: "refresh_token",
    type: 'varchar',
    nullable: true,
  })
  refreshToken?: string | null;

  @Column({
    name: "reset_password_code",
    nullable: true,
  })
  resetPasswordCode: string;

  @Column({ type: 'smallint', nullable: false, default: UserRole.USER })
  role: number;

  @Column({ type: 'smallint', nullable: false, default: UserSource.LOCAL })
  source: number;

  @Column({
    name: "sourceId",
    nullable: true,
  })
  sourceId: string;


  // Additional fields
  @Column({
    name: "role_id",
    nullable: true,
  })
  roleId: string;

  @Column({
    name: "uid",
    nullable: true,
  })
  uid: string;

  @Column({
    name: "social_url",
    nullable: true,
  })
  socialUrl: string;

  @Column({
    name: "is_two_factor_enabled",
    type: 'boolean',
    nullable: false,
    default: false,
  })
  isTwoFactorEnabled: boolean;

  @Column({
    name: "otp_code",
    nullable: true,
  })
  otpCode: string;

  @Column({
    name: "otp_expires_at",
    type: "timestamptz",
    nullable: true,
  })
  otpExpiresAt: Date;

  @Column({
    name: "terms_agreed_at",
    type: "timestamptz",
    nullable: true,
  })
  termsAgreedAt: Date;
}
