import FinanceCard from "@/components/financeCard";
import { FundTable } from "@/components/fundsTable";
import { MovementsCategory } from "@/lib/constants";
import {
  formatCurrency,
  formatStockFromReport,
  getTotalMoney,
} from "@/lib/utils";
import { getMonthlyReportWithInvestments } from "@/server/db/queries/report";
import { ArrowUp } from "lucide-react";

export default async function YearReport({
  params,
}: {
  params: Promise<{ year: string }>;
}) {
  const { year } = await params;

  const currentData = await getMonthlyReportWithInvestments({
    startMonth: 12,
    startYear: Number(year) - 1,
    endMonth: 12,
    endYear: Number(year),
  });

  const totalLastYear = getTotalMoney(currentData[0]);
  const totalCurrYear = getTotalMoney(currentData[11]);

  const movements = currentData.map((elem) => elem.movements).flat();
  const investments = currentData.map((elem) => elem.investments).flat();

  const totalInvested = investments.reduce(
    (prev, curr) => prev + curr.amountInvested,
    0
  );

  const totalInvestmentsLastMonth = currentData[
    currentData.length - 1
  ].investments.reduce((prev, curr) => prev + curr.currentValue, 0);

  const totalInvestmentsFirstMonth = currentData[0].investments.reduce(
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

  const stocks = formatStockFromReport(currentData);

  return (
    <div>
      <FinanceCard
        title="Saved"
        value={formatCurrency(totalCurrYear - totalLastYear)}
        icon={<ArrowUp className="h-5 w-5 text-finance-blue" />}
      />
      <FinanceCard
        title="Net Salary"
        value={formatCurrency(totalNetSalary)}
        icon={<ArrowUp className="h-5 w-5 text-finance-blue" />}
      />
      <FinanceCard
        title="Expend in rent"
        value={formatCurrency(totalExpendInRent)}
        icon={<ArrowUp className="h-5 w-5 text-finance-blue" />}
      />
      <FinanceCard
        title="total invested"
        value={formatCurrency(totalInvested)}
        icon={<ArrowUp className="h-5 w-5 text-finance-blue" />}
      />
      {/* <FinanceCard
        title="invested"
        value={formatCurrency(totalInvestmentsLastMonth)}
        icon={<ArrowUp className="h-5 w-5 text-finance-blue" />}
      /> */}
      {/* <FinanceCard
        title="invested"
        value={formatCurrency(
          totalInvestmentsLastMonth - totalInvestmentsFirstMonth - totalInvested
        )}
        icon={<ArrowUp className="h-5 w-5 text-finance-blue" />}
      /> */}
      <section>
        <div>
          You enter the year with {totalInvestmentsFirstMonth.toFixed(2)} and
          leave it with {totalInvestmentsLastMonth.toFixed(2)} (
          {(totalInvestmentsLastMonth - totalInvestmentsFirstMonth).toFixed(2)}{" "}
          more)
        </div>
      </section>
      <FundTable stocks={stocks} />
    </div>
  );
}
