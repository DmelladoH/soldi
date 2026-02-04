import { type Client, createClient } from "@libsql/client/http";
import "dotenv/config";

export function tursoClient(): Client {
  const url = process.env.TURSO_DATABASE_PRE_URL?.trim();
  if (url === undefined) {
    throw new Error("TURSO_URL is not defined");
  }

  const authToken = process.env.TURSO_AUTH_PRE_TOKEN?.trim();
  if (authToken === undefined) {
    if (!url.includes("file:")) {
      throw new Error("TURSO_AUTH_TOKEN is not defined");
    }
  }

  return createClient({
    url: process.env.TURSO_DATABASE_PRE_URL!,
    authToken: process.env.TURSO_AUTH_PRE_TOKEN!,
  });
}
