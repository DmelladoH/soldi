export interface MonthlyReportRequest {
  month: number;
  year: number;
  cash: Array<{
    name: string;
    amount: number;
    currency: string;
  }>;
  investments: Array<{
    fundEntityId: number;
    currentValue: number;
    amountInvested: number;
    currency: string;
  }>;
  movements: Array<{
    tagId: number;
    type: "expense" | "income";
    description: string;
    amount: number;
    currency: string;
  }>;
}

export interface FundEntityRequest {
  ISIN: string;
  name: string;
  currency: string;
  type: string;
}