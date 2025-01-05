import * as schema from "./schema";
import { drizzle } from "drizzle-orm/libsql";
import { tursoClient } from "@/utils/turso-client";
import dotenv from "dotenv";

dotenv.config();

const client = tursoClient();

// Use this object to send drizzle queries to your DB
export const db = drizzle(client, { schema });
