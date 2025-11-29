import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

export enum NotificationType {
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
  INFO = "INFO",
}

@Entity()
export class Notification extends Base {
  @Column({ type: 'integer', nullable: false })
  @Index("Idx_Notification_UserId")
  userId: number;

  @Column({ type: 'varchar', nullable: false })
  type: string;

  @Column({ type: 'varchar', nullable: false })
  title: string;

  @Column({ type: 'text', nullable: false })
  message: string;

  @Column({ type: 'integer', nullable: true })
  relatedEntityId: number | null;

  @Column({ type: 'varchar', nullable: true })
  relatedEntityType: string | null;

  @Column({ type: 'boolean', nullable: false, default: false })
  isRead: boolean;
}

