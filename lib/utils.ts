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
