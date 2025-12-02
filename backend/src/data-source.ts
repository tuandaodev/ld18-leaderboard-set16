import "dotenv/config";

import { DataSource } from "typeorm";
import { AdminLog } from "./entity/AdminLog";
import { Campaign } from "./entity/Campaign";
import { ContentConfig } from "./entity/ContentConfig";
import { Event } from "./entity/Event";
import { User } from "./entity/User";
import { InitDb1763663405219 } from "./migrations/1763663405219-init_db";
import { InitData1763663509101 } from "./migrations/1763663509101-init_data";
import { AddF1Description1763663600000 } from "./migrations/1763663600000-add_f1_description";
import { AddTermsAgreedAt1764304202761 } from "./migrations/1764304202761-AddTermsAgreedAt";

// Add new entities here
export const AppEntites = [
  AdminLog, User, ContentConfig, Campaign, Event
]

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || "5432"),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database:
    process.env.NODE_ENV === "test"
      ? process.env.DB_TEST_NAME
      : process.env.DB_NAME,
  logging: false,
  entities: AppEntites,
  subscribers: [],
  migrations: [
    InitDb1763663405219,
    InitData1763663509101,
    AddF1Description1763663600000,
    AddTermsAgreedAt1764304202761
  ],
  cache: false,
  synchronize: true,
  // dropSchema: process.env.NODE_ENV === "development" ? true : false,
});
