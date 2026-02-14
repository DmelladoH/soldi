import AccountsCart from "@/components/accountsCart";
import { FundTable } from "@/components/fundsTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Cash, FundEntityWithId } from "@/types/database";
import Link from "next/link";

export interface Stocks {
  fund: FundEntityWithId;
  currentValue: number;
  amountInvested: number;
  difference: number | undefined;
  profit: number | null;
  currency: string;
}

type FinanceSummaryProps = {
  id: string;
  month: string;
  totalAmount: number;
  regularIncome: number;
  additionalIncomes: { name: string; amount: number }[];
  bankAccounts: Cash[];
  expenses: number;
  stocks: Stocks[];
};

export default function MonthSummaryCard({
  id,
  month,
  totalAmount,
  regularIncome,
  additionalIncomes,
  bankAccounts,
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
            {totalAmount.toLocaleString()}
            {bankAccounts[0]?.currency || "€"}
          </p>
          <p className="text-sm text-muted-foreground">Total Amount</p>
          <Link
            href={`/monthReport/${id}`}
            className="text-sm text-primary underline-offset-4 hover:underline"
          >
            Edit
          </Link>
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
                Regular: {regularIncome.toLocaleString()}
                {bankAccounts[0]?.currency || "€"}
              </p>
              {additionalIncomes.map((income, index) => (
                <p key={index}>
                  {income.name}: {income.amount.toLocaleString()}
                  {bankAccounts[0]?.currency || "€"}
                </p>
              ))}
              <p className="mt-2 font-bold">
                Total: {totalIncome.toLocaleString()}
                {bankAccounts[0]?.currency || "€"}
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
