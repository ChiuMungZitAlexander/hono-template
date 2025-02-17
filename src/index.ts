import { serve } from "@hono/node-server";

import { app } from "./app";
import { PORT } from "./config";
import { validateEnv } from "./env";

const init = async () => {
  try {
    validateEnv(process.env);

    serve({
      fetch: app.fetch,
      port: PORT,
    });

    console.log(
      `🚀 Server is running on port ${PORT} in ${process.env.NODE_ENV} mode`
    );
  } catch (error: any) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

init();
