import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDatabase1764693369392 implements MigrationInterface {
    name = 'InitDatabase1764693369392'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_log" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "adminId" integer NOT NULL, "action" character varying NOT NULL, CONSTRAINT "PK_42b80ec4239a2d6ee856b340db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "campaign" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "campaignName" character varying NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE, "endDate" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT false, "isAllowSubmit" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "content_config" ("contentId" character varying NOT NULL, "contentGroup" character varying, "description" character varying NOT NULL, "valueType" character varying NOT NULL, "controlType" character varying NOT NULL DEFAULT 'textinput', "meta" jsonb, "translate" jsonb, "isPublic" boolean NOT NULL DEFAULT true, "order" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_87f7dc87eb3e099c1b2806961c2" PRIMARY KEY ("contentId"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "eventName" character varying NOT NULL, "bannerFile" character varying NOT NULL, "eventUrl" character varying NOT NULL, "isPublic" boolean NOT NULL DEFAULT false, "priority" integer NOT NULL DEFAULT '0', CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "fullname" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying, "password" character varying, "profilePhoto" character varying, "refresh_token" character varying, "reset_password_code" character varying, "role" smallint NOT NULL DEFAULT '1', "source" smallint NOT NULL DEFAULT '1', "sourceId" character varying, "role_id" character varying, "uid" character varying, "social_url" character varying, "is_two_factor_enabled" boolean NOT NULL DEFAULT false, "otp_code" character varying, "otp_expires_at" TIMESTAMP WITH TIME ZONE, "terms_agreed_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "content_config"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
        await queryRunner.query(`DROP TABLE "admin_log"`);
    }

}
