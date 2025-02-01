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

export interface Investments {
  fund: FundEntity;
  currentValue: number;
  amountInvested: number;
}

export interface MonthlyReport {
  income: number;
  additionalIncome: { description: string; amount: number }[];
  investments: Investments[];
  cash: Entity[];
}
