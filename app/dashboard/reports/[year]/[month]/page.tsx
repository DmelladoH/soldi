import FinanceCard from "@/components/financeCard";
import { formatCurrency, getTotalMoney } from "@/lib/utils";
import { getMonthlyReportWithInvestments } from "@/server/queries";
import { Wallet } from "lucide-react";
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

  const currentMonthDate = new Date(
    Number(year),
    MONTHS.indexOf(month.toLocaleLowerCase()),
    new Date(
      Number(year),
      MONTHS.indexOf(month.toLocaleLowerCase()) + 1,
    ).getDate()
  );

  const previousMonthDate = new Date(
    currentMonthDate.getFullYear(),
    currentMonthDate.getMonth() - 1,
    1
  );

  console.log({ previousMonthDate, currentMonthDate });
  const res = await getMonthlyReportWithInvestments(
    previousMonthDate,
    currentMonthDate
  );

  const previousMonth = res.length === 2 ? res[0] : null;
  const currentMonth = res.length === 2 ? res[1] : res[0];

  console.log({ currentMonth, previousMonth, res });

  const totalWealth = getTotalMoney(currentMonth);
  const previousMonthWealth = previousMonth ? getTotalMoney(previousMonth) : 0;

  console.log({ totalWealth, previousMonthWealth });
  return (
    <>
      {currentMonth === null ? (
        <span>no reports</span>
      ) : (
        <div>
          <FinanceCard
            title="Net Worth"
            value={formatCurrency(totalWealth)}
            change={{
              value: formatCurrency(totalWealth - previousMonthWealth),
              positive: totalWealth > previousMonthWealth,
            }}
            icon={<Wallet className="h-5 w-5 text-finance-blue" />}
          />
        </div>
      )}
    </>
  );
}
