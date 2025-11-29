import "dotenv/config";

import "reflect-metadata";
import { AppDataSource } from "./src/data-source";
import app from "./src/server";
const defaultTimezone = "Asia/Ho_Chi_Minh"; // GMT+7
process.env.TZ = defaultTimezone;

let main = async () => {
  // Db init
  try {
    await AppDataSource.initialize();
    // await AppDataSource.runMigrations();
  } catch (err) {
    console.log(err);
    console.log("failed to init db");
    process.exit();
  }

  const port = parseInt(process.env.PORT || "8088");

  // Run server
  app.listen(+port, async () => {
    console.log(`Server running at port: ${port}`);
    // await initJobs();
  });
};

main();
