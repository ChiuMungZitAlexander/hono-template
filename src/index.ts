import { serve } from "@hono/node-server";
import * as dotenv from "dotenv";

import { app } from "./app";
import { validateEnv } from "./env";
import { initMongodb } from "./mongodb";

dotenv.config({
  path: [".env.development.local", ".env.development"],
});

const init = async () => {
  try {
    validateEnv(process.env);

    const state = await initMongodb(process.env.MONGO_URI!);

    if (state === 1) {
      serve({
        fetch: app.fetch,
        port: Number(process.env.PORT) || 3021,
      });

      console.log(
        `🚀 Server is running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`
      );
    } else {
      throw new Error("Database connection error!");
    }
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

init();
