import { MigrationInterface, QueryRunner } from "typeorm";

export class AddCsvOrderToCachedRiotAccount1765629718906 implements MigrationInterface {
    name = 'AddCsvOrderToCachedRiotAccount1765629718906'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cached_riot_account" ADD "csv_order" integer`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "cached_riot_account" DROP COLUMN "csv_order"`);
    }

}
