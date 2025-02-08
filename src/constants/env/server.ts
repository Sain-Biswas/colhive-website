import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

const envServer = createEnv({
  server: {
    TURSO_DATABASE_URL: z.string().url(),
    TURSO_AUTH_TOKEN: z.string(),
    NODE_ENV: z
      .enum(["development", "test", "production"])
      .default("development"),
    AUTH_SECRET: z.string(),
    AUTH_FROM_MAIL: z.string().email(),
    GMAIL_PASS_KEY: z.string(),
  },

  runtimeEnv: {
    TURSO_DATABASE_URL: process.env.TURSO_DATABASE_URL,
    NODE_ENV: process.env.NODE_ENV,
    TURSO_AUTH_TOKEN: process.env.TURSO_AUTH_TOKEN,
    AUTH_SECRET: process.env.AUTH_SECRET,
    AUTH_FROM_MAIL: process.env.AUTH_FROM_MAIL,
    GMAIL_PASS_KEY: process.env.GMAIL_PASS_KEY,
  },

  emptyStringAsUndefined: true,
});

export default envServer;

