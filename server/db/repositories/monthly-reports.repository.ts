import { and, desc, eq, asc, or, gt, gte, lt, lte } from "drizzle-orm";
import {
  monthlyReports,
  monthlyReportInvestments,
  monthlyReportCash,
  monthlyReportMovements,
  movementTag,
  fundEntities,
} from "../schema";
import { MonthlyReport, MonthReportWithId } from "@/types/database";
import { BaseRepository } from "./base.repository";

interface MonthlyReportQueryOptions {
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  orderBy?: "asc" | "desc";
  limit?: number;
  offset?: number;
}

export class MonthlyReportsRepository extends BaseRepository {
  /**
   * Get monthly reports with all related data (investments, cash, movements)
   */
  async findWithRelations(
    options: MonthlyReportQueryOptions = {},
  ): Promise<MonthReportWithId[]> {
    return this.safeExecute(
      async () => {
        const {
          startMonth,
          startYear,
          endMonth,
          endYear,
          orderBy = "asc",
        } = options;

        const startDate =
          startMonth !== undefined && startYear !== undefined
            ? { month: startMonth, year: startYear }
            : undefined;

        const endDate =
          endMonth !== undefined && endYear !== undefined
            ? { month: endMonth, year: endYear }
            : undefined;

        console.log({ startDate, endDate });
        
        // Build base query with proper typing
        let baseQuery = this.db.select().from(monthlyReports);
        
        // Apply date range using base repository method
        const query = this.applyDateRange(
          baseQuery,
          { month: monthlyReports.month, year: monthlyReports.year },
          startDate,
          endDate,
        );
        
        // Apply ordering
        const orderDirection = orderBy === "desc" ? desc : asc;
        const finalQuery = query.orderBy(
          orderDirection(monthlyReports.year),
          orderDirection(monthlyReports.month),
        );

        // Get the main reports
        const reports = await finalQuery;
        console.log("Fetched reports:", reports);
        // For each report, fetch related data
        const reportsWithRelations: MonthReportWithId[] = [];

        for (const report of reports) {
          // Get investments for this report with fund details
          const investments = await this.db
            .select({
              id: monthlyReportInvestments.id,
              fundEntityId: monthlyReportInvestments.fundEntityId,
              currentValue: monthlyReportInvestments.currentValue,
              amountInvested: monthlyReportInvestments.amountInvested,
              currency: monthlyReportInvestments.currency,
              fund: {
                id: fundEntities.id,
                ISIN: fundEntities.ISIN,
                name: fundEntities.name,
                currency: fundEntities.currency,
                type: fundEntities.type,
              },
            })
            .from(monthlyReportInvestments)
            .leftJoin(
              fundEntities,
              eq(monthlyReportInvestments.fundEntityId, fundEntities.id),
            )
            .where(eq(monthlyReportInvestments.monthlyReportId, report.id));

          // Get cash for this report
          const cash = await this.db
            .select()
            .from(monthlyReportCash)
            .where(eq(monthlyReportCash.monthlyReportId, report.id));

          // Get movements with tags for this report
          const movements = await this.db
            .select({
              id: monthlyReportMovements.id,
              tagId: monthlyReportMovements.tagId,
              type: monthlyReportMovements.type,
              description: monthlyReportMovements.description,
              amount: monthlyReportMovements.amount,
              currency: monthlyReportMovements.currency,
              tagName: movementTag.name,
              tagType: movementTag.type,
            })
            .from(monthlyReportMovements)
            .leftJoin(
              movementTag,
              eq(monthlyReportMovements.tagId, movementTag.id),
            )
            .where(eq(monthlyReportMovements.monthlyReportId, report.id));

          // Transform the data to match expected types
          const transformedInvestments = this.transform(investments, (inv) => ({
            fund: {
              id: inv.fundEntityId,
              ISIN: inv.fund?.ISIN || "",
              name: inv.fund?.name || "",
              currency: inv.fund?.currency || inv.currency,
              type: inv.fund?.type || "",
            },
            currentValue: inv.currentValue,
            amountInvested: inv.amountInvested,
            currency: inv.currency,
          }));

          const transformedCash = this.transform(cash, (c) => ({
            name: c.name,
            amount: c.amount,
            currency: c.currency,
          }));

          const transformedMovements = this.transform(movements, (m) => ({
            description: m.description || "",
            tagId: m.tagId,
            type: m.type as "expense" | "income",
            amount: m.amount,
            currency: m.currency,
          }));

          reportsWithRelations.push({
            id: report.id,
            month: report.month,
            year: report.year,
            cash: transformedCash,
            investments: transformedInvestments,
            movements: transformedMovements,
          });
        }

        return reportsWithRelations;
      },
      "fetching monthly reports with relations",
      "MonthlyReport",
    );
  }

  /**
   * Create a new monthly report with all related data
   */
  async create(monthlyReport: MonthlyReport): Promise<MonthReportWithId> {
    return this.safeExecute(
      async () => {
        // Insert the main report
        const [report] = await this.db
          .insert(monthlyReports)
          .values({
            month: monthlyReport.month,
            year: monthlyReport.year,
          })
          .returning();

        // Insert cash records
        if (monthlyReport.cash.length > 0) {
          const cashRecords = monthlyReport.cash.map((cash) => ({
            monthlyReportId: report.id,
            name: cash.name,
            amount: cash.amount,
            currency: cash.currency,
          }));
          await this.db.insert(monthlyReportCash).values(cashRecords);
        }

        // Insert investment records
        if (monthlyReport.investments.length > 0) {
          const investmentRecords = monthlyReport.investments.map(
            (investment) => ({
              monthlyReportId: report.id,
              fundEntityId: investment.fund.id,
              currentValue: investment.currentValue,
              amountInvested: investment.amountInvested,
              currency: investment.currency,
            }),
          );
          await this.db
            .insert(monthlyReportInvestments)
            .values(investmentRecords);
        }

        // Insert movement records
        if (monthlyReport.movements.length > 0) {
          const movementRecords = monthlyReport.movements.map((movement) => ({
            monthlyReportId: report.id,
            tagId: movement.tagId,
            type: movement.type,
            description: movement.description,
            amount: movement.amount,
            currency: movement.currency,
          }));
          await this.db.insert(monthlyReportMovements).values(movementRecords);
        }

        // Return the complete report
        return {
          id: report.id,
          ...monthlyReport,
        };
      },
      "creating monthly report",
      "MonthlyReport",
    );
  }

  /**
   * Get a single monthly report by ID with relations
   */
  async findById(id: number): Promise<MonthReportWithId | null> {
    return this.safeExecute(
      async () => {
        const reports = await this.findWithRelations();
        return reports.find((report) => report.id === id) || null;
      },
      "finding monthly report by ID",
      "MonthlyReport",
    );
  }

  /**
   * Get reports for a specific year
   */
  async findByYear(year: number): Promise<MonthReportWithId[]> {
    return this.findWithRelations({
      startYear: year,
      startMonth: 1,
      endYear: year,
      endMonth: 12,
      orderBy: "asc",
    });
  }

  /**
   * Delete a monthly report and all its related data
   */
  async delete(id: number): Promise<void> {
    return this.safeExecute(
      async () => {
        // Delete related data first (foreign key constraints)
        await this.db
          .delete(monthlyReportInvestments)
          .where(eq(monthlyReportInvestments.monthlyReportId, id));
        await this.db
          .delete(monthlyReportCash)
          .where(eq(monthlyReportCash.monthlyReportId, id));
        await this.db
          .delete(monthlyReportMovements)
          .where(eq(monthlyReportMovements.monthlyReportId, id));

        // Delete the main report
        await this.db.delete(monthlyReports).where(eq(monthlyReports.id, id));
      },
      "deleting monthly report",
      "MonthlyReport",
    );
  }

  /**
   * Update a monthly report
   */
  async update(
    id: number,
    data: Partial<MonthlyReport>,
  ): Promise<MonthReportWithId> {
    return this.safeExecute(
      async () => {
        // For simplicity, we'll delete and recreate related data
        // In a production app, you might want to do differential updates
        await this.delete(id);

        if (data.month && data.year) {
          const updatedReport = {
            month: data.month,
            year: data.year,
            cash: data.cash || [],
            investments: data.investments || [],
            movements: data.movements || [],
          };

          return await this.create(updatedReport);
        }

        throw new Error("Month and year are required for update");
      },
      "updating monthly report",
      "MonthlyReport",
    );
  }
}
