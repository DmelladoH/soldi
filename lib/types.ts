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
  fundEntityId: number;
  currentValue: number;
  amountInvested: number;
}

export type MonthlyReport = {
  date: string;
  payroll: number;
  cash: Array<{
    name: string;
    amount: number;
  }>;
  additionalIncome: Array<{
    name: string;
    amount: number;
  }>;
  investments: Array<{
    fund: number;
    currentValue: number;
    amountInvested: number;
  }>;
};
