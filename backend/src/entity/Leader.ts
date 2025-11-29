import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

export enum LeaderStatus {
  Rejected = -1,
  New = 0,
  Approved = 1,
}

@Entity()
export class Leader extends Base {

  @Column({ type: 'integer', nullable: false })
  @Index("Idx_Leader_UserId")
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  fullName: string;

  @Column({ type: 'varchar', nullable: true })
  unsignedFullName: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  phone: string;

  @Column({ type: 'date', nullable: false })
  dateOfBirth: Date;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  district: string;

  @Column({ type: 'varchar', nullable: false })
  facebookLink: string;

  @Column({ type: 'varchar', nullable: true })
  gameCharacterName: string;

  @Column({ type: 'varchar', nullable: true })
  gameUID: string;

  @Column({ type: 'text', nullable: true })
  communityGroups: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isGuildMaster: boolean;

  @Column({ type: 'varchar', nullable: true })
  guildName: string;

  @Column({ type: 'text', nullable: true })
  managementExperience: string;

  @Column({ type: 'text', nullable: true })
  eventExperience: string;

  @Column({ type: 'varchar', nullable: true })
  avatar: string;

  @Column({ type: 'smallint', nullable: false, default: LeaderStatus.New })
  @Index("Idx_Leader_Status")
  status: number;

  @Column({ type: 'integer', nullable: true })
  totalPoint: number;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;
}

