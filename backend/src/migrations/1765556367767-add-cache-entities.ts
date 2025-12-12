import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCacheEntities1765556367767 implements MigrationInterface {
    name = 'AddCacheEntities1765556367767'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "cached_riot_account" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "puuid" character varying, "game_name" character varying NOT NULL, "tag_line" character varying NOT NULL, "total_points" integer DEFAULT '0', "data" jsonb, CONSTRAINT "PK_cached_riot_account" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cached_riot_account_game_name_tag_line" ON "cached_riot_account" ("game_name", "tag_line")`);
        await queryRunner.query(`CREATE TABLE "cached_match" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "match_id" character varying NOT NULL, "end_of_game_result" character varying, "game_mode" character varying, "game_creation" bigint, "participants" jsonb, CONSTRAINT "UQ_cached_match_match_id" UNIQUE ("match_id"), CONSTRAINT "PK_cached_match" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE UNIQUE INDEX "IDX_cached_match_match_id" ON "cached_match" ("match_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_cached_match_match_id"`);
        await queryRunner.query(`DROP TABLE "cached_match"`);
        await queryRunner.query(`DROP INDEX "IDX_cached_riot_account_game_name_tag_line"`);
        await queryRunner.query(`DROP TABLE "cached_riot_account"`);
    }

}

