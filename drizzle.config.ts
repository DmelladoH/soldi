import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./server/db/schema.ts",
  dialect: "turso",
  out: "./server/db/migrations",
  dbCredentials: {
    url: process.env.TURSO_DATABASE_PROD_URL!,
    authToken: process.env.TURSO_AUTH_PROD_TOKEN!,
  },
  verbose: true,
  strict: true,
});
