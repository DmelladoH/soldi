import { getMonthlyReportWithInvestments } from "@/server/queries";
import { TotalChart } from "./_components/totalChart";
import FinanceCard from "@/components/financeCard";
import MonthResumeCart from "./_components/cart";
import AccountsCart from "@/components/accountsCart";
import NoDataCart from "@/components/noDataCart";

export default async function DashBoard() {
  const res = await getMonthlyReportWithInvestments();
  const monthlyReport = res.reverse();

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
    monthlyReport.length > 0
      ? monthlyReport[0].cash.reduce((acc, curr) => acc + curr.amount, 0) +
        monthlyReport[0].investments.reduce(
          (acc, curr) => acc + curr.currentValue,
          0
        )
      : 0;

  const bankAccounts =
    monthlyReport.length > 0
      ? monthlyReport[0].cash.map((account) => ({
          name: account.name,
          amount: account.amount,
          currency: account.currency,
        }))
      : [];

  const lastMonthSummary = monthlyReport[0]
    ? {
        month: new Date(monthlyReport[0].date).toLocaleDateString("en-GB", {
          month: "long",
        }),
        year: new Date(monthlyReport[0].date).getFullYear(),
        income:
          monthlyReport[0].payroll +
          monthlyReport[0].additionalIncome.reduce(
            (acc, curr) => acc + curr.amount,
            0
          ),
        expenses: monthlyReport[0].expenses,
        savingsRate:
          monthlyReport[0].expenses / monthlyReport[0].payroll +
          monthlyReport[0].additionalIncome.reduce(
            (acc, curr) => acc + curr.amount,
            0
          ) *
            100,

        stocks: monthlyReport[0].investments.map((stock) => ({
          fund: stock.fund,
          currentValue: stock.currentValue,
          amountInvested: stock.amountInvested,
          difference:
            (monthlyReport[0]?.investments?.find((s) => s.fund === stock.fund)
              ?.currentValue ?? 0) - stock.currentValue,
          profit: 0,
          currency: stock.currency,
        })),
        // stocks: [
        //   {
        //     symbol: monthlyReport[0].investments[0].fund,
        //     name: monthlyReport[0].investments[0],
        //     currentValue: 10,
        //     amountInvested: 180.95,
        //     change: 1.25,
        //   },
        //   {
        //     symbol: "GOOGL",
        //     name: "Alphabet Inc.",
        //     shares: 5,
        //     price: 2750.5,
        //     change: -0.75,
        //   },
        //   {
        //     symbol: "MSFT",
        //     name: "Microsoft Corporation",
        //     shares: 15,
        //     price: 335.4,
        //     change: 0.5,
        //   },
        //   {
        //     symbol: "AMZN",
        //     name: "Amazon.com, Inc.",
        //     shares: 8,
        //     price: 3380.0,
        //     change: 2.1,
        //   },
        // ],
      }
    : null;

  return (
    <div className="flex w-full h-full gap-5">
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
        <TotalChart chartData={chartTotalData} />
        <TotalChart chartData={chartInvestmentData} />
      </div>
    </div>
  );
}
