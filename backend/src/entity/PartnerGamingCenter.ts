import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

export enum PartnerGamingCenterStatus {
  Rejected = -1,
  New = 0,
  Approved = 1,
}

@Entity()
export class PartnerGamingCenter extends Base {

  @Column({ type: 'varchar', nullable: false })
  @Index("Idx_PartnerGamingCenter_UserId")
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  gamingCenterName: string;

  @Column({ type: 'varchar', nullable: false })
  gamingCenterAddress: string;

  @Column({ type: 'varchar', nullable: false })
  managerName: string;

  @Column({ type: 'time', nullable: false })
  openingHour: string;

  @Column({ type: 'time', nullable: false })
  closingHour: string;

  @Column({ type: 'varchar', nullable: true })
  machineConfiguration: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  district: string;

  @Column({ type: 'varchar', nullable: true })
  fanpage: string;

  @Column({ type: 'varchar', nullable: false })
  contactPhone: string;

  @Column({ type: 'varchar', nullable: false })
  email: string;

  @Column({ type: 'varchar', nullable: false })
  gamingCenterScale: string;

  @Column({ type: 'varchar', nullable: true })
  averagePlayPrice: string;

  @Column({ type: 'varchar', nullable: false })
  logoFile: string;

  @Column({ type: 'smallint', nullable: false, default: PartnerGamingCenterStatus.New })
  status: number;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;
}

