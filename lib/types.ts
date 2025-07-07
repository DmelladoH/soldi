export type Found = "monetary" | "fixed" | "variable" | "crypto" | "EFT";
export type movementType = "expense" | "income";
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

export interface Movement {
  description: string;
  tagId: number;
  type: movementType;
  amount: number;
  currency: string;
}
export interface Cash {
  name: string;
  amount: number;
  currency: string;
}
export interface MonthlyReport {
  month: number;
  year: number;
  cash: Cash[];
  investments: Investments[];
  movements: Movement[];
}

export interface MonthReportWithId extends MonthlyReport {
  id: number;
}

export interface MovementTag {
  id: number;
  name: string;
  type: movementType;
}
