import { getMonthlyReportWithInvestments } from "@/server/queries";
import { TotalChart } from "./_components/totalChart";
import FinanceCard from "@/components/financeCard";

import {
  formatCurrency,
  geStockDifference,
  getInvestmentChart,
  getStockProfit,
  getTotalChart,
  getTotalMoney,
} from "@/lib/utils";
import { ArrowDown, ArrowUp, TrendingUp, Wallet } from "lucide-react";
import { FundTable } from "@/components/fundsTable";
import { Movement, movementType } from "@/lib/types";

export default async function DashBoard() {
  const res = await getMonthlyReportWithInvestments();
  const lastMonth = res[0];
  const previousMonth = res[1];
  console.log(res);
  const monthlyReport = [...res].reverse();

  const chartTotalData = getTotalChart(monthlyReport);

  const chartInvestmentData = getInvestmentChart(monthlyReport);

  const totalWealth = getTotalMoney(lastMonth);
  const previousMonthWealth = getTotalMoney(previousMonth);

  const getTotalMovementByType = (
    reportList: Movement[],
    type: movementType
  ) => {
    return reportList?.length
      ? reportList
          .filter((movement) => movement.type === type)
          .reduce((acc, curr) => acc + curr.amount, 0)
      : 0;
  };

  const lastMonthIncome = getTotalMovementByType(
    lastMonth?.movements,
    "income"
  );
  const prevMonthIncome = getTotalMovementByType(
    previousMonth?.movements,
    "income"
  );
  const lastMonthExpenses = getTotalMovementByType(
    lastMonth?.movements,
    "expense"
  );
  const prevMonthExpenses = getTotalMovementByType(
    previousMonth?.movements,
    "expense"
  );

  const lastMonthSavingsRate =
    lastMonthIncome === 0
      ? 0
      : (
          ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) *
          100
        ).toFixed(2);

  const prevMonthSavingsRate =
    prevMonthIncome === 0
      ? 0
      : (
          ((prevMonthIncome - prevMonthExpenses) / prevMonthIncome) *
          100
        ).toFixed(2);

  const stoks = lastMonth?.investments.length
    ? lastMonth.investments.map((stock) => ({
        fund: stock.fund,
        currentValue: stock.currentValue,
        amountInvested: stock.amountInvested,
        difference: geStockDifference(
          stock,
          previousMonth.investments.find((f) => f.fund.id === stock.fund.id)
        ),
        profit: getStockProfit(res, stock, 0),
        currency: stock.currency,
      }))
    : [];

  return (
    <div className="dashboard-grid">
      <div className="totalNetwork">
        <FinanceCard
          title="Net Worth"
          value={formatCurrency(totalWealth)}
          change={{
            value: formatCurrency(totalWealth - previousMonthWealth),
            positive: totalWealth > previousMonthWealth,
          }}
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
        />
      </div>
      <div className="monthIncome">
        <FinanceCard
          title="Monthly Income"
          change={{
            value: formatCurrency(lastMonthIncome - prevMonthIncome),
            positive: lastMonthIncome > prevMonthIncome,
          }}
          value={formatCurrency(lastMonthIncome)}
          icon={<ArrowUp className="h-5 w-5 text-moneyGreen" />}
        />
      </div>
      <div className="monthExpense">
        <FinanceCard
          title="Monthly Expenses"
          change={{
            value: formatCurrency(lastMonthExpenses - prevMonthExpenses),
            positive: lastMonthExpenses > prevMonthExpenses,
          }}
          value={formatCurrency(lastMonthExpenses)}
          icon={<ArrowDown className="h-5 w-5 text-moneyRed" />}
        />
      </div>
      <div className="monthSavings">
        <FinanceCard
          title="Saving Rate"
          value={`${lastMonthSavingsRate}%`}
          change={{
            value: `${(
              Number(lastMonthSavingsRate) - Number(prevMonthSavingsRate)
            ).toFixed(2)}%`,
            positive: lastMonthSavingsRate > prevMonthSavingsRate,
          }}
          icon={<TrendingUp className="h-5 w-5 text-yellow-600" />}
        />
      </div>
      <div className="networkTrend">
        <TotalChart chartData={chartTotalData} title="Total Money" />
      </div>
      <div className="investmentsTend">
        <TotalChart chartData={chartInvestmentData} title="Investments" />
      </div>
      <div className="investmentsState">
        <h3 className="font-semibold leading-none tracking-tight my-5">
          Investments
        </h3>
        <FundTable stocks={stoks} />
      </div>
    </div>
  );
}
