import "dotenv/config";

import { DataSource } from "typeorm";
import { AdminLog } from "./entity/AdminLog";
import { Campaign } from "./entity/Campaign";
import { CachedMatch } from "./entity/CachedMatch";
import { CachedRiotAccount } from "./entity/CachedRiotAccount";
import { ContentConfig } from "./entity/ContentConfig";
import { Event } from "./entity/Event";
import { User } from "./entity/User";
import { InitDatabase1764693369392 } from "./migrations/1764693369392-init-database";
import { InitData1764693419027 } from "./migrations/1764693419027-init-data";
import { InitContentConfig1764694038203 } from "./migrations/1764694038203-init-content-config";
import { AddCacheEntities1765556367767 } from "./migrations/1765556367767-add-cache-entities";
import { AddCsvOrderToCachedRiotAccount1765629718906 } from "./migrations/1765629718906-add-csv-order-to-cached-riot-account";

// Add new entities here
export const AppEntites = [
  AdminLog, User, ContentConfig, Campaign, Event, CachedRiotAccount, CachedMatch
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
    InitDatabase1764693369392,
    InitData1764693419027,
    InitContentConfig1764694038203,
    AddCacheEntities1765556367767,
    AddCsvOrderToCachedRiotAccount1765629718906
  ],
  cache: false,
  synchronize: true,
  // dropSchema: process.env.NODE_ENV === "development" ? true : false,
});
