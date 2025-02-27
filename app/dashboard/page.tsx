import { getMonthlyReportWithInvestments } from "@/server/queries";
import { TotalChart } from "./_components/totalChart";
import FinanceCard from "@/components/financeCard";
import MonthResumeCart from "./_components/cart";
import AccountsCart from "@/components/accountsCart";
import NoDataCart from "@/components/noDataCart";
import { geStockDifference, getStockProfit } from "@/lib/utils";

export default async function DashBoard() {
  const res = await getMonthlyReportWithInvestments();
  const lastMonth = res[0];
  const monthlyReport = [...res].reverse();

  const chartTotalData = monthlyReport.map((report) => {
    return {
      month: new Date(report.date).toLocaleDateString("en-GB", {
        month: "long",
      }),
      amount:
        report.cash.reduce((acc, curr) => acc + curr.amount, 0) +
        report.investments.reduce((acc, curr) => acc + curr.currentValue, 0),
    };
  });

  const chartInvestmentData = monthlyReport.map((report) => {
    return {
      month: new Date(report.date).toLocaleDateString("en-GB", {
        month: "long",
      }),
      amount: report.investments.reduce(
        (acc, curr) => acc + curr.currentValue,
        0
      ),
    };
  });

  const totalWealth =
    lastMonth != null
      ? lastMonth.cash.reduce((acc, curr) => acc + curr.amount, 0) +
        lastMonth.investments.reduce((acc, curr) => acc + curr.currentValue, 0)
      : 0;

  const bankAccounts =
    lastMonth != null
      ? lastMonth.cash.map((account) => ({
          name: account.name,
          amount: account.amount,
          currency: account.currency,
        }))
      : [];

  const lastMonthSummary =
    lastMonth != null
      ? {
          month: new Date(lastMonth.date).toLocaleDateString("en-GB", {
            month: "long",
          }),
          year: new Date(lastMonth.date).getFullYear(),
          income:
            lastMonth.payroll +
            lastMonth.additionalIncome.reduce(
              (acc, curr) => acc + curr.amount,
              0
            ),
          expenses: lastMonth.expenses,
          currency: lastMonth.cash[0]?.currency,
          savingsRate:
            ((lastMonth.payroll +
              lastMonth.additionalIncome.reduce(
                (acc, curr) => acc + curr.amount,
                0
              ) -
              lastMonth.expenses) /
              (lastMonth.payroll +
                lastMonth.additionalIncome.reduce(
                  (acc, curr) => acc + curr.amount,
                  0
                ))) *
            100,

          stocks: lastMonth.investments.map((stock) => ({
            fund: stock.fund,
            currentValue: stock.currentValue,
            amountInvested: stock.amountInvested,
            difference: geStockDifference(res, stock, 0),
            profit: getStockProfit(res, stock, 0),
            currency: stock.currency,
          })),
        }
      : null;

  return (
    <div className="grid md:flex w-full h-full gap-5">
      <div className="w-full grid gap-5">
        <FinanceCard totalAmount={totalWealth} />
        <AccountsCart bankAccounts={bankAccounts} />
        {lastMonthSummary ? (
          <MonthResumeCart {...lastMonthSummary} />
        ) : (
          <NoDataCart />
        )}
      </div>
      <div className="grid gap-2 w-full">
        <TotalChart chartData={chartTotalData} title="Total Money" />
        <TotalChart chartData={chartInvestmentData} title="Investments" />
      </div>
    </div>
  );
}
