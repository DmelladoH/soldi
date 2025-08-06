import { FundTable } from "@/components/fundsTable";
import ReportHeader from "@/components/reportHeader";
import { formatStock } from "@/lib/utils";
import { getMonthlyReportWithInvestments } from "@/server/db/queries/report";
const MONTHS = [
  "jan",
  "feb",
  "mar",
  "apr",
  "may",
  "jun",
  "jul",
  "aug",
  "sep",
  "oct",
  "nov",
  "dec",
];
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

  console.log({ currentDate, previousDate });

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

  return (
    <>
      {currentMonth === null ? (
        <span>no reports</span>
      ) : (
        <div className="">
          <div className="flex gap-4 w-full mb-5">
            <ReportHeader
              currentMonth={currentMonth}
              lastMonth={previousMonth}
            />
          </div>
          <div className="mt-5">
            <FundTable stocks={stocks} />
          </div>
        </div>
      )}
    </>
  );
}
