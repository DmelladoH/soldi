import { getMonthlyReportWithInvestments } from "@/server/queries";
import { MonthGraph } from "./_components/monthGraph";
import { getTotalMovementByType } from "@/lib/utils";
import { MonthReportWithId } from "@/lib/types";
import { Button } from "@/components/ui/button";

export default async function ReportLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const today = new Date();
  const lastYearDate = new Date(
    today.getFullYear() - 1,
    today.getMonth(),
    today.getDate()
  );

  const res = (
    await getMonthlyReportWithInvestments(lastYearDate, today)
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
          }).format(new Date(lastYearDate.getFullYear(), i)),
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
  const prevYear = lastYearDate.getFullYear() - 1;
  const nextYear = lastYearDate.getFullYear() + 1;
  const currentYear = lastYearDate.getFullYear();

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
