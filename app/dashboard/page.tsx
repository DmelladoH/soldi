import { getMonthlyReportWithInvestments } from "@/server/db/queries/report";
import { TotalChart } from "./_components/totalChart";

import { formatStock, getInvestmentChart, getTotalChart } from "@/lib/utils";
import { FundTable } from "@/components/fundsTable";
import ReportHeader from "@/components/reportHeader";

export default async function DashBoard() {
  const today = new Date();

  const monthlyReport = await getMonthlyReportWithInvestments(
    today.getUTCMonth(),
    today.getFullYear()
  );

  const chartTotalData = getTotalChart(monthlyReport);
  const chartInvestmentData = getInvestmentChart(monthlyReport);

  const stocks = formatStock(
    monthlyReport[0]?.investments || [],
    monthlyReport[monthlyReport.length - 1]?.investments || []
  );

  return (
    <div className="dashboard-grid">
      <ReportHeader currentMonth={monthlyReport[monthlyReport.length - 1]} />
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
