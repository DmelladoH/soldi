import { sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const entities = sqliteTable("entity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }).notNull(),
  ISIN: text("isin", { length: 12 }).notNull(),
  currentAmount: integer("current_amount").notNull(),
  currency: text("currency", { length: 3 }).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const FundEntities = sqliteTable("fund_entity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  ISIN: text("isin", { length: 12 }).notNull(),
  name: text("name", { length: 256 }).notNull(),
  type: text("type", { length: 256 }).notNull(),
  currency: text("currency", { length: 3 }).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});
