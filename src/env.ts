import { z } from "zod";

const envSchema = z.object({
  PORT: z.coerce.number().default(3021),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
});

export const validateEnv = (env: NodeJS.ProcessEnv) => {
  const result = envSchema.safeParse(env);
  if (!result.success) {
    console.error("❌ Invalid environment variables:", result.error.format());
    process.exit(1);
  }
  return result.data;
};

export const isDev = process.env.NODE_ENV === "development";
export const isProd = process.env.NODE_ENV === "production";
