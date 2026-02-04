import FinanceCard from "@/components/financeCard";
import { MonthMap, MovementsCategory } from "@/lib/constants";
import { MonthReportWithId } from "@/types/database";
import {
  calculateAllMonthlyGains,
  formatCurrency,
  formatStockFromReport,
  getTotalMoney,
} from "@/lib/utils";
import { MonthlyReportsRepository } from "@/server/db/repositories";
import { InvestmentSummary } from "../_components/investmentSummary";

const monthlyReportsRepository = new MonthlyReportsRepository();

function getInfo({
  lastMonthOfPrevYear,
  currentYear,
}: {
  lastMonthOfPrevYear: MonthReportWithId[];
  currentYear: MonthReportWithId[];
}) {
  if (currentYear.length === 0) {
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

  const totalCurrYear = getTotalMoney(currentYear[currentYear.length - 1]);

  const movements = currentYear.map((elem) => elem.movements)?.flat();
  const investments = currentYear.map((elem) => elem.investments)?.flat();
  const totalInvested = investments?.reduce(
    (prev, curr) => prev + curr.amountInvested,
    0,
  );

  const groups = movements.reduce(
    (acc, movement) => {
      const tagId = movement.tagId;
      if (!acc[tagId]) {
        acc[tagId] = [];
      }
      acc[tagId].push(movement);
      return acc;
    },
    {} as Record<string, typeof movements>,
  );

  const foo = Object.values(groups).map((elem) => ({
    id: elem && elem[0]?.tagId,
    type: elem && elem[0]?.type,
    val: elem?.reduce((prev, curr) => prev + curr.amount, 0),
  }));

  const totalNetSalary =
    foo.find((elem) => elem.id === MovementsCategory.payroll)?.val || 0;

  const totalExpendInRent =
    foo.find((elem) => elem.id === MovementsCategory.rent)?.val || 0;

  const stocks = formatStockFromReport([
    ...lastMonthOfPrevYear,
    ...currentYear,
  ]);
  const totalDiff = stocks?.reduce(
    (prev, curr) => prev + (curr.difference || 0),
    0,
  );

  return {
    totalCurrYear,
    totalInvested,
    totalNetSalary,
    totalExpendInRent,
    stocks,
    totalDiff,
  };
}

export default async function YearReport({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  const currentYearData = await monthlyReportsRepository.findWithRelations({
    startMonth: 12,
    startYear: Number(year) - 1,
    endMonth: 12,
    endYear: Number(year),
  });

  console.log({ currentYearData });

  if (!currentYearData.length)
    return (
      <div className="flex justify-center w-full pt-14">
        <p>No Data</p>
      </div>
    );

  const currentYearTotalExpense = currentYearData
    ?.map((e) => e.movements)
    ?.flat()
    ?.filter((e) => e.type === "expense")
    ?.reduce((acc, curr) => acc + curr.amount, 0);

  const prevYearData = await monthlyReportsRepository.findWithRelations({
    startMonth: 12,
    startYear: Number(year) - 2,
    endMonth: 12,
    endYear: Number(year) - 1,
  });

  const prevYearTotalExpense = prevYearData
    ?.map((e) => e.movements)
    ?.flat()
    ?.filter((e) => e.type === "expense")
    ?.reduce((acc, curr) => acc + curr.amount, 0);

  const { totalCurrYear, totalInvested, totalNetSalary } = getInfo({
    lastMonthOfPrevYear: prevYearData.slice(-1),
    currentYear: currentYearData.slice(1),
  });

  const {
    totalCurrYear: totalLastYear,
    totalNetSalary: totalNetSalaryLastYear,
    totalInvested: totalInvestedLastYear,
  } = getInfo({
    lastMonthOfPrevYear: prevYearData.slice(-1),
    currentYear: prevYearData.slice(1),
  });

  const data = calculateAllMonthlyGains(currentYearData);
  const foo = data.map((e) => ({
    month: MonthMap[e.month as keyof typeof MonthMap],
    value: e.fundGains.reduce(
      (acc: number, curr: { gain: number }) => curr.gain + acc,
      0,
    ),
  }));
  const formattedData = foo[0]?.month === "December" ? [...foo.slice(1)] : foo;

  const totalInvestmentGains = formattedData.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );

  const dataPrevYear = calculateAllMonthlyGains(prevYearData);

  const foo2 = dataPrevYear.map((e) => ({
    month: MonthMap[e.month as keyof typeof MonthMap],
    value: e.fundGains.reduce(
      (acc: number, curr: { gain: number }) => curr.gain + acc,
      0,
    ),
  }));

  const formattedDataPrevYear =
    foo2[0]?.month === "December" ? [...foo2.slice(1)] : foo2;

  const totalInvestmentGainsPrev = formattedDataPrevYear.reduce(
    (acc, curr) => acc + curr.value,
    0,
  );

  const totalInInvestments = currentYearData[
    currentYearData.length - 1
  ].investments?.reduce((acc, curr) => acc + curr.currentValue, 0);

  const percentageGainsThisYear =
    ((totalInInvestments - (totalInInvestments - totalInvestmentGains)) /
      totalInvested) *
    100;

  const percentageGainsTotal =
    (totalInvestmentGains / totalInInvestments) * 100;

  const savingsRate =
    ((totalNetSalary - currentYearTotalExpense) / totalNetSalary) * 100;
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
          title="Total Expenses"
          value={formatCurrency(currentYearTotalExpense)}
          change={{
            value: formatCurrency(
              currentYearTotalExpense - prevYearTotalExpense,
            ),
            positive: currentYearTotalExpense - prevYearTotalExpense >= 0,
          }}
        />
        <FinanceCard
          title="Total invested this year"
          value={formatCurrency(totalInvested)}
          change={{
            value: formatCurrency(totalInvested - totalInvestedLastYear),
            positive: totalInvested - totalInvestedLastYear >= 0,
          }}
        />
        <FinanceCard
          title="Total In investments"
          value={formatCurrency(totalInInvestments)}
        />
      </section>
      <section className="mt-2">
        <div className="flex gap-2 mb-2">
          <FinanceCard
            title="Total investments gains"
            value={formatCurrency(totalInvestmentGains)}
            change={{
              value: formatCurrency(
                totalInvestmentGains - totalInvestmentGainsPrev,
              ),
              positive: totalInvestmentGains - totalInvestmentGainsPrev >= 0,
            }}
          />
          <FinanceCard
            title="Profit over invested this year"
            value={`${percentageGainsThisYear.toFixed(2)}%`}
          />
          <FinanceCard
            title="Profit over total invested"
            value={`${percentageGainsTotal.toFixed(2)}%`}
          />
          <FinanceCard
            title="Savings Rate"
            value={`${savingsRate.toFixed(2)}%`}
          />
        </div>

        <InvestmentSummary rangeData={formattedData} />
      </section>
    </div>
  );
}
