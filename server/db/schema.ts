import { relations, sql } from "drizzle-orm";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";

export const fundEntities = sqliteTable("fund_entity", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  ISIN: text("isin", { length: 12 }).notNull().unique(),
  name: text("name", { length: 256 }).notNull().unique(),
  type: text("type", { length: 256 }).notNull(),
  currency: text("currency", { length: 3 }).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const monthlyReports = sqliteTable("monthly_report", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  month: integer("month").notNull(),
  year: integer("year").notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const monthlyReportInvestments = sqliteTable(
  "monthly_report_investment",
  {
    id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
    monthlyReportId: integer("monthly_report_id")
      .references(() => monthlyReports.id)
      .notNull(),
    fundEntityId: integer("fund_entity_id")
      .references(() => fundEntities.id)
      .notNull(),
    currentValue: integer("current_value").notNull(),
    amountInvested: integer("amount_invested").notNull(),
    currency: text("currency", { length: 3 }).notNull(),
    createdAt: text("created_at")
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }
);

export const monthlyReportCash = sqliteTable("monthly_report_cash", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  monthlyReportId: integer("monthly_report_id")
    .references(() => monthlyReports.id)
    .notNull(),
  name: text("name", { length: 256 }).notNull(),
  amount: integer("amount").notNull(),
  currency: text("currency", { length: 3 }).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const monthlyReportMovements = sqliteTable("monthly_report_movements", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  monthlyReportId: integer("monthly_report_id")
    .references(() => monthlyReports.id)
    .notNull(),
  tagId: integer("tag_id")
    .references(() => movementTag.id)
    .notNull(),
  type: text("type", { enum: ["expense", "income"] }).notNull(),
  description: text("name", { length: 256 }),
  amount: integer("amount").notNull(),
  currency: text("currency", { length: 3 }).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const movementTag = sqliteTable("movement_tag", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  name: text("name", { length: 256 }).notNull().unique(),
  type: text("type", { enum: ["expense", "income"] }).notNull(),
  createdAt: text("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
});

export const movementTagRelations = relations(movementTag, ({ many }) => ({
  movements: many(monthlyReportMovements),
}));

export const monthlyReportRelations = relations(monthlyReports, ({ many }) => ({
  investments: many(monthlyReportInvestments),
  cash: many(monthlyReportCash),
  movements: many(monthlyReportMovements),
}));

export const monthlyReportCashRelations = relations(
  monthlyReportCash,
  ({ one }) => ({
    monthlyReport: one(monthlyReports, {
      fields: [monthlyReportCash.monthlyReportId],
      references: [monthlyReports.id],
    }),
  })
);

export const monthlyReportMovementsRelations = relations(
  monthlyReportMovements,
  ({ one }) => ({
    monthlyReport: one(monthlyReports, {
      fields: [monthlyReportMovements.monthlyReportId],
      references: [monthlyReports.id],
    }),
  })
);

export const monthlyReportInvestmentsRelations = relations(
  monthlyReportInvestments,
  ({ one }) => ({
    monthlyReport: one(monthlyReports, {
      fields: [monthlyReportInvestments.monthlyReportId],
      references: [monthlyReports.id],
    }),
    fundEntity: one(fundEntities, {
      fields: [monthlyReportInvestments.fundEntityId],
      references: [fundEntities.id],
    }),
  })
);
