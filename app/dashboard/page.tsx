import { getMonthlyReportWithInvestments } from "@/server/db/queries/report";
import { TotalChart } from "./_components/totalChart";

import {
  formatStockFromReport,
  getTotalChart,
} from "@/lib/utils";
import { FundTable } from "@/components/fundsTable";
import ReportHeader from "@/components/reportHeader";

export default async function DashBoard() {
  const today = new Date();

  const monthlyReport = await getMonthlyReportWithInvestments({
    endMonth: today.getUTCMonth(),
    endYear: today.getFullYear(),
  });

  const chartTotalData = getTotalChart(monthlyReport);
  
  const stocks = formatStockFromReport(monthlyReport);

  return (
    <div className="grid gap-4">
      <ReportHeader
        currentMonth={monthlyReport[monthlyReport.length - 1]}
        stocks={stocks}
      />
      <div className="w-full ">
        <TotalChart chartData={chartTotalData} title="Total Money" />
      </div>
      <div>
        <h3 className="font-semibold leading-none tracking-tight my-5">
          Investments
        </h3>
        <FundTable stocks={stocks} />
      </div>
    </div>
  );
}
