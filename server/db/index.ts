import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { tursoClient } from "@/utils/turso-client";
import dotenv from "dotenv";

dotenv.config();

const client = tursoClient();

// Use this object to send drizzle queries to your DB
export const db = drizzle(client, { schema });

// Export repositories for clean data access
export * from "./repositories";

// Export services for business logic
export * from "./services";
