import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity()
export class Event extends Base {

  @Column({ type: 'varchar', nullable: false })
  eventName: string;

  @Column({ type: 'varchar', nullable: false })
  bannerFile: string;

  @Column({ type: 'varchar', nullable: false })
  eventUrl: string;

  @Column({ type: 'boolean', nullable: false, default: false })
  isPublic: boolean;

  @Column({ type: 'integer', nullable: false, default: 0 })
  priority: number;
}
