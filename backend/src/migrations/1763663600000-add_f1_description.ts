import { MigrationInterface, QueryRunner } from "typeorm";

export class AddF1Description1763663600000 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            INSERT INTO public.content_config ("contentId", description, "valueType", translate) VALUES (
                'f1_description',
                'Frame 1: Mô tả',
                'text',
                '[{"lang": "vi", "image": "", "value": "Chương trình phát triển cộng đồng chính thức của Nghịch Thủy Hàn - một chốn giang hồ riêng để cùng nhau kết nối - đồng hành - và hỗ trợ những người chơi tâm huyết đang xây dựng các bang hội, cộng đồng và câu lạc bộ địa phương trên toàn quốc."}]'
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            DELETE FROM public.content_config WHERE "contentId" = 'f1_description';
        `);
    }

}

