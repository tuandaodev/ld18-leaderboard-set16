import { MigrationInterface, QueryRunner } from "typeorm";

export class AddTermsAgreedAt1764304202761 implements MigrationInterface {
    name = 'AddTermsAgreedAt1764304202761'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD "terms_agreed_at" TIMESTAMP WITH TIME ZONE`);
        await queryRunner.query(`ALTER TABLE "leader" ALTER COLUMN "district" DROP NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp_expires_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "otp_expires_at" TIMESTAMP WITH TIME ZONE`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "otp_expires_at"`);
        await queryRunner.query(`ALTER TABLE "user" ADD "otp_expires_at" TIMESTAMP`);
        await queryRunner.query(`ALTER TABLE "leader" ALTER COLUMN "district" SET NOT NULL`);
        await queryRunner.query(`ALTER TABLE "user" DROP COLUMN "terms_agreed_at"`);
    }

}
