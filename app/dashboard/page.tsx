import { getMonthlyReportWithInvestments } from "@/server/db/queries/report";
import { TotalChart } from "./_components/totalChart";
import { BarChart } from "lucide-react";

import {
  formatStockFromReport,
  getTotalChart,
} from "@/lib/utils";
import { FundTable } from "@/components/fundsTable";
import ReportHeader from "@/components/reportHeader";
import { Button } from "@/components/ui/button";
import Link from "@/node_modules/next/link";

export default async function DashBoard() {
  const monthlyReport = await getMonthlyReportWithInvestments({});

  if(!monthlyReport.length) return <EmptyState />

  const chartTotalData = getTotalChart(monthlyReport);

  const stocks = formatStockFromReport(monthlyReport);

  return (
    <div className="grid gap-4 p-3 sm:p-5">
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


function EmptyState() {
  return (
    <div className="flex flex-col justify-center items-center flex-nowrap h-screen">
      <p>No Data</p>
      <div className="max-w-60 mt-6">
        <Button asChild className="w-full justify-start" variant="default">
          <Link href={"/dashboard/monthReport"}>
            <BarChart className="mr-2 h-4 w-4" />
            Month Report
          </Link>
        </Button>
      </div>
    </div>
  )
}