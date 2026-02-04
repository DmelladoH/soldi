import { MonthReportWithId, Stock } from "@/types/database";
import { MovementsCategory, MonthMap } from "@/lib/constants";
import {
  formatStockFromReport,
  getTotalMoney,
  calculateAllMonthlyGains,
} from "@/lib/utils";

interface ReportInfo {
  totalCurrYear: number;
  totalInvested: number;
  totalNetSalary: number;
  totalExpendInRent: number;
  stocks: Stock[];
  totalDiff: number;
}

interface YearlyExpenseData {
  totalExpense: number;
  investmentGains: number;
  formattedData: Array<{ month: string; value: number }>;
  totalInvestmentGains: number;
  totalInInvestments: number;
}

export class FinancialCalculator {
  static getReportInfo({
    lastMonthOfPrevYear,
    currentYear,
  }: {
    lastMonthOfPrevYear: MonthReportWithId[];
    currentYear: MonthReportWithId[];
  }): ReportInfo {
    if (currentYear.length === 0) {
      return {
        totalCurrYear: 0,
        totalInvested: 0,
        totalNetSalary: 0,
        totalExpendInRent: 0,
        stocks: [],
        totalDiff: 0,
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

    const categoryTotals = Object.values(groups).map((elem) => ({
      id: elem && elem[0]?.tagId,
      type: elem && elem[0]?.type,
      val: elem?.reduce((prev, curr) => prev + curr.amount, 0),
    }));

    const totalNetSalary =
      categoryTotals.find((elem) => elem.id === MovementsCategory.payroll)
        ?.val || 0;

    const totalExpendInRent =
      categoryTotals.find((elem) => elem.id === MovementsCategory.rent)?.val ||
      0;

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

  static calculateYearlyExpenses(
    yearData: MonthReportWithId[],
  ): YearlyExpenseData {
    const totalExpense =
      yearData
        .slice(1)
        ?.map((e) => e.movements)
        ?.flat()
        ?.filter((e) => e.type === "expense")
        ?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

    return {
      totalExpense,
      investmentGains: 0,
      formattedData: [],
      totalInvestmentGains: 0,
      totalInInvestments: 0,
    };
  }

  static processInvestmentGains(
    yearData: MonthReportWithId[],
  ): Array<{ month: string; value: number }> {
    const data = calculateAllMonthlyGains(yearData);
    const processedData = data.map(
      (e: { month: number; fundGains: { gain: number }[] }) => ({
        month: MonthMap[e.month as keyof typeof MonthMap],
        value: e.fundGains.reduce(
          (acc: number, curr: { gain: number }) => curr.gain + acc,
          0,
        ),
      }),
    );

    return processedData[0]?.month === "December"
      ? [...processedData.slice(1)]
      : processedData;
  }
}

export class MetricsCalculator {
  static calculatePercentageGains(
    totalInInvestments: number,
    totalInvestmentGains: number,
    totalInvested: number,
  ): { percentageGainsThisYear: number; percentageGainsTotal: number } {
    const percentageGainsThisYear =
      ((totalInInvestments - (totalInInvestments - totalInvestmentGains)) /
        totalInvested) *
      100;

    const percentageGainsTotal =
      (totalInvestmentGains / totalInInvestments) * 100;

    return {
      percentageGainsThisYear,
      percentageGainsTotal,
    };
  }

  static calculateSavingsRate(
    totalNetSalary: number,
    totalExpense: number,
  ): number {
    return ((totalNetSalary - totalExpense) / totalNetSalary) * 100;
  }

  static calculateMonthlyAverages(yearData: MonthReportWithId[]): {
    avgMonthlySavings: number;
    avgMonthlyInvested: number;
  } {
    const monthlyData = yearData.slice(1);

    const monthlySavings = monthlyData.map((month) => {
      const monthExpenses = month.movements
        .filter((m) => m.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0);
      const monthIncome = month.movements
        .filter((m) => m.type === "income")
        .reduce((acc, curr) => acc + curr.amount, 0);
      return monthIncome - monthExpenses;
    });

    const monthlyInvestments = monthlyData.map((month) =>
      month.investments.reduce((acc, curr) => acc + curr.amountInvested, 0),
    );

    const avgMonthlySavings =
      monthlySavings.length > 0
        ? monthlySavings.reduce((acc, curr) => acc + curr, 0) /
          monthlySavings.length
        : 0;

    const avgMonthlyInvested =
      monthlyInvestments.length > 0
        ? monthlyInvestments.reduce((acc, curr) => acc + curr, 0) /
          monthlyInvestments.length
        : 0;

    return {
      avgMonthlySavings,
      avgMonthlyInvested,
    };
  }
}

export class ReportDataProcessor {
  static processYearDataForComparison(
    yearData: MonthReportWithId[],
    financialCalculator: typeof FinancialCalculator,
  ): {
    totalExpense: number;
    investmentGains: number;
    formattedData: Array<{ month: string; value: number }>;
    totalInvestmentGains: number;
    totalInInvestments: number;
  } {
    const totalExpense =
      financialCalculator.calculateYearlyExpenses(yearData).totalExpense;

    const formattedData = financialCalculator.processInvestmentGains(yearData);

    const totalInvestmentGains = formattedData.reduce(
      (acc, curr) => acc + curr.value,
      0,
    );

    const totalInInvestments =
      yearData[yearData.length - 1]?.investments?.reduce(
        (acc, curr) => acc + curr.currentValue,
        0,
      ) || 0;

    return {
      totalExpense,
      investmentGains: 0,
      formattedData,
      totalInvestmentGains,
      totalInInvestments,
    };
  }
}
