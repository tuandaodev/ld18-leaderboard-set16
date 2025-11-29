import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity()
export class Campaign extends Base {

  @Column({ type: 'varchar', nullable: false })
  campaignName: string;

  @Column({ type: 'timestamptz', nullable: true })
  startDate: Date;

  @Column({ type: 'timestamptz', nullable: true })
  endDate: Date;

  @Column({ default: false })
  isActive: boolean;

  @Column({ default: false })
  isAllowSubmit: boolean;
}