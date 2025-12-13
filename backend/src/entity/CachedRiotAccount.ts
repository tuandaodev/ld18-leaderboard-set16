import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

@Entity()
@Index(["gameName", "tagLine"], { unique: true })
export class CachedRiotAccount extends Base {
  @Column({
    name: "puuid",
    type: "varchar",
    nullable: true,
  })
  puuid?: string | null;

  @Column({
    name: "game_name",
    type: "varchar",
    nullable: false,
  })
  gameName: string;

  @Column({
    name: "tag_line",
    type: "varchar",
    nullable: false,
  })
  tagLine: string;

  @Column({ type: 'timestamptz', nullable: true })
  refreshedAt: Date;

  @Column({ type: 'date', nullable: true })
  refreshedDate: string;

  @Column({
    name: "total_points",
    type: "integer",
    nullable: true,
    default: 0,
  })
  totalPoints?: number;

  @Column({
    name: "data",
    type: "jsonb",
    nullable: true,
  })
  data: any; // Store the full RiotAccountDto data as JSON
}


