import { FundTable } from "@/components/fundsTable";
import { CashTable } from "@/components/cashTable";
import { ReportHeader } from "@/components/reportHeader";
import { Card } from "@/components/ui/card";
import { ChartPieLabelList } from "@/components/ui/pieChart";
import { MONTHS } from "@/lib/constants";
import { buildChartConfig, getPieConfigByFundType } from "@/lib/graphs";
import { formatStock } from "@/lib/utils";
import { MonthlyReportsRepository } from "@/server/db/repositories";

const monthlyReportsRepository = new MonthlyReportsRepository();

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

  const res = await monthlyReportsRepository.findWithRelations({
    startMonth: previousDate.month,
    startYear: previousDate.year,
    endMonth: currentDate.month,
    endYear: currentDate.year,
  });

  console.log(res);

  const currentMonth = res.find((report) => report.month === currentDate.month);
  const previousMonth = res.find(
    (report) => report.month === previousDate.month,
  );

  const stocks = formatStock(
    currentMonth?.investments || [],
    previousMonth?.investments || [],
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
          <div className="mt-5 md:flex md:gap-4">
            <div className="grow flex w-[20%]">
              <ChartPieLabelList
                chartData={chartData}
                chartConfig={chartConfig}
              />
            </div>
            <Card className="p-2 mb-4">
              <FundTable
                stocks={stocks.sort((a, b) =>
                  a.fund.name.localeCompare(b.fund.name),
                )}
              />
            </Card>
          </div>
          {currentMonth?.cash && currentMonth.cash.length > 0 && (
            <div className="mt-5">
              <h3 className="text-lg font-semibold mb-3">Cash Accounts</h3>
              <Card className="p-2">
                <CashTable cash={currentMonth.cash} />
              </Card>
            </div>
          )}
        </div>
      )}
    </>
  );
}
