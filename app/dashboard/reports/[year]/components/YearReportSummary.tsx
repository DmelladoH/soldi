import FinanceCard from "@/components/financeCard";
import { formatCurrency } from "@/lib/utils";

interface YearReportSummaryProps {
  totalCurrYear: number;
  totalLastYear: number;
  totalNetSalary: number;
  totalNetSalaryLastYear: number;
  currentYearTotalExpense: number;
  prevYearTotalExpense: number;
  totalInvested: number;
  totalInvestedLastYear: number;
}

export function YearReportSummary({
  totalCurrYear,
  totalLastYear,
  totalNetSalary,
  totalNetSalaryLastYear,
  currentYearTotalExpense,
  prevYearTotalExpense,
  totalInvested,
  totalInvestedLastYear,
}: YearReportSummaryProps) {
  return (
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
    </section>
  );
}