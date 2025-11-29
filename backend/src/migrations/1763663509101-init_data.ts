import { MigrationInterface, QueryRunner } from "typeorm";

export class InitData1763663509101 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public."user" ("createdAt", "updatedAt", "deleteAt", fullname, username, email, password, "profilePhoto", refresh_token, reset_password_code, role, source, "sourceId", role_id, uid, social_url, is_two_factor_enabled, otp_code, otp_expires_at) VALUES ('2025-11-20 18:19:01.75487+00', '2025-11-20 18:19:01.75487+00', NULL, 'Admin', 'admin', 'admin@vnggames.com', '$2b$12$GvhOVZM1D4QjsBJ/DJJrXuix9sfBtWsscIGZZN3FImK7fMN7jMqvW', NULL, NULL, NULL, 2, 1, NULL, NULL, NULL, NULL, false, NULL, NULL);
        `);

        await queryRunner.query(`
            INSERT INTO public.content_config ("contentId", description, "valueType", translate) VALUES ('f2_program_info', 'Frame 2: Thông tin chương trình Thủ Lĩnh Cộng Đồng', 'text', '[]');
            INSERT INTO public.content_config ("contentId", description, "valueType", translate) VALUES ('f2_avatar_image', 'Frame 2: Avatar image', 'image', '[]');
            INSERT INTO public.content_config ("contentId", description, "valueType", translate) VALUES ('f4_description', 'Frame 4: Mô tả', 'text', '[]');
            INSERT INTO public.content_config ("contentId", description, "valueType", translate) VALUES ('f4_cta_url', 'Frame 4: URL button TÌM HIỂU NGAY', 'text', '[]');
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM "user" WHERE "username" = 'admin';
        `);
        await queryRunner.query(`
            DELETE FROM public.content_config WHERE "contentId" = 'f4_description';
            DELETE FROM public.content_config WHERE "contentId" = 'f4_cta_url';
            DELETE FROM public.content_config WHERE "contentId" = 'f2_avatar_image';
            DELETE FROM public.content_config WHERE "contentId" = 'f2_program_info';
        `);
    }

}
