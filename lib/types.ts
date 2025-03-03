export type Found = "monetary" | "fixed" | "variable" | "crypto" | "EFT";
export type Currency = "Euro" | "Dollar";
export interface Entity {
  name: string;
  currentAmount: number;
  currency: string;
}

export interface FundEntity {
  ISIN: string;
  name: string;
  currency: string;
  type: string;
}

export interface FundEntityWithId extends FundEntity {
  id: number;
}
export interface Investments {
  fund: FundEntityWithId;
  currentValue: number;
  amountInvested: number;
  currency: string;
}

export interface Cash {
  name: string;
  amount: number;
  currency: string;
}
export interface MonthlyReport {
  date: string;
  payroll: number;
  expenses: number;
  payrollCurrency: string;
  cash: Cash[];
  additionalIncome: Cash[];
  investments: Investments[];
}

export interface MonthReportWithId extends MonthlyReport {
  id: number;
}
