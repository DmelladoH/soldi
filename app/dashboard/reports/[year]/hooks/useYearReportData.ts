"use client";

import { useMemo } from "react";
import { MonthReportWithId } from "@/types/database";
import {
  FinancialCalculator,
  MetricsCalculator,
  ReportDataProcessor,
} from "../utils/FinancialCalculator";
import type { ReportInfo, ProcessedYearData } from "../types";

export interface YearReportData {
  currentYearData: MonthReportWithId[];
  prevYearData: MonthReportWithId[];
  currentYearExpense: number;
  prevYearExpense: number;
  currentYearReport: ReportInfo;
  prevYearReport: ReportInfo;
  currentYearInvestmentData: ProcessedYearData;
  prevYearInvestmentData: ProcessedYearData;
  financialMetrics: FinancialMetrics;
}

export interface FinancialMetrics {
  totalInInvestments: number;
  percentageGainsThisYear: number;
  percentageGainsTotal: number;
  savingsRate: number;
  avgMonthlySavings: number;
  avgMonthlyInvested: number;
  investmentGainsDiff: number;
}

export const useYearReportData = () => {
  return useMemo(() => {
    // This would normally fetch from API, but for now we'll use the server component pattern
    // The actual data fetching will happen in the server component
    return null;
  }, []);
};

export const useFinancialMetrics = (
  currentYearData: MonthReportWithId[],
  prevYearData: MonthReportWithId[],
  currentYearReport: ReportInfo,
): FinancialMetrics => {
  return useMemo(() => {
    if (!currentYearData.length) {
      return {
        totalInInvestments: 0,
        percentageGainsThisYear: 0,
        percentageGainsTotal: 0,
        savingsRate: 0,
        avgMonthlySavings: 0,
        avgMonthlyInvested: 0,
        investmentGainsDiff: 0,
      };
    }

    const currentYearInvestmentData =
      ReportDataProcessor.processYearDataForComparison(
        currentYearData,
        FinancialCalculator,
      );

    const prevYearInvestmentData =
      ReportDataProcessor.processYearDataForComparison(
        prevYearData,
        FinancialCalculator,
      );

    const totalInInvestments = currentYearInvestmentData.totalInInvestments;

    const { percentageGainsThisYear, percentageGainsTotal } =
      MetricsCalculator.calculatePercentageGains(
        totalInInvestments,
        currentYearInvestmentData.totalInvestmentGains,
        currentYearReport.totalInvested,
      );

    const savingsRate = MetricsCalculator.calculateSavingsRate(
      currentYearReport.totalNetSalary,
      currentYearInvestmentData.totalExpense,
    );

    const { avgMonthlySavings, avgMonthlyInvested } =
      MetricsCalculator.calculateMonthlyAverages(currentYearData);

    const investmentGainsDiff =
      currentYearInvestmentData.totalInvestmentGains -
      prevYearInvestmentData.totalInvestmentGains;

    return {
      totalInInvestments,
      percentageGainsThisYear,
      percentageGainsTotal,
      savingsRate,
      avgMonthlySavings,
      avgMonthlyInvested,
      investmentGainsDiff,
    };
  }, [currentYearData, prevYearData, currentYearReport]);
};

export const useYearReportCalculations = (yearData: MonthReportWithId[]) => {
  return useMemo(() => {
    if (!yearData.length) {
      return {
        totalExpense: 0,
        investmentGains: 0,
        formattedData: [],
        totalInvestmentGains: 0,
      };
    }

    const processedData = FinancialCalculator.processInvestmentGains(yearData);

    return {
      totalExpense: yearData
        .slice(1)
        .map((e) => e.movements)
        .flat()
        .filter((e) => e.type === "expense")
        .reduce((acc, curr) => acc + curr.amount, 0),
      investmentGains: 0,
      formattedData: processedData,
      totalInvestmentGains: processedData.reduce(
        (acc, curr) => acc + curr.value,
        0,
      ),
    };
  }, [yearData]);
};
