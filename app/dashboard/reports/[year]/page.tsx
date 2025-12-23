import FinanceCard from "@/components/financeCard";
import { FundTable } from "@/components/fundsTable";
import { MovementsCategory } from "@/lib/constants";
import { MonthReportWithId } from "@/lib/types";
import {
  formatCurrency,
  formatStockFromReport,
  getTotalMoney,
} from "@/lib/utils";
import { getMonthlyReportWithInvestments } from "@/server/db/queries/report";

function getInfo({ data }: { data: MonthReportWithId[] }) {
  if (data.length === 0) {
    return {
      totalLastYear: 0,
      totalCurrYear: 0,
      totalInvested: 0,
      totalNetSalary: 0,
      totalExpendInRent: 0,
      stocks: [],
      totalInvestmentsFirstMonth: 0,
      totalInvestmentsLastMonth: 0,
    };
  }
  const totalLastYear = getTotalMoney(data[0]);
  const totalCurrYear = getTotalMoney(data[11]);

  const movements = data.map((elem) => elem.movements).flat();
  const investments = data.map((elem) => elem.investments).flat();
  const totalInvested = investments?.reduce(
    (prev, curr) => prev + curr.amountInvested,
    0
  );
  const totalInvestmentsLastMonth = data[data.length - 1].investments?.reduce(
    (prev, curr) => prev + curr.currentValue,
    0
  );

  const totalInvestmentsFirstMonth = data[0].investments?.reduce(
    (prev, curr) => prev + curr.currentValue,
    0
  );
  const groups = Object.groupBy(movements, (e) => e.tagId);
  const foo = Object.values(groups).map((elem) => ({
    id: elem && elem[0]?.tagId,
    type: elem && elem[0]?.type,
    val: elem?.reduce((prev, curr) => prev + curr.amount, 0),
  }));

  const totalNetSalary =
    foo.find((elem) => elem.id === MovementsCategory.payroll)?.val || 0;

  const totalExpendInRent =
    foo.find((elem) => elem.id === MovementsCategory.rent)?.val || 0;

  const stocks = formatStockFromReport(data);

  return {
    totalLastYear,
    totalCurrYear,
    totalInvested,
    totalNetSalary,
    totalExpendInRent,
    stocks,
    totalInvestmentsFirstMonth,
    totalInvestmentsLastMonth,
  };
}

export default async function YearReport({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  const currentYearData = await getMonthlyReportWithInvestments({
    startMonth: 12,
    startYear: Number(year) - 1,
    endMonth: 12,
    endYear: Number(year),
  });

  const prevYearData = await getMonthlyReportWithInvestments({
    startMonth: 12,
    startYear: Number(year) - 2,
    endMonth: 12,
    endYear: Number(year) - 1,
  });

  const { totalLastYear, totalCurrYear, totalInvested, totalNetSalary } =
    getInfo({ data: currentYearData });

  const {
    totalNetSalary: totalNetSalaryLastYear,
    totalInvested: totalInvestedLastYear,
  } = getInfo({
    data: prevYearData,
  });
  return (
    <div>
      <section className="flex gap-2">
        <FinanceCard
          title="Total Wealth"
          value={formatCurrency(totalCurrYear)}
          change={{
            value: formatCurrency(totalCurrYear - totalLastYear),
            positive: totalCurrYear - totalLastYear >= 0,
          }}
          className="bg-green-300/10"
        />
        <FinanceCard
          title="Net Salary"
          value={formatCurrency(totalNetSalary)}
          change={{
            value: formatCurrency(totalNetSalary - totalNetSalaryLastYear),
            positive: totalNetSalary - totalNetSalaryLastYear >= 0,
          }}
        />
        <FinanceCard
          title="total invested"
          value={formatCurrency(totalInvested)}
          change={{
            value: formatCurrency(totalInvested - totalInvestedLastYear),
            positive: totalInvested - totalInvestedLastYear >= 0,
          }}
        />
      </section>
      {/* <FundTable stocks={stocks} /> */}
    </div>
  );
}
