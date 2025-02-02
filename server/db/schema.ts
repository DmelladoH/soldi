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
  date: text("date").notNull(),
  payroll: integer("payroll").notNull(),
  cash: text("cash", { mode: "json" }).notNull().$type<
    Array<{
      name: string;
      amount: number;
    }>
  >(),
  additionalIncome: text("additional_income", { mode: "json" }).notNull().$type<
    Array<{
      name: string;
      amount: number;
    }>
  >(),
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
    fundEntityId: integer("fund_entity_id").references(() => fundEntities.id),
    currentValue: integer("current_value").notNull(),
    amountInvested: integer("amount_invested").notNull(),
  }
);

export const monthlyReportRelations = relations(monthlyReports, ({ many }) => ({
  investments: many(monthlyReportInvestments),
}));

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
