import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

export enum CommunityEventStatus {
  Rejected = -1,
  New = 0,
  Approved = 1,
}


@Entity()
export class CommunityEvent extends Base {

  @Column({ type: 'varchar', nullable: false })
  @Index("Idx_CommunityEvent_UserId")
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  eventName: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'varchar', nullable: false })
  district: string;

  @Column({ type: 'timestamptz', nullable: false })
  registrationDeadline: Date;

  @Column({ type: 'timestamptz', nullable: false })
  eventStartTime: Date;

  @Column({ type: 'timestamptz', nullable: false })
  eventEndTime: Date;

  @Column({ type: 'varchar', nullable: false })
  venueAddress: string;

  @Column({ type: 'varchar', nullable: false })
  venueName: string;

  @Column({ type: 'varchar', nullable: false })
  eventType: string;

  @Column({ type: 'varchar', nullable: true })
  deviceType?: string;

  @Column({ type: 'text', nullable: false })
  eventDescription: string;

  @Column({ type: 'varchar', nullable: false })
  eventScale: string;

  @Column({ type: 'varchar', nullable: false })
  supportLevel: string;

  @Column({ type: 'varchar', nullable: false })
  bannerFile: string;

  @Column({ type: 'smallint', nullable: false, default: CommunityEventStatus.New })
  status: number;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;
}

