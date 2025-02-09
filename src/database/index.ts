import { type Client, createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";

import envServer from "@/constants/env/server";

import * as schema from "./schema/index";

/**
 * Cache the database connection in development. This avoids creating a new connection on every HMR
 * update.
 */
const globalForDb = globalThis as unknown as {
  client: Client | undefined;
};

export const client =
  globalForDb.client ??
  createClient({
    url: envServer.TURSO_DATABASE_URL,
    authToken: envServer.TURSO_AUTH_TOKEN,
  });

if (envServer.NODE_ENV !== "production") globalForDb.client = client;

export const db = drizzle(client, { schema });
