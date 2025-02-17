import type { MiddlewareHandler } from "hono";
import { pino } from "pino";

import { isProd } from "@/env";

const HEADERS_TO_LOG = [
  "User-Agent",
  "Referer",
  "Content-Type",
  "Accept",
  "Host",
];

const logger = pino({
  level: "info",
  transport: isProd
    ? undefined
    : {
        target: "pino-pretty",
        options: { colorize: true, ignore: "pid,hostname" },
      },
});

export const loggerMiddleware: MiddlewareHandler = async (c, next) => {
  const start = Date.now();

  await next();

  const duration = Date.now() - start;

  const headers = HEADERS_TO_LOG.reduce(
    (_headers, _header) => ({ ..._headers, [_header]: c.req.header(_header) }),
    {}
  );

  logger.info(
    {
      method: c.req.method,
      url: c.req.url,
      headers,
      status: c.res.status,
      duration: `${duration}ms`,
    },
    "Request completed"
  );
};
