import {
  FundEntity,
  FundEntityWithId,
  MonthlyReport,
  MonthResume,
} from "@/lib/types";
import { db } from "./db";
import {
  fundEntities,
  monthlyReportInvestments,
  monthlyReports,
  monthlyReportCash,
  monthlyReportAdditionalIncome,
} from "./db/schema";
import { eq } from "drizzle-orm";

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

export async function getReportsFromFundEntity(id: number) {
  try {
    const res = await db
      .select()
      .from(monthlyReportInvestments)
      .where(eq(monthlyReportInvestments.fundEntityId, id));

    return res;
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

export async function addFoundEntity(
  fundEntity: FundEntity
): Promise<FundEntityWithId[]> {
  try {
    const res = await db.insert(fundEntities).values(fundEntity).returning();
    return res;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error adding fund entity: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while adding fund entity.");
    }
  }
}

export async function deleteFundEntity(
  id: number
): Promise<FundEntityWithId[]> {
  try {
    return await db
      .delete(fundEntities)
      .where(eq(fundEntities.id, id))
      .returning();
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error deleting fund entity: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while deleting fund entity.");
    }
  }
}

export async function getMonthlyReportWithInvestments(): Promise<
  MonthResume[]
> {
  try {
    const res = await db.query.monthlyReports.findMany({
      with: {
        investments: {
          with: {
            fundEntity: true,
          },
        },
        cash: true,
        additionalIncome: true,
      },
      orderBy: (monthlyReports, { desc }) => [desc(monthlyReports.date)],
    });

    const processedReports = res.map((report) => ({
      id: report.id,
      date: report.date,
      payroll: report.payroll,
      expenses: report.expenses,
      payrollCurrency: report.PayrollCurrency,
      cash: report.cash,
      additionalIncome: report.additionalIncome,
      investments: report.investments.map((investment) => ({
        fund: investment.fundEntity!.name!,
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
        date: monthReport.date,
        payroll: monthReport.payroll,
        expenses: monthReport.expenses,
        PayrollCurrency: monthReport.payrollCurrency,
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

    if (monthReport.additionalIncome.length > 0) {
      const additionalIncomeToInsert = monthReport.additionalIncome.map(
        (income) => ({
          monthlyReportId: newReport.id,
          name: income.name,
          amount: income.amount,
          currency: income.currency,
        })
      );

      await db
        .insert(monthlyReportAdditionalIncome)
        .values(additionalIncomeToInsert);
    }

    if (monthReport.investments.length > 0) {
      const investmentsToInsert = monthReport.investments.map((investment) => ({
        monthlyReportId: newReport.id,
        fundEntityId: investment.fund,
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
