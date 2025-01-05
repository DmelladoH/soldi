export type Found = "monetario" | "fija" | "variable";

export interface Entity {
  name: string;
  currentAmount: number;
  currency: string;
}

export interface FoundEntity {
  ISIN: string;
  name: string;
  currentAmount: number;
  currency: string;
  type: Found;
}

export interface Investments {
  ISIN: string;
  currentValue: number;
  amountInvested: number;
  currency: string;
}

export interface MonthlyForm {
  income: number;
  additionalIncome: { description: string; amount: number }[];
  investments: Investments[];
}
