import "dotenv/config";

import { DataSource } from "typeorm";
import { AdminLog } from "./src/entity/AdminLog";
import { Campaign } from "./src/entity/Campaign";
import { CommunityEvent } from "./src/entity/CommunityEvent";
import { ContentConfig, ControlType } from "./src/entity/ContentConfig";
import { Leader } from "./src/entity/Leader";
import { PartnerGamingCenter } from "./src/entity/PartnerGamingCenter";
import { User, UserRole } from "./src/entity/User";
import { Notification } from "./src/entity/Notification";
import { Event } from "./src/entity/Event";

const bcrypt = require("bcrypt");

const SeedDatasource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  // database: process.env.DB_TEST_NAME,
  synchronize: true,
  logging: false,
  entities: [
    AdminLog, User, Leader, ContentConfig, Campaign, CommunityEvent, Event, PartnerGamingCenter, Notification
  ],
  subscribers: [],
  migrations: [],
  // dropSchema: process.env.NODE_ENV === "development" ? true : false,
});

const main = async () => {
  console.log("\n[seed]: starting...");
  await SeedDatasource.initialize();

  const queryRunner = SeedDatasource.createQueryRunner();
  await queryRunner.query(`
    DO
    $func$
    BEGIN
      EXECUTE (
        SELECT 'TRUNCATE TABLE ' || string_agg(oid::regclass::text, ', ') || ' CASCADE'
          FROM pg_class
          WHERE relkind = 'r'
          AND relnamespace = 'public'::regnamespace
      );
    END
    $func$;
  `);
  await queryRunner.release();
  

  console.log("[seed]: seeding admin");
  await _seedAdmin();

  console.log("[seed]: closing seed connection");
  await SeedDatasource.destroy();
  console.log("[seed]: done\n");
};

const _seedAdmin = async () => {
  let _admin = await User.findOneBy({
    username: "admin",
  });

  if (_admin) {
    return;
  }

  let admin = new User();
  admin.fullname = 'Admin';
  admin.username = "admin";
  admin.email = "admin@vnggames.com";
  admin.role = UserRole.ADMIN;
  admin.password = await bcrypt.hash(
    "Vng2024@",
    parseInt(process.env.BCRYPT_SALT_ROUNDS || "12")
  );
  await User.save(admin);

  let contents = [
    { contentId: "f3_rule", contentGroup: "Frame 3", description: "Frame 3: Thể lệ", valueType: "text", controlType: ControlType.TextArea, translate: [{"lang": "vi", "image": "", "value": "Thể lệ của sự kiện"}] },
  ]

  let order = 0;
  await ContentConfig.save(contents.map(x => {
    let content = new ContentConfig();
    content.contentId = x.contentId;
    content.contentGroup = x.contentGroup ?? null;
    content.description = x.description;
    content.valueType = x.valueType;
    content.controlType = x.controlType;
    // content.meta = x.meta ?? null;
    content.translate = x.translate ?? [];
    content.order = order++;
    content.isPublic = true;
    return content;
  }));

};

main();
