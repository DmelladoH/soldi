import { MonthlyReportsRepository } from "@/server/db/repositories";
import { YearReportSummary } from "./components/YearReportSummary";
import { FinancialMetricsPanel } from "./components/FinancialMetricsPanel";
import { InvestmentChartSection } from "./components/InvestmentChartSection";
import { NoDataState } from "./components/NoDataState";
import {
  FinancialCalculator,
  ReportDataProcessor,
  MetricsCalculator,
} from "./utils/FinancialCalculator";

const monthlyReportsRepository = new MonthlyReportsRepository();

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

  if (!currentYearData.length) return <NoDataState />;

  const currentYearInvestmentData =
    ReportDataProcessor.processYearDataForComparison(
      currentYearData,
      FinancialCalculator,
    );

  const currentYearTotalExpense = currentYearInvestmentData.totalExpense;

  const prevYearData = await monthlyReportsRepository.findWithRelations({
    startMonth: 12,
    startYear: Number(year) - 2,
    endMonth: 12,
    endYear: Number(year) - 1,
  });

  const prevYearInvestmentData =
    ReportDataProcessor.processYearDataForComparison(
      prevYearData,
      FinancialCalculator,
    );

  const prevYearTotalExpense = prevYearInvestmentData.totalExpense;

  const currentYearReport = FinancialCalculator.getReportInfo({
    lastMonthOfPrevYear: prevYearData.slice(-1),
    currentYear: currentYearData.slice(1),
  });

  const prevYearReport = FinancialCalculator.getReportInfo({
    lastMonthOfPrevYear: prevYearData.slice(-1),
    currentYear: prevYearData.slice(1),
  });

  const { totalCurrYear, totalInvested, totalNetSalary } = currentYearReport;
  const {
    totalCurrYear: totalLastYear,
    totalNetSalary: totalNetSalaryLastYear,
    totalInvested: totalInvestedLastYear,
  } = prevYearReport;

  const formattedData = currentYearInvestmentData.formattedData;
  const totalInvestmentGains = currentYearInvestmentData.totalInvestmentGains;
  const totalInvestmentGainsPrev = prevYearInvestmentData.totalInvestmentGains;
  const totalInInvestments = currentYearInvestmentData.totalInInvestments;

  const { percentageGainsThisYear, percentageGainsTotal } =
    MetricsCalculator.calculatePercentageGains(
      totalInInvestments,
      totalInvestmentGains,
      totalInvested,
    );

  const savingsRate = MetricsCalculator.calculateSavingsRate(
    totalNetSalary,
    currentYearTotalExpense,
  );

  const { avgMonthlySavings, avgMonthlyInvested } =
    MetricsCalculator.calculateMonthlyAverages(currentYearData);

  const financialMetrics = {
    totalInInvestments,
    percentageGainsThisYear,
    percentageGainsTotal,
    savingsRate,
    avgMonthlySavings,
    avgMonthlyInvested,
    investmentGainsDiff: totalInvestmentGains - totalInvestmentGainsPrev,
  };
  return (
    <div>
      <YearReportSummary
        totalCurrYear={totalCurrYear}
        totalLastYear={totalLastYear}
        totalNetSalary={totalNetSalary}
        totalNetSalaryLastYear={totalNetSalaryLastYear}
        currentYearTotalExpense={currentYearTotalExpense}
        prevYearTotalExpense={prevYearTotalExpense}
        totalInvested={totalInvested}
        totalInvestedLastYear={totalInvestedLastYear}
      />
      <section className="mt-2 flex gap-2">
        <FinancialMetricsPanel
          totalInvestmentGains={totalInvestmentGains}
          financialMetrics={financialMetrics}
        />
        <InvestmentChartSection formattedData={formattedData} />
      </section>
    </div>
  );
}
