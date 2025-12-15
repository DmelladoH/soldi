import { FundTable } from "@/components/fundsTable";
import ReportHeader from "@/components/reportHeader";
import { ChartPieLabelList } from "@/components/ui/pieChart";
import { MONTHS } from "@/lib/constants";
import { buildChartConfig, getPieConfigByFundType } from "@/lib/graphs";
import { formatStock } from "@/lib/utils";
import { getMonthlyReportWithInvestments } from "@/server/db/queries/report";

export default async function Page({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { month, year } = await params;

  // Get the last day of the current month
  const currentMonthIndex = MONTHS.indexOf(month.toLocaleLowerCase());

  const currentDate = {
    month: currentMonthIndex + 1,
    year: Number(year),
  };

  const previousDate = {
    month: currentMonthIndex === 0 ? 12 : currentMonthIndex,
    year: currentMonthIndex === 0 ? Number(year) - 1 : Number(year),
  };

  const res = await getMonthlyReportWithInvestments({
    startMonth: previousDate.month,
    startYear: previousDate.year,
    endMonth: currentDate.month,
    endYear: currentDate.year,
  });

  const currentMonth = res.find((report) => report.month === currentDate.month);
  const previousMonth = res.find(
    (report) => report.month === previousDate.month
  );

  const stocks = formatStock(
    currentMonth?.investments || [],
    previousMonth?.investments || []
  );

  const chartData = getPieConfigByFundType(stocks);
  const chartConfig = buildChartConfig(chartData);

  return (
    <>
      {currentMonth === null ? (
        <span>no reports</span>
      ) : (
        <div className="">
          <div className="mb-5">
            <ReportHeader
              currentMonth={currentMonth}
              lastMonth={previousMonth}
              stocks={stocks}
            />
          </div>
          <div className="mt-5 md:flex md:gap-2 ">
            <div className="grow flex w-[20%]">
              <ChartPieLabelList
                chartData={chartData}
                chartConfig={chartConfig}
              />
            </div>
            <div>
              <FundTable stocks={stocks} />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
