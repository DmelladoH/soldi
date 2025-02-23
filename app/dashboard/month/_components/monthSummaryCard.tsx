import AccountsCart from "@/components/accountsCart";
import { FundTable } from "@/components/fundsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Cash } from "@/lib/types";

export interface Stocks {
  fund: string;
  currentValue: number;
  amountInvested: number;
  difference: number | undefined;
  profit: number | null;
  currency: string;
}

type FinanceSummaryProps = {
  month: string;
  totalAmount: number;
  regularIncome: number;
  additionalIncomes: { name: string; amount: number }[];
  bankAccounts: Cash[];
  expenses: number;
  stocks: Stocks[];
};

export default function MonthSummaryCard({
  month,
  totalAmount,
  regularIncome,
  additionalIncomes,
  bankAccounts,
  expenses,
  stocks,
}: FinanceSummaryProps) {
  const totalIncome =
    regularIncome +
    additionalIncomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader className="flex flex-row justify-between">
        <CardTitle className="text-2xl font-bold text-center">
          {month}
        </CardTitle>
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">
            ${totalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Amount</p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                Regular: ${regularIncome.toLocaleString()}
              </p>
              {additionalIncomes.map((income, index) => (
                <p key={index}>
                  {income.name}: ${income.amount.toLocaleString()}
                </p>
              ))}
              <p className="mt-2 font-bold">
                Total: ${totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>
          <AccountsCart bankAccounts={bankAccounts} />
        </div>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investments</CardTitle>
          </CardHeader>
          <CardContent>{stocks && <FundTable stocks={stocks} />}</CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
