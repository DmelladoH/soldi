import {
  calculateAllMonthlyGains,
  getTotalCash,
  getTotalInvestments,
  formatStock,
  formatStockFromReport,
} from "@/lib/utils";
import { MonthReportWithId, Stock, Cash } from "@/types/database";
import { MonthlyReportsRepository } from "../repositories";

export interface FinancialSummary {
  totalCash: number;
  totalInvestments: number;
  totalNetWorth: number;
  monthlyChange: number;
  monthlyChangePercent: number;
  totalGains: number;
  investmentProfitability: number;
}

export interface MonthlyReportSummary {
  month: number;
  year: number;
  totalIncome: number;
  totalExpenses: number;
  netIncome: number;
  totalCash: number;
  totalInvestments: number;
  investmentGains: number;
  cashAccounts: Cash[];
  stockPerformance: Stock[];
}

export class MonthlyReportsService {
  constructor(private monthlyReportsRepository: MonthlyReportsRepository) {}

  /**
   * Get comprehensive financial summary for the latest month
   */
  async getLatestFinancialSummary(): Promise<FinancialSummary | null> {
    const reports = await this.monthlyReportsRepository.findWithRelations({
      orderBy: "desc",
      limit: 2,
    });

    if (!reports.length) return null;

    const latestReport = reports[0];
    const previousReport = reports[1];

    const totalCash = getTotalCash(latestReport.cash);
    const totalInvestments = getTotalInvestments(latestReport.investments);
    const totalNetWorth = totalCash + totalInvestments;

    const previousTotal = previousReport
      ? getTotalCash(previousReport.cash) +
        getTotalInvestments(previousReport.investments)
      : totalNetWorth;

    const monthlyChange = totalNetWorth - previousTotal;
    const monthlyChangePercent =
      previousTotal > 0 ? (monthlyChange / previousTotal) * 100 : 0;

    const gains = calculateAllMonthlyGains(reports);
    const totalGains = gains.reduce((sum, gain) => sum + gain.totalGain, 0);

    const investmentProfitability =
      totalInvestments > 0 ? (totalGains / totalInvestments) * 100 : 0;

    return {
      totalCash,
      totalInvestments,
      totalNetWorth,
      monthlyChange,
      monthlyChangePercent,
      totalGains,
      investmentProfitability,
    };
  }

  /**
   * Get detailed monthly report summary
   */
  async getMonthlySummary(
    month: number,
    year: number,
  ): Promise<MonthlyReportSummary | null> {
    const reports = await this.monthlyReportsRepository.findWithRelations({
      startMonth: month,
      startYear: year,
      endMonth: month,
      endYear: year,
      limit: 1,
    });

    if (!reports.length) return null;

    const report = reports[0];

    const totalIncome = report.movements
      .filter((m) => m.type === "income")
      .reduce((sum, m) => sum + m.amount, 0);

    const totalExpenses = report.movements
      .filter((m) => m.type === "expense")
      .reduce((sum, m) => sum + m.amount, 0);

    const netIncome = totalIncome - totalExpenses;
    const totalCash = getTotalCash(report.cash);
    const totalInvestments = getTotalInvestments(report.investments);

    const gains = calculateAllMonthlyGains([report]);
    const investmentGains = gains.length > 0 ? gains[0].totalGain : 0;

    const stockPerformance = formatStock(report.investments, []);

    return {
      month: report.month,
      year: report.year,
      totalIncome,
      totalExpenses,
      netIncome,
      totalCash,
      totalInvestments,
      investmentGains,
      cashAccounts: report.cash,
      stockPerformance,
    };
  }

  /**
   * Get year-to-date performance comparison
   */
  async getYearToDateComparison(year: number): Promise<{
    currentYear: FinancialSummary;
    previousYear: FinancialSummary;
    yearOverYearGrowth: number;
  } | null> {
    const currentYearReports =
      await this.monthlyReportsRepository.findByYear(year);
    const previousYearReports = await this.monthlyReportsRepository.findByYear(
      year - 1,
    );

    if (!currentYearReports.length || !previousYearReports.length) return null;

    const currentYearGains = calculateAllMonthlyGains(currentYearReports);
    const previousYearGains = calculateAllMonthlyGains(previousYearReports);

    const currentYearTotalInvestments = currentYearReports.reduce(
      (sum, report) => sum + getTotalInvestments(report.investments),
      0,
    );
    const previousYearTotalInvestments = previousYearReports.reduce(
      (sum, report) => sum + getTotalInvestments(report.investments),
      0,
    );

    const currentYearTotalCash = currentYearReports.reduce(
      (sum, report) => sum + getTotalCash(report.cash),
      0,
    );
    const previousYearTotalCash = previousYearReports.reduce(
      (sum, report) => sum + getTotalCash(report.cash),
      0,
    );

    const currentYearNetWorth =
      currentYearTotalInvestments + currentYearTotalCash;
    const previousYearNetWorth =
      previousYearTotalInvestments + previousYearTotalCash;

    const currentYearGainsTotal = currentYearGains.reduce(
      (sum, gain) => sum + gain.totalGain,
      0,
    );
    const previousYearGainsTotal = previousYearGains.reduce(
      (sum, gain) => sum + gain.totalGain,
      0,
    );

    const currentYear: FinancialSummary = {
      totalCash: currentYearTotalCash,
      totalInvestments: currentYearTotalInvestments,
      totalNetWorth: currentYearNetWorth,
      monthlyChange: 0, // Not applicable for year summary
      monthlyChangePercent: 0,
      totalGains: currentYearGainsTotal,
      investmentProfitability:
        currentYearTotalInvestments > 0
          ? (currentYearGainsTotal / currentYearTotalInvestments) * 100
          : 0,
    };

    const previousYear: FinancialSummary = {
      totalCash: previousYearTotalCash,
      totalInvestments: previousYearTotalInvestments,
      totalNetWorth: previousYearNetWorth,
      monthlyChange: 0,
      monthlyChangePercent: 0,
      totalGains: previousYearGainsTotal,
      investmentProfitability:
        previousYearTotalInvestments > 0
          ? (previousYearGainsTotal / previousYearTotalInvestments) * 100
          : 0,
    };

    const yearOverYearGrowth =
      previousYearNetWorth > 0
        ? ((currentYearNetWorth - previousYearNetWorth) /
            previousYearNetWorth) *
          100
        : 0;

    return {
      currentYear,
      previousYear,
      yearOverYearGrowth,
    };
  }

  /**
   * Get investment performance analysis
   */
  async getInvestmentAnalysis(limitMonths: number = 12): Promise<{
    topPerformers: Stock[];
    worstPerformers: Stock[];
    totalPortfolioValue: number;
    totalInvested: number;
    overallReturn: number;
    overallReturnPercent: number;
  } | null> {
    const reports = await this.monthlyReportsRepository.findWithRelations({
      orderBy: "desc",
      limit: limitMonths,
    });

    if (!reports.length) return null;

    const stockPerformance = formatStockFromReport(reports);

    const sortedByReturn = [...stockPerformance].sort(
      (a, b) => (b.profit || 0) - (a.profit || 0),
    );

    const topPerformers = sortedByReturn.slice(0, 5);
    const worstPerformers = sortedByReturn.slice(-5).reverse();

    const totalPortfolioValue = stockPerformance.reduce(
      (sum, stock) => sum + stock.currentValue,
      0,
    );
    const totalInvested = stockPerformance.reduce(
      (sum, stock) => sum + stock.amountInvested,
      0,
    );

    const overallReturn = totalPortfolioValue - totalInvested;
    const overallReturnPercent =
      totalInvested > 0 ? (overallReturn / totalInvested) * 100 : 0;

    return {
      topPerformers,
      worstPerformers,
      totalPortfolioValue,
      totalInvested,
      overallReturn,
      overallReturnPercent,
    };
  }

  /**
   * Create monthly report with validation
   */
  async createMonthlyReport(
    report: Omit<MonthReportWithId, "id">,
  ): Promise<MonthReportWithId> {
    // Validate report data
    this.validateMonthlyReport(report);

    // Check for duplicates
    const existing = await this.monthlyReportsRepository.findWithRelations({
      startMonth: report.month,
      startYear: report.year,
      endMonth: report.month,
      endYear: report.year,
      limit: 1,
    });

    if (existing.length > 0) {
      throw new Error(
        `Monthly report for ${report.month}/${report.year} already exists`,
      );
    }

    return await this.monthlyReportsRepository.create(report);
  }

  /**
   * Validate monthly report data
   */
  private validateMonthlyReport(report: Omit<MonthReportWithId, "id">): void {
    if (report.month < 1 || report.month > 12) {
      throw new Error("Month must be between 1 and 12");
    }

    if (report.year < 2000 || report.year > 2100) {
      throw new Error("Year must be between 2000 and 2100");
    }

    if (report.cash.some((cash) => cash.amount < 0)) {
      throw new Error("Cash amounts cannot be negative");
    }

    if (
      report.investments.some(
        (inv) => inv.currentValue < 0 || inv.amountInvested < 0,
      )
    ) {
      throw new Error("Investment amounts cannot be negative");
    }

    if (report.movements.some((mov) => mov.amount < 0)) {
      throw new Error("Movement amounts cannot be negative");
    }
  }
}
