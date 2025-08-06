import { MonthlyReport, MonthReportWithId } from "@/lib/types";
import { db } from "..";
import {
  monthlyReportInvestments,
  monthlyReports,
  monthlyReportCash,
  monthlyReportMovements,
} from "../schema";

interface Props {
  startMonth?: number;
  startYear?: number;
  endMonth?: number;
  endYear?: number;
  orderBy?: "asc" | "desc";
}

export async function getMonthlyReportWithInvestments({
  startMonth,
  startYear,
  endMonth,
  endYear,
  orderBy = "asc",
}: Props): Promise<MonthReportWithId[]> {
  try {
    const hasStart = startMonth !== undefined && startYear !== undefined;
    const hasEnd = endMonth !== undefined && endYear !== undefined;

    const whereClause =
      hasStart || hasEnd
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (monthlyReports: any, { and, or, eq, gte, lte }: any) => {
            const conditions = [];

            if (hasStart && hasEnd) {
              // Case 1: full range
              conditions.push(
                or(
                  and(
                    eq(monthlyReports.year, startYear!),
                    gte(monthlyReports.month, startMonth!)
                  ),
                  gte(monthlyReports.year, startYear! + 1)
                )
              );

              conditions.push(
                or(
                  and(
                    eq(monthlyReports.year, endYear!),
                    lte(monthlyReports.month, endMonth!)
                  ),
                  lte(monthlyReports.year, endYear! - 1)
                )
              );
            } else if (hasStart) {
              // Case 2: only start provided
              conditions.push(
                or(
                  and(
                    eq(monthlyReports.year, startYear!),
                    gte(monthlyReports.month, startMonth!)
                  ),
                  gte(monthlyReports.year, startYear! + 1)
                )
              );
            } else if (hasEnd) {
              // Case 3: only end provided
              conditions.push(
                or(
                  and(
                    eq(monthlyReports.year, endYear!),
                    lte(monthlyReports.month, endMonth!)
                  ),
                  lte(monthlyReports.year, endYear! - 1)
                )
              );
            }

            return and(...conditions);
          }
        : undefined;

    const res = await db.query.monthlyReports.findMany({
      where: whereClause,
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

    const processedReports: MonthReportWithId[] = res.map((report) => ({
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
    await db.transaction(async (tx) => {
      const [newReport] = await tx
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

        await tx.insert(monthlyReportCash).values(cashToInsert);
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
        await tx.insert(monthlyReportMovements).values(movementsToInsert);
      }

      if (monthReport.investments.length > 0) {
        const investmentsToInsert = monthReport.investments.map(
          (investment) => ({
            monthlyReportId: newReport.id,
            fundEntityId: investment.fund.id,
            currentValue: investment.currentValue,
            amountInvested: investment.amountInvested,
            currency: investment.currency,
          })
        );

        await tx.insert(monthlyReportInvestments).values(investmentsToInsert);
      }
    });
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error adding monthly report: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while adding monthly report.");
    }
  }
}
