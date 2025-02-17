import { Hono } from "hono";
import { prettyJSON } from "hono/pretty-json";
import { cors } from "hono/cors";

import { loggerMiddleware } from "./logger.js";
import { CROSS_DOMAIN } from "./config.js";

const app = new Hono();

app.use("*", loggerMiddleware);
app.use(prettyJSON());

// Welcome
app.get("/", (c) => {
  return c.text("Welcome to bitmappunks");
});

// Health check endpoint
app.get("/health", (c) => {
  return c.json({ status: "ok", timestamp: new Date().toISOString() });
});

const v2 = new Hono();

v2.use(
  "*",
  cors({
    origin: (origin) => {
      const allow = CROSS_DOMAIN.allowedOrigins
        .map((_host) => new RegExp(_host, "i"))
        .some((_hostRegex) => _hostRegex.test(origin));

      return allow ? origin : "";
    },
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    maxAge: 86400,
    credentials: true,
  })
);

v2.get("/test", (c) => c.text("test"));

app.route("/v2", v2);

export { app };
