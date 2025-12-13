import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCacheAccountsAndMatches1765637897212 implements MigrationInterface {
    name = 'AddCacheAccountsAndMatches1765637897212'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cached_match" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "match_id" character varying NOT NULL, "end_of_game_result" character varying, "game_mode" character varying, "game_creation" bigint, "participants" jsonb, CONSTRAINT "UQ_a32098ccde1f4de5f60d3b53c3f" UNIQUE ("match_id"), CONSTRAINT "PK_3bcbf4369eca1f727ce5a076c7f" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_a32098ccde1f4de5f60d3b53c3" ON "cached_match" ("match_id") `);
        await queryRunner.query(`CREATE TABLE "cached_riot_account" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "puuid" character varying, "game_name" character varying NOT NULL, "tag_line" character varying NOT NULL, "refreshedAt" TIMESTAMP WITH TIME ZONE, "refreshedDate" date, "total_points" integer DEFAULT '0', "total_matches" integer DEFAULT '0', "is_completed" boolean DEFAULT false, "csv_order" integer, "error_message" character varying, CONSTRAINT "PK_4d4b8b127b6c6ab2f8defb268d4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_3e5aea9bb2ca0dc97c4e49d3a3" ON "cached_riot_account" ("game_name", "tag_line") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "public"."IDX_3e5aea9bb2ca0dc97c4e49d3a3"`);
        await queryRunner.query(`DROP TABLE "cached_riot_account"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_a32098ccde1f4de5f60d3b53c3"`);
        await queryRunner.query(`DROP TABLE "cached_match"`);
    }

}
