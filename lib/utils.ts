import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { Cash, Investments, MonthlyReport } from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTotalCash(cash: Cash[]) {
  return cash.reduce((acc, curr) => acc + curr.amount, 0);
}

export function getTotalInvestments(inv: Investments[]) {
  return inv.reduce((acc, curr) => acc + curr.currentValue, 0);
}

export function getTotalMoney(resume: MonthlyReport) {
  if (resume === null) return 0;
  return getTotalCash(resume.cash) + getTotalInvestments(resume.investments);
}

export const geStockDifference = (
  reports: MonthlyReport[],
  stock: Investments,
  indx: number
) => {
  if (!reports[indx + 1]) return 0;
  const prevValue =
    reports[indx + 1]?.investments?.find(
      (prevStock) => prevStock.fund === stock.fund
    )?.currentValue || 0;

  return stock.currentValue - stock.amountInvested - prevValue;
};

export const getStockProfit = (
  reports: MonthlyReport[],
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
