export type Found = "monetary" | "fixed" | "variable";

export interface Entity {
  name: string;
  currentAmount: number;
  currency: string;
}

export interface FundEntity {
  ISIN: string;
  name: string;
  currency: string;
  type: string; //Found;
}

export interface FundEntityWithId extends FundEntity {
  id: number;
}
export interface Investments {
  fund: number;
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

export interface MonthResume {
  id: number;
  date: string;
  payroll: number;
  expenses: number;
  cash: Array<{
    name: string;
    amount: number;
  }>;
  additionalIncome: Array<{
    name: string;
    amount: number;
  }>;
  investments: Array<{
    fund: string;
    currentValue: number;
    amountInvested: number;
    currency: string;
  }>;
}
