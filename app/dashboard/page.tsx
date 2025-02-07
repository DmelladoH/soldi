import { getMonthlyReportWithInvestments } from "@/server/queries";
import MonthReportList from "./components/list";
import { TotalChart } from "./components/totalChart";

export default async function DashBoard() {
  const monthlyReport = await getMonthlyReportWithInvestments();

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

  return (
    <div className="flex w-full border-lime-100 border-2">
      <section>
        <h4 className="text-center mb-2">2024</h4>
        <MonthReportList />
      </section>
      <div className="w-full">
        <TotalChart chartData={chartTotalData} />
        <TotalChart chartData={chartInvestmentData} />
      </div>
    </div>
  );
}
