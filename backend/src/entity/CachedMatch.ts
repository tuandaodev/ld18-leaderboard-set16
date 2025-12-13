import { Column, Entity, Index } from "typeorm";
import { Base } from "./Base";

@Entity()
@Index(["matchId"], { unique: true })
export class CachedMatch extends Base {
  @Column({
    name: "match_id",
    type: "varchar",
    nullable: false,
    unique: true,
  })
  matchId: string;

  @Column({
    name: "end_of_game_result",
    type: "varchar",
    nullable: true,
  })
  endOfGameResult: string;

  @Column({
    name: "game_mode",
    type: "varchar",
    nullable: true,
  })
  gameMode: string;

  @Column({
    name: "game_creation",
    type: "bigint",
    nullable: true,
  })
  gameCreation: number;

  @Column({
    name: "participants",
    type: "jsonb",
    nullable: true,
  })
  participants: any[]; // Store participants array as JSON
}


