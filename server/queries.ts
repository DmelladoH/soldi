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
      cash: report.cash,
      additionalIncome: report.additionalIncome,
      investments: report.investments.map((investment) => ({
        fund: investment.fundEntity!.name!,
        currentValue: investment.currentValue,
        amountInvested: investment.amountInvested,
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
        PayrollCurrency: monthReport.payrollCurrency,
      })
      .returning({ id: monthlyReports.id });

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
      const additionalIncomeToInsert = monthReport.cash.map((cash) => ({
        monthlyReportId: newReport.id,
        name: cash.name,
        amount: cash.amount,
        currency: cash.currency,
      }));

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
