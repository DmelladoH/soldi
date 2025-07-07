import { getMonthlyReportWithInvestments } from "@/server/queries";
import { TotalChart } from "./_components/totalChart";

import { formatStock, getInvestmentChart, getTotalChart } from "@/lib/utils";
import { FundTable } from "@/components/fundsTable";
import ReportHeader from "@/components/reportHeader";

export default async function DashBoard() {
  const today = new Date();

  const res = await getMonthlyReportWithInvestments(
    today.getUTCMonth(),
    today.getFullYear()
  );

  const monthlyReport = [...res].reverse();

  const currentMonth = monthlyReport.find(
    (report) => report.month === today.getUTCMonth()
  );

  const lastMonth = monthlyReport.find(
    (report) => report.month === today.getUTCMonth() - 1
  );

  const chartTotalData = getTotalChart(monthlyReport);

  const chartInvestmentData = getInvestmentChart(monthlyReport);

  const stocks = formatStock(
    currentMonth?.investments || [],
    lastMonth?.investments || [],
    monthlyReport
  );

  return (
    <div className="dashboard-grid">
      <ReportHeader currentMonth={currentMonth} lastMonth={lastMonth} />
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
        <FundTable stocks={stocks} />
      </div>
    </div>
  );
}
