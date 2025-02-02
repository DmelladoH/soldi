import { FundEntity, FundEntityWithId, MonthlyReport } from "@/lib/types";
import { db } from "./db";
import {
  fundEntities,
  monthlyReportInvestments,
  monthlyReports,
} from "./db/schema";

export async function getFoundEntities() {
  try {
    const res = await db.query.fundEntities.findMany();
    const processedRes: FundEntityWithId[] = res.map((entity) => ({
      id: entity.id,
      ISIN: entity.ISIN,
      name: entity.name,
      currency: entity.currency,
      type: entity.type,
    }));
    return processedRes;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error getting fund entity: ${e.message}`);
    } else {
      throw new Error(
        "An unknown error occurred while getting all fundEntities."
      );
    }
  }
}

export async function addFoundEntity(fundEntity: FundEntity) {
  try {
    await db.insert(fundEntities).values(fundEntity);
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error adding fund entity: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while adding fund entity.");
    }
  }
}

export async function addMonthlyReport(monthReport: MonthlyReport) {
  try {
    const [newReport] = await db
      .insert(monthlyReports)
      .values({
        date: monthReport.date,
        payroll: monthReport.payroll,
        cash: monthReport.cash,
        additionalIncome: monthReport.additionalIncome,
      })
      .returning({ id: monthlyReports.id });

    if (monthReport.investments.length > 0) {
      const investmentsToInsert = monthReport.investments.map((investment) => ({
        monthlyReportId: newReport.id,
        fundEntityId: investment.fund,
        currentValue: investment.currentValue,
        amountInvested: investment.amountInvested,
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
