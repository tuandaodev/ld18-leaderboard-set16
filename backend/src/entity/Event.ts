import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity()
export class Event extends Base {

  @Column({ type: 'varchar', nullable: false })
  eventName: string;

  @Column({ type: 'varchar', nullable: false })
  city: string;

  @Column({ type: 'timestamptz', nullable: false })
  eventStartTime: Date;

  @Column({ type: 'timestamptz', nullable: false })
  eventEndTime: Date;

  @Column({ type: 'varchar', nullable: false })
  eventType: string;

  @Column({ type: 'text', nullable: false })
  eventDescription: string;

  @Column({ type: 'varchar', nullable: false })
  bannerFile: string;

  @Column({ type: 'varchar', nullable: false })
  eventUrl: string;

  @Column({ type: 'varchar', nullable: true })
  totalPrize: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isPublic: boolean;
}
