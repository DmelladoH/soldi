import { getMonthlyReportWithInvestments } from "@/server/queries";
import { MonthGraph } from "../_components/monthGraph";
import { getTotalMovementByType } from "@/lib/utils";
import { MonthReportWithId } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default async function ReportLayout({
  params,
  children,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ year: string }>;
}>) {
  const { year } = await params;

  const currentYearRange = {
    start: new Date(Number(year), 0, 1),
    end: new Date(Number(year), 11, 31),
  };

  const res = (
    await getMonthlyReportWithInvestments(
      currentYearRange.start,
      currentYearRange.end
    )
  ).reverse();

  const getYearExpenseIncomeReport = (
    reports: MonthReportWithId[]
  ): { month: string; income: number; expense: number }[] => {
    const res = [];
    for (let i = 0; i < 12; i++) {
      const report = reports.find(
        (report) => new Date(report.date).getMonth() === i
      );
      if (!report) {
        res.push({
          month: new Intl.DateTimeFormat("en-US", {
            month: "short",
          }).format(new Date(currentYearRange.start.getFullYear(), i)),
          income: 0,
          expense: 0,
        });
      } else {
        res.push({
          month: new Intl.DateTimeFormat("en-US", {
            month: "short",
          }).format(new Date(report.date)),
          income: getTotalMovementByType(report.movements, "income"),
          expense: getTotalMovementByType(report.movements, "expense"),
        });
      }
    }
    return res;
  };
  const yearWithExpenseIncome = getYearExpenseIncomeReport(res);
  const prevYear = Number(year) - 1;
  const nextYear = Number(year) + 1;

  return (
    <div className="h-screen flex flex-col">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <div>
          <div className="flex justify-between">
            <Button asChild>
              <a href={`/dashboard/reports/${prevYear}/jan`}>prev</a>
            </Button>
            <Button asChild>
              <a href={`/dashboard/reports/${nextYear}/jan`}>next</a>
            </Button>
          </div>
          <MonthGraph monthReport={yearWithExpenseIncome} />
        </div>
      </header>
      <div className=" grow">{children}</div>
    </div>
  );
}
