import { MigrationInterface, QueryRunner } from "typeorm";

export class InitContentConfig1764694038203 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        const translateJson = JSON.stringify([{
            lang: "vi",
            image: "",
            value: "<p class=\"ql-align-center\">Chế độ chơi: Xếp Hạng Mùa 16</p><p class=\"ql-align-center\">Cách tính điểm: Tùy vào thứ hạng của Cờ thủ trong trận đấu Xếp Hạng - Thường với thời gian tối thiểu là 20 phút/ trận đấu.</p><p class=\"ql-align-center\">Top 1: 10 Điểm</p><p class=\"ql-align-center\">Top 2: 8 Điểm</p><p class=\"ql-align-center\">Top 3: 6 Điểm</p><p class=\"ql-align-center\">Top 4: 4 Điểm</p><p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\">Thời gian:</p><p class=\"ql-align-center\">Chặng 1: 00:00 08.12 - 23:59 22.12</p><p class=\"ql-align-center\">Chặng 2: 00:00 23.12 - 06.01</p><p class=\"ql-align-center\"><br></p><p class=\"ql-align-center\">Bảng xếp hạng sẽ cập nhật vào 23:59 mỗi ngày</p><p class=\"ql-align-center\">Điểm số sẽ tính từ các kết quả trận đấu đạt được trong thời gian quy định, không phải từ lúc đăng ký sự kiện để đảm bảo tính công bằng cho người chơi đăng ký sau.</p><p><br></p><p>*Lưu ý:</p><p>Phần thưởng Xu ĐTCL sẽ nạp trực tiếp vào Riot ID đăng ký của anh em, Code sân đấu sẽ gửi vào Mail đăng ký Riot ID.</p><p>Phần thưởng sẽ là Xu ĐTCL trong phiên bản Mobile, anh em cờ thủ PC tải ĐTCL Mobile để nhận nếu có giải nhé!</p>"
        }]);
        
        await queryRunner.query(`
            INSERT INTO public.content_config ("contentId", description, "valueType", translate, "contentGroup", "controlType", meta, "isPublic", "order") 
            VALUES ('f3_rule', 'Frame 3: Thể lệ', 'text', $json$${translateJson}$json$::jsonb, 'Frame 3', 'textarea', NULL, true, 0)
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
    }

}
