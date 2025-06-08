import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Cash, Investments, MonthReportWithId } from "./types";

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
  console.log(currStock.currentValue, currStock.amountInvested, prevValue);
  return currStock.currentValue - currStock.amountInvested - prevValue;
};

export const getInvestmentChart = (
  report: MonthReportWithId[]
): { month: string; amount: number }[] => {
  return report.map((report) => ({
    month: new Date(report.date).toLocaleDateString("en-GB", {
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
    month: new Date(report.date).toLocaleDateString("en-US", {
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
  reports: MonthReportWithId[],
  stock: Investments,
  indx: number
) => {
  if (!reports[indx + 1]) return 0;

  const prevStock = reports[indx + 1]?.investments?.find(
    (prevStock) => prevStock.fund === stock.fund
  );

  const prevValue = prevStock?.currentValue ?? 0;

  // Prevent division by zero
  if (prevValue === 0) return 0;

  return (stock.currentValue - prevValue) / prevValue;
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};
