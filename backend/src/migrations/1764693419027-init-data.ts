import { MigrationInterface, QueryRunner } from "typeorm";

export class InitData1764693419027 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public."user" ("createdAt", "updatedAt", "deleteAt", fullname, username, email, password, "profilePhoto", refresh_token, reset_password_code, role, source, "sourceId", role_id, uid, social_url, is_two_factor_enabled, otp_code, otp_expires_at) VALUES ('2025-11-20 18:19:01.75487+00', '2025-11-20 18:19:01.75487+00', NULL, 'Admin', 'admin', 'admin@vnggames.com', '$2b$12$GvhOVZM1D4QjsBJ/DJJrXuix9sfBtWsscIGZZN3FImK7fMN7jMqvW', NULL, NULL, NULL, 2, 1, NULL, NULL, NULL, NULL, false, NULL, NULL);
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user" WHERE "username" = 'admin';
        `);
    }

}
