import { FundTable } from "@/components/fundsTable";
import ReportHeader from "@/components/reportHeader";
import { formatStock } from "@/lib/utils";
import { getMonthlyReportWithInvestments } from "@/server/queries";
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
  const currentMonthDate = new Date(Number(year), currentMonthIndex + 1, 0);

  // Handle January: if current month is January (0), previous month is December of previous year
  const previousMonthDate =
    currentMonthDate.getMonth() === 0
      ? new Date(currentMonthDate.getFullYear() - 1, 11, 1)
      : new Date(
          currentMonthDate.getFullYear(),
          currentMonthDate.getMonth() - 1,
          1
        );

  const res = await getMonthlyReportWithInvestments(
    previousMonthDate,
    currentMonthDate
  );

  const currentMonth = res.find(
    (report) => new Date(report.date).getMonth() === currentMonthIndex
  );
  const previousMonth = res.find(
    (report) => new Date(report.date).getMonth() === currentMonthIndex - 1
  );

  const monthlyReport = [...res].reverse();
  const stocks = formatStock(
    currentMonth?.investments || [],
    previousMonth?.investments || [],
    monthlyReport
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
