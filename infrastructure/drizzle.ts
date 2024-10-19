import { resolve } from "path";
import { config } from "dotenv";
import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";

config({ path: resolve("../.env") }); // or .env.local

const client = createClient({
  url: process.env.TURSO_CONNECTION_URL!,
  authToken: process.env.TURSO_AUTH_TOKEN!,
});

export default drizzle(client);
