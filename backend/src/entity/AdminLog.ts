import { Column, Entity } from "typeorm";
import { Base } from "./Base";

@Entity()
export class AdminLog extends Base {
  @Column()
  adminId: number;

  @Column()
  action: string;
}
