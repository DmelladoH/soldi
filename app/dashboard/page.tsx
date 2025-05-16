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
  const monthlyReport = [...res].reverse();

  const chartTotalData = getTotalChart(monthlyReport);

  const chartInvestmentData = getInvestmentChart(monthlyReport);

  const totalWealth = getTotalMoney(lastMonth);
  const lastMonthIncome =
    lastMonth.payroll +
    lastMonth.additionalIncome.reduce((acc, curr) => acc + curr.amount, 0);

  const lastMonthExpenses = lastMonth.expenses;
  const lastMonthSavingsRate =
    ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100;

  const stoks = lastMonth.investments.map((stock) => ({
    fund: stock.fund,
    currentValue: stock.currentValue,
    amountInvested: stock.amountInvested,
    difference: geStockDifference(res, stock, 0),
    profit: getStockProfit(res, stock, 0),
    currency: stock.currency,
  }));

  // const bankAccounts = lastMonth ? getBankAccounts(lastMonth) : [];

  // const lastMonthSummary =
  //   lastMonth != null
  //     ? {
  //         month: new Date(lastMonth.date).toLocaleDateString("en-GB", {
  //           month: "long",
  //         }),
  //         year: new Date(lastMonth.date).getFullYear(),
  //         income:
  //           lastMonth.payroll +
  //           lastMonth.additionalIncome.reduce(
  //             (acc, curr) => acc + curr.amount,
  //             0
  //           ),
  //         expenses: lastMonth.expenses,
  //         currency: lastMonth.cash[0]?.currency,
  //         savingsRate:
  //           ((lastMonth.payroll +
  //             lastMonth.additionalIncome.reduce(
  //               (acc, curr) => acc + curr.amount,
  //               0
  //             ) -
  //             lastMonth.expenses) /
  //             (lastMonth.payroll +
  //               lastMonth.additionalIncome.reduce(
  //                 (acc, curr) => acc + curr.amount,
  //                 0
  //               ))) *
  //           100,

  //         stocks: lastMonth.investments.map((stock) => ({
  //           fund: stock.fund,
  //           currentValue: stock.currentValue,
  //           amountInvested: stock.amountInvested,
  //           difference: geStockDifference(res, stock, 0),
  //           profit: getStockProfit(res, stock, 0),
  //           currency: stock.currency,
  //         })),
  //       }
  //     : null;

  return (
    <div className="dashboard-grid">
      <div className="totalNetwork">
        <FinanceCard
          title="Net Worth"
          value={formatCurrency(totalWealth)}
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
        />
      </div>
      <div className="monthIncome">
        <FinanceCard
          title="Monthly Income"
          value={formatCurrency(lastMonthIncome)}
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
        />
      </div>
      <div className="monthExpense">
        <FinanceCard
          title="Monthly Expenses"
          value={formatCurrency(lastMonthExpenses)}
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
        />
      </div>
      <div className="monthSavings">
        <FinanceCard
          title="Saving Rate"
          value={`${lastMonthSavingsRate}%`}
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
