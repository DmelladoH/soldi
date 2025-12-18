import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Cash,
  Investments,
  MonthlyReport,
  MonthReportWithId,
  Movement,
  movementType,
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTotalCash(cash: Cash[]) {
  return cash.reduce((acc, curr) => acc + curr.amount, 0);
}

export function getTotalInvestments(inv: Investments[]) {
  return inv.reduce((acc, curr) => acc + curr.currentValue, 0);
}

export function getTotalMoney(resume: MonthReportWithId) {
  if (resume == null) return 0;
  return getTotalCash(resume.cash) + getTotalInvestments(resume.investments);
}

export const geStockDifference = (
  currStock: Investments | undefined,
  prevStock: Investments | undefined
) => {
  if (!currStock || !prevStock) return 0;
  const prevValue = prevStock.currentValue;
  return currStock.currentValue - currStock.amountInvested - prevValue;
};

export const getInvestmentChart = (
  report: MonthReportWithId[]
): { month: string; amount: number }[] => {
  return report.map((report) => ({
    month: new Date(report.year, report.month, 1).toLocaleDateString("en-GB", {
      month: "long",
      timeZone: "UTC",
    }),
    amount: getTotalInvestments(report.investments),
  }));
};

export const getTotalChart = (
  report: MonthReportWithId[]
): { month: string; amount: number }[] => {
  return report.map((report) => ({
    month: new Date(report.year, report.month, 1).toLocaleDateString("en-GB", {
      month: "long",
      timeZone: "UTC",
    }),
    amount: getTotalMoney(report),
  }));
};

export const getBankAccounts = (lastMonth: MonthReportWithId): Cash[] => {
  return lastMonth.cash.map((account) => ({
    name: account.name,
    amount: account.amount,
    currency: account.currency,
  }));
};

export const getStockProfit = (
  currStock: Investments | undefined,
  prevStock: Investments | undefined
) => {
  if (!currStock || !prevStock) return 0;

  const prevValue = prevStock?.currentValue ?? 0;

  // Prevent division by zero
  if (prevValue === 0) return 0;

  return (currStock.currentValue - prevValue) / prevValue;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Gets the total of a movement type for a given movement array
export const getTotalMovementByType = (
  reportList: Movement[],
  type: movementType
) => {
  return reportList?.length
    ? reportList
        .filter((movement) => movement.type === type)
        .reduce((acc, curr) => acc + curr.amount, 0)
    : 0;
};

export const formatStock = (
  currentInvestments: Investments[],
  prevInvestments: Investments[]
) => {
  return currentInvestments.length
    ? currentInvestments.map((stock) => ({
        fund: stock.fund,
        currentValue: stock.currentValue,
        amountInvested: stock.amountInvested,
        difference: geStockDifference(
          stock,
          prevInvestments.find((f) => f.fund.id === stock.fund.id)
        ),
        profit: getStockProfit(
          stock,
          prevInvestments.find((f) => f.fund.id === stock.fund.id)
        ),
        currency: stock.currency,
      }))
    : [];
};

export const formatStockFromReport = (reports: MonthlyReport[]) => {
  if (!reports.length) return [];

  // Ensure chronological order
  const sortedReports = [...reports].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );

  const fundMap = new Map<
    number,
    {
      fund: Investments["fund"];
      currency: string;
      totalInvested: number;
      value: number;
    }
  >();

  for (const report of sortedReports) {
    for (const inv of report.investments) {
      const existing = fundMap.get(inv.fund.id);

      if (!existing) {
        fundMap.set(inv.fund.id, {
          fund: inv.fund,
          currency: inv.currency,
          totalInvested: inv.amountInvested,
          value: inv.currentValue,
        });
      } else {
        existing.totalInvested += inv.amountInvested;
        existing.value = inv.currentValue;
      }
    }
  }

  return Array.from(fundMap.values()).map((f) => {
    const profit =
      f.totalInvested === 0
        ? 0
        : ((f.value - f.totalInvested) / f.totalInvested) * 100;

    return {
      fund: f.fund,
      currentValue: f.value,
      amountInvested: f.totalInvested,
      difference: f.value - f.totalInvested,
      profit, // 0 = sin beneficio, 100 = duplicas, 200 = triplicas
      currency: f.currency,
    };
  });
};
