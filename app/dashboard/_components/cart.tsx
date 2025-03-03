import { FundTable } from "@/components/fundsTable";
import { Card, CardContent } from "@/components/ui/card";
import { FundEntityWithId } from "@/lib/types";

interface Stocks {
  fund: FundEntityWithId;
  currentValue: number;
  amountInvested: number;
  difference: number;
  profit: number;
  currency: string;
}

type FinanceSummaryProps = {
  month: string;
  year: number;
  income: number;
  expenses: number;
  currency: string;
  savingsRate: number;
  stocks?: Stocks[];
};

export default function MonthResumeCart({
  month,
  year,
  income,
  expenses,
  savingsRate,
  currency,
  stocks,
}: FinanceSummaryProps) {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="pt-6 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {month} {year}
          </h2>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm">
          <div>
            <p className="font-semibold">Income</p>
            <p className="text-green-600">
              {income.toLocaleString()}
              {currency}
            </p>
          </div>
          <div>
            <p className="font-semibold">Expenses</p>
            <p className="text-red-600">
              {expenses.toLocaleString()}
              {currency}
            </p>
          </div>
          <div>
            <p className="font-semibold">Savings Rate</p>
            <p>{savingsRate.toFixed(2)}%</p>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Stocks</h3>
          {stocks && <FundTable stocks={stocks} />}
        </div>
      </CardContent>
    </Card>
  );
}
