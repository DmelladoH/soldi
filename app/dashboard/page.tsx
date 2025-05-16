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
import { Wallet } from "lucide-react";
import { FundTable } from "@/components/fundsTable";

export default async function DashBoard() {
  const res = await getMonthlyReportWithInvestments();
  const lastMonth = res[0];
  const previousMonth = res[1];

  const monthlyReport = [...res].reverse();

  const chartTotalData = getTotalChart(monthlyReport);

  const chartInvestmentData = getInvestmentChart(monthlyReport);

  const totalWealth = getTotalMoney(lastMonth);
  const previousMonthWealth = getTotalMoney(previousMonth);

  const lastMonthIncome =
    lastMonth.payroll +
    lastMonth.additionalIncome.reduce((acc, curr) => acc + curr.amount, 0);

  const prevMonthIncome =
    previousMonth.payroll +
    previousMonth.additionalIncome.reduce((acc, curr) => acc + curr.amount, 0);

  const lastMonthExpenses = lastMonth.expenses;
  const prevMonthExpenses = previousMonth.expenses;

  const lastMonthSavingsRate = (
    ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) *
    100
  ).toFixed(2);

  const prevMonthSavingsRate = (
    ((prevMonthIncome - prevMonthExpenses) / prevMonthIncome) *
    100
  ).toFixed(2);

  const stoks = lastMonth.investments.map((stock) => ({
    fund: stock.fund,
    currentValue: stock.currentValue,
    amountInvested: stock.amountInvested,
    difference: geStockDifference(res, stock, 0),
    profit: getStockProfit(res, stock, 0),
    currency: stock.currency,
  }));

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
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
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
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
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
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
        />
      </div>
      <div className="networkTrend">
        <TotalChart chartData={chartTotalData} title="Total Money" />
      </div>
      <div className="investmentsTend">
        <TotalChart chartData={chartInvestmentData} title="Investments" />
      </div>
      <div className="investmentsState">
        <FundTable stocks={stoks} />
      </div>
    </div>
  );
}
