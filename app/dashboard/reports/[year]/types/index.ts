import { MonthReportWithId, Stock } from "@/types/database";

export interface YearReportParams {
  year: string;
}

export interface ReportInfo {
  totalCurrYear: number;
  totalInvested: number;
  totalNetSalary: number;
  totalExpendInRent: number;
  stocks: Stock[];
  totalDiff: number;
}

export interface InvestmentData {
  month: string;
  value: number;
}

export interface FinancialMetrics {
  totalInInvestments: number;
  percentageGainsThisYear: number;
  percentageGainsTotal: number;
  savingsRate: number;
  avgMonthlySavings: number;
  avgMonthlyInvested: number;
  investmentGainsDiff: number;
}

export interface ProcessedYearData {
  totalExpense: number;
  investmentGains: number;
  formattedData: InvestmentData[];
  totalInvestmentGains: number;
  totalInInvestments: number;
}

export interface YearReportData {
  currentYearData: MonthReportWithId[];
  prevYearData: MonthReportWithId[];
  currentYearExpense: number;
  prevYearExpense: number;
  currentYearReport: ReportInfo;
  prevYearReport: ReportInfo;
  currentYearInvestmentData: ProcessedYearData;
  prevYearInvestmentData: ProcessedYearData;
  financialMetrics: FinancialMetrics;
}