import { MigrationInterface, QueryRunner } from "typeorm";

export class InitDb1763663405219 implements MigrationInterface {
    name = 'InitDb1763663405219'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "admin_log" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "adminId" integer NOT NULL, "action" character varying NOT NULL, CONSTRAINT "PK_42b80ec4239a2d6ee856b340db9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "campaign" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "campaignName" character varying NOT NULL, "startDate" TIMESTAMP WITH TIME ZONE, "endDate" TIMESTAMP WITH TIME ZONE, "isActive" boolean NOT NULL DEFAULT false, "isAllowSubmit" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_0ce34d26e7f2eb316a3a592cdc4" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "community_event" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "userId" character varying NOT NULL, "eventName" character varying NOT NULL, "city" character varying NOT NULL, "district" character varying NOT NULL, "registrationDeadline" TIMESTAMP WITH TIME ZONE NOT NULL, "eventStartTime" TIMESTAMP WITH TIME ZONE NOT NULL, "eventEndTime" TIMESTAMP WITH TIME ZONE NOT NULL, "venueAddress" character varying NOT NULL, "venueName" character varying NOT NULL, "eventType" character varying NOT NULL, "deviceType" character varying, "eventDescription" text NOT NULL, "eventScale" character varying NOT NULL, "supportLevel" character varying NOT NULL, "bannerFile" character varying NOT NULL, "status" smallint NOT NULL DEFAULT '0', "rejectionReason" text, CONSTRAINT "PK_d3f5229ec711c492a19c91fc760" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "Idx_CommunityEvent_UserId" ON "community_event" ("userId") `);
        await queryRunner.query(`CREATE TABLE "content_config" ("contentId" character varying NOT NULL, "description" character varying NOT NULL, "valueType" character varying NOT NULL, "translate" jsonb, CONSTRAINT "PK_87f7dc87eb3e099c1b2806961c2" PRIMARY KEY ("contentId"))`);
        await queryRunner.query(`CREATE TABLE "event" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "eventName" character varying NOT NULL, "city" character varying NOT NULL, "eventStartTime" TIMESTAMP WITH TIME ZONE NOT NULL, "eventEndTime" TIMESTAMP WITH TIME ZONE NOT NULL, "eventType" character varying NOT NULL, "eventDescription" text NOT NULL, "bannerFile" character varying NOT NULL, "eventUrl" character varying NOT NULL, "totalPrize" character varying, "isPublic" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_30c2f3bbaf6d34a55f8ae6e4614" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "leader" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "fullName" character varying NOT NULL, "unsignedFullName" character varying, "email" character varying NOT NULL, "phone" character varying NOT NULL, "dateOfBirth" date NOT NULL, "city" character varying NOT NULL, "district" character varying NOT NULL, "facebookLink" character varying NOT NULL, "gameCharacterName" character varying, "gameUID" character varying, "communityGroups" text, "isGuildMaster" boolean NOT NULL DEFAULT false, "guildName" character varying, "managementExperience" text, "eventExperience" text, "avatar" character varying, "status" smallint NOT NULL DEFAULT '0', "totalPoint" integer, "rejectionReason" text, CONSTRAINT "PK_1d2e07dfb06ee7ab1c9cadca491" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "Idx_Leader_UserId" ON "leader" ("userId") `);
        await queryRunner.query(`CREATE INDEX "Idx_Leader_Status" ON "leader" ("status") `);
        await queryRunner.query(`CREATE TABLE "notification" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "userId" integer NOT NULL, "type" character varying NOT NULL, "title" character varying NOT NULL, "message" text NOT NULL, "relatedEntityId" integer, "relatedEntityType" character varying, "isRead" boolean NOT NULL DEFAULT false, CONSTRAINT "PK_705b6c7cdf9b2c2ff7ac7872cb7" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "Idx_Notification_UserId" ON "notification" ("userId") `);
        await queryRunner.query(`CREATE TABLE "partner_gaming_center" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "userId" character varying NOT NULL, "gamingCenterName" character varying NOT NULL, "gamingCenterAddress" character varying NOT NULL, "managerName" character varying NOT NULL, "openingHour" TIME NOT NULL, "closingHour" TIME NOT NULL, "machineConfiguration" character varying, "city" character varying NOT NULL, "district" character varying NOT NULL, "fanpage" character varying, "contactPhone" character varying NOT NULL, "email" character varying NOT NULL, "gamingCenterScale" character varying NOT NULL, "averagePlayPrice" character varying, "logoFile" character varying NOT NULL, "status" smallint NOT NULL DEFAULT '0', "rejectionReason" text, CONSTRAINT "PK_9240b10b1029c1b0c73f8b7ea2e" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "Idx_PartnerGamingCenter_UserId" ON "partner_gaming_center" ("userId") `);
        await queryRunner.query(`CREATE TABLE "user" ("id" SERIAL NOT NULL, "createdAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleteAt" TIMESTAMP WITH TIME ZONE, "fullname" character varying NOT NULL, "username" character varying NOT NULL, "email" character varying, "password" character varying, "profilePhoto" character varying, "refresh_token" character varying, "reset_password_code" character varying, "role" smallint NOT NULL DEFAULT '1', "source" smallint NOT NULL DEFAULT '1', "sourceId" character varying, "role_id" character varying, "uid" character varying, "social_url" character varying, "is_two_factor_enabled" boolean NOT NULL DEFAULT false, "otp_code" character varying, "otp_expires_at" TIMESTAMP, CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "user"`);
        await queryRunner.query(`DROP INDEX "public"."Idx_PartnerGamingCenter_UserId"`);
        await queryRunner.query(`DROP TABLE "partner_gaming_center"`);
        await queryRunner.query(`DROP INDEX "public"."Idx_Notification_UserId"`);
        await queryRunner.query(`DROP TABLE "notification"`);
        await queryRunner.query(`DROP INDEX "public"."Idx_Leader_Status"`);
        await queryRunner.query(`DROP INDEX "public"."Idx_Leader_UserId"`);
        await queryRunner.query(`DROP TABLE "leader"`);
        await queryRunner.query(`DROP TABLE "event"`);
        await queryRunner.query(`DROP TABLE "content_config"`);
        await queryRunner.query(`DROP INDEX "public"."Idx_CommunityEvent_UserId"`);
        await queryRunner.query(`DROP TABLE "community_event"`);
        await queryRunner.query(`DROP TABLE "campaign"`);
        await queryRunner.query(`DROP TABLE "admin_log"`);
    }

}
