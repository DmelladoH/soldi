import {
  formatCurrency,
  getTotalMoney,
  getTotalMovementByType,
} from "@/lib/utils";
import { Wallet, ArrowUp, ArrowDown, TrendingUp } from "lucide-react";
import FinanceCard from "./financeCard";
import { MonthReportWithId } from "@/lib/types";

export default function ReportHeader({
  currentMonth,
  lastMonth = undefined,
}: {
  currentMonth: MonthReportWithId | undefined;
  lastMonth?: MonthReportWithId | undefined;
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

  return (
    <>
      <div className="totalNetwork flex-grow">
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
      <div className="monthIncome flex-grow">
        <FinanceCard
          title="Monthly Income"
          change={
            lastMonth
              ? {
                  value: formatCurrency(currentMonthIncome - lastMonthIncome),
                  positive: currentMonthIncome > lastMonthIncome,
                }
              : undefined
          }
          value={formatCurrency(currentMonthIncome)}
          icon={<ArrowUp className="h-5 w-5 text-moneyGreen" />}
        />
      </div>
      <div className="monthExpense flex-grow">
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
      <div className="monthSavings flex-grow">
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
                  positive: currentMonthSavingsRate > lastMonthSavingsRate,
                }
              : undefined
          }
          icon={<TrendingUp className="h-5 w-5 text-yellow-600" />}
        />
      </div>
    </>
  );
}
