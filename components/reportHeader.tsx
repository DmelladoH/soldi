import {
  formatCurrency,
  getTotalMoney,
  getTotalMovementByType,
} from "@/lib/utils";
import {
  Wallet,
  ArrowDown,
  TrendingUp,
  BadgeEuro,
} from "lucide-react";
import FinanceCard from "./financeCard";
import { MonthReportWithId, Stock } from "@/lib/types";

export default function ReportHeader({
  currentMonth,
  lastMonth = undefined,
  stocks,
}: {
  currentMonth: MonthReportWithId | undefined;
  lastMonth?: MonthReportWithId | undefined;
  stocks: Stock[];
}) {
  const currentMonthIncome = getTotalMovementByType(
    currentMonth?.movements || [],
    "income"
  );
  const currentMonthExpenses = getTotalMovementByType(
    currentMonth?.movements || [],
    "expense"
  );
  const lastMonthIncome = getTotalMovementByType(
    lastMonth?.movements || [],
    "income"
  );
  const lastMonthExpenses = getTotalMovementByType(
    lastMonth?.movements || [],
    "expense"
  );

  const lastMonthSavingsRate =
    lastMonthIncome === 0
      ? 0
      : (
          ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) *
          100
        ).toFixed(2);

  const currentMonthSavingsRate =
    currentMonthIncome === 0
      ? 0
      : (
          ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) *
          100
        ).toFixed(2);

  const previousMonthWealth = lastMonth ? getTotalMoney(lastMonth) : 0;
  const totalWealth = currentMonth ? getTotalMoney(currentMonth) : 0;

  const totalDiff = stocks.reduce(
    (prev, curr) => prev + (curr.difference || 0),
    0
  );

  const gains = currentMonthIncome + totalDiff;
  const cash =
    currentMonth?.cash.reduce((curr, acc) => curr + acc.amount, 0) || 0;

  const prevCash =
    lastMonth?.cash.reduce((curr, acc) => curr + acc.amount, 0) || 0;

  return (
    <div className="grid gap-4 auto-rows-auto [grid-template-columns:repeat(auto-fill,minmax(291px,1fr))] [&>div]:col-span-1">
      <div className="flex-grow">
        <FinanceCard
          title="Net Worth"
          value={formatCurrency(totalWealth)}
          change={
            lastMonth
              ? {
                  value: formatCurrency(totalWealth - previousMonthWealth),
                  positive: totalWealth > previousMonthWealth,
                }
              : undefined
          }
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
        />
      </div>
      <div className="flex-grow">
        <FinanceCard
          title="Cash"
          change={
            lastMonth
              ? {
                  value: formatCurrency(cash - prevCash),
                  positive: cash > prevCash,
                }
              : undefined
          }
          value={formatCurrency(cash)}
          icon={<BadgeEuro className="h-5 w-5" />}
        />
      </div>
      <div className="flex-grow">
        <FinanceCard
          title="Monthly Expenses"
          change={
            lastMonth
              ? {
                  value: formatCurrency(
                    currentMonthExpenses - lastMonthExpenses
                  ),
                  positive: currentMonthExpenses > lastMonthExpenses,
                }
              : undefined
          }
          value={formatCurrency(currentMonthExpenses)}
          icon={<ArrowDown className="h-5 w-5 text-moneyRed" />}
        />
      </div>
      <div className="flex-grow">
        <FinanceCard
          title="Saving Rate"
          value={`${currentMonthSavingsRate}%`}
          change={
            lastMonth
              ? {
                  value: `${(
                    Number(currentMonthSavingsRate) -
                    Number(lastMonthSavingsRate)
                  ).toFixed(2)}%`,
                  positive:
                    Number(currentMonthSavingsRate) >
                    Number(lastMonthSavingsRate),
                }
              : undefined
          }
          icon={<TrendingUp className="h-5 w-5 text-yellow-600" />}
        />
      </div>
    </div>
  );
}
