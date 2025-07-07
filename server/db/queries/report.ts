import { MonthlyReport, MonthReportWithId } from "@/lib/types";
import { db } from "..";
import {
  monthlyReportInvestments,
  monthlyReports,
  monthlyReportCash,
  monthlyReportMovements,
} from "../schema";

export async function getMonthlyReportWithInvestments(
  startMonth?: number,
  startYear?: number,
  endMonth?: number,
  endYear?: number,
  orderBy: "asc" | "desc" = "asc"
): Promise<MonthReportWithId[]> {
  try {
    let res = null;

    if (startMonth && startYear && endMonth && endYear) {
      res = await db.query.monthlyReports.findMany({
        where: (monthlyReports, { and, gte, lte }) =>
          and(
            gte(monthlyReports.month, startMonth),
            gte(monthlyReports.year, startYear),
            endMonth ? lte(monthlyReports.month, endMonth) : undefined,
            endYear ? lte(monthlyReports.year, endYear) : undefined
          ),
        with: {
          investments: {
            with: {
              fundEntity: true,
            },
          },
          cash: true,
          movements: true,
        },
        orderBy: (monthlyReports, { asc, desc }) =>
          orderBy === "asc"
            ? [asc(monthlyReports.year), asc(monthlyReports.month)]
            : [desc(monthlyReports.year), desc(monthlyReports.month)],
      });
    } else {
      res = await db.query.monthlyReports.findMany({
        with: {
          investments: {
            with: {
              fundEntity: true,
            },
          },
          cash: true,
          movements: true,
        },
        orderBy: (monthlyReports, { asc, desc }) =>
          orderBy === "asc"
            ? [asc(monthlyReports.year), asc(monthlyReports.month)]
            : [desc(monthlyReports.year), desc(monthlyReports.month)],
      });
    }

    const processedReports = res.map((report) => ({
      id: report.id,
      month: report.month,
      year: report.year,
      cash: report.cash.map((cash) => ({
        name: cash.name,
        amount: cash.amount,
        currency: cash.currency,
      })),
      movements: report.movements.map((movement) => ({
        tagId: movement.tagId,
        description: movement.description || "",
        type: movement.type,
        amount: movement.amount,
        currency: movement.currency,
      })),
      investments: report.investments.map((investment) => ({
        fund: {
          id: investment.fundEntity.id,
          ISIN: investment.fundEntity.ISIN,
          name: investment.fundEntity.name,
          currency: investment.fundEntity.currency,
          type: investment.fundEntity.type,
        },
        currentValue: investment.currentValue,
        amountInvested: investment.amountInvested,
        currency: investment.currency,
      })),
    }));
    return processedReports;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error getting monthly report: ${e.message}`);
    } else {
      throw new Error(
        "An unknown error occurred while getting all monthly reports."
      );
    }
  }
}

export async function addMonthlyReport(monthReport: MonthlyReport) {
  try {
    const [newReport] = await db
      .insert(monthlyReports)
      .values({
        month: monthReport.month,
        year: monthReport.year,
      })
      .returning();

    if (monthReport.cash.length > 0) {
      const cashToInsert = monthReport.cash.map((cash) => ({
        monthlyReportId: newReport.id,
        name: cash.name,
        amount: cash.amount,
        currency: cash.currency,
      }));

      await db.insert(monthlyReportCash).values(cashToInsert);
    }
    if (monthReport.movements.length > 0) {
      const movementsToInsert = monthReport.movements.map((movement) => ({
        monthlyReportId: newReport.id,
        tagId: movement.tagId,
        description: movement.description,
        type: movement.type,
        amount: movement.amount,
        currency: movement.currency,
      }));
      await db.insert(monthlyReportMovements).values(movementsToInsert);
    }

    if (monthReport.investments.length > 0) {
      const investmentsToInsert = monthReport.investments.map((investment) => ({
        monthlyReportId: newReport.id,
        fundEntityId: investment.fund.id,
        currentValue: investment.currentValue,
        amountInvested: investment.amountInvested,
        currency: investment.currency,
      }));

      await db.insert(monthlyReportInvestments).values(investmentsToInsert);
    }
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error adding monthly report: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while adding monthly report.");
    }
  }
}
