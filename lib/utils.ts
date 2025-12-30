import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import {
  Cash,
  Investments,
  MonthlyReport,
  MonthReportWithId,
  Movement,
  movementType,
} from "./types";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getTotalCash(cash: Cash[]) {
  return cash.reduce((acc, curr) => acc + curr.amount, 0);
}

export function getTotalInvestments(inv: Investments[]) {
  return inv.reduce((acc, curr) => acc + curr.currentValue, 0);
}

export function getTotalMoney(resume: MonthReportWithId) {
  if (resume == null) return 0;
  return getTotalCash(resume.cash) + getTotalInvestments(resume.investments);
}

export const geStockDifference = (
  currStock: Investments | undefined,
  prevStock: Investments | undefined
) => {
  if (!currStock) return 0;
  const prevValue = prevStock?.currentValue || 0;
  return currStock.currentValue - currStock.amountInvested - prevValue;
};

export const getInvestmentChart = (
  report: MonthReportWithId[]
): { month: string; amount: number }[] => {
  return report.map((report) => ({
    month: new Date(report.year, report.month, 1).toLocaleDateString("en-GB", {
      month: "long",
      timeZone: "UTC",
    }),
    amount: getTotalInvestments(report.investments),
  }));
};

export const getTotalChart = (
  report: MonthReportWithId[]
): { month: string; total: number; invested: number }[] => {
  return report.map((report) => ({
    month: new Date(report.year, report.month, 1).toLocaleDateString("en-GB", {
      month: "long",
      timeZone: "UTC",
    }),
    total: getTotalMoney(report),
    invested: getTotalInvestments(report.investments),
  }));
};

export const getBankAccounts = (lastMonth: MonthReportWithId): Cash[] => {
  return lastMonth.cash.map((account) => ({
    name: account.name,
    amount: account.amount,
    currency: account.currency,
  }));
};

export const getStockProfit = (
  currStock: Investments | undefined,
  prevStock: Investments | undefined
) => {
  if (!currStock || !prevStock) return 0;

  const prevValue = prevStock?.currentValue ?? 0;
  // Prevent division by zero
  if (prevValue === 0) return 0;

  const diff =
    currStock.currentValue - currStock.amountInvested - prevStock.currentValue;
  return (
    ((currStock.currentValue - (currStock.currentValue - diff)) /
      currStock.amountInvested) *
    100
  );
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat("es-ES", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
};

// Gets the total of a movement type for a given movement array
export const getTotalMovementByType = (
  reportList: Movement[],
  type: movementType
) => {
  return reportList?.length
    ? reportList
        .filter((movement) => movement.type === type)
        .reduce((acc, curr) => acc + curr.amount, 0)
    : 0;
};

export const formatStock = (
  currentInvestments: Investments[],
  prevInvestments: Investments[]
) => {
  return currentInvestments.length
    ? currentInvestments.map((stock) => ({
        fund: stock.fund,
        currentValue: stock.currentValue,
        amountInvested: stock.amountInvested,
        difference: geStockDifference(
          stock,
          prevInvestments.find((f) => f.fund.id === stock.fund.id)
        ),
        profit: getStockProfit(
          stock,
          prevInvestments.find((f) => f.fund.id === stock.fund.id)
        ),
        currency: stock.currency,
      }))
    : [];
};

export const formatStockFromReport = (reports: MonthlyReport[]) => {
  if (!reports.length) return [];

  // Ensure chronological order
  const sortedReports = [...reports].sort((a, b) =>
    a.year !== b.year ? a.year - b.year : a.month - b.month
  );

  const fundMap = new Map<
    number,
    {
      fund: Investments["fund"];
      currency: string;
      totalInvested: number;
      value: number;
      acc: number;
    }
  >();

  for (const report of sortedReports) {
    for (const inv of report.investments) {
      const existing = fundMap.get(inv.fund.id);

      if (!existing) {
        fundMap.set(inv.fund.id, {
          fund: inv.fund,
          currency: inv.currency,
          totalInvested: inv.amountInvested,
          value: inv.currentValue,
          acc: 0,
        });
      } else {
        existing.totalInvested += inv.amountInvested;
        existing.acc += inv.currentValue - existing.value;
        existing.value = inv.currentValue;
      }
    }
  }

  return Array.from(fundMap.values()).map((f) => {
    const profit =
      f.totalInvested === 0
        ? 0
        : ((f.value - f.totalInvested) / f.totalInvested) * 100;

    return {
      fund: f.fund,
      currentValue: f.value,
      amountInvested: f.totalInvested,
      difference: f.value - f.totalInvested,
      profit, // 0 = sin beneficio, 100 = duplicas, 200 = triplicas
      currency: f.currency,
    };
  });
};

/**
 * Utility functions for calculating investment gains from monthly financial reports
 */

/**
 * Calculates the gain/loss for a specific fund in a given month
 *
 * @param {Object} currentMonthFund - The fund data from the current month
 * @param {number} currentMonthFund.currentValue - Current value of the fund
 * @param {number} currentMonthFund.amountInvested - Amount invested/withdrawn this month (negative = withdrawal)
 * @param {Object} currentMonthFund.fund - Fund details (id, ISIN, name, etc.)
 * @param {Object|null} previousMonthFund - The fund data from the previous month (null if not found)
 * @param {number} previousMonthFund.currentValue - Previous month's value of the fund
 *
 * @returns {Object} - Gain calculation result
 * @returns {number} return.gain - The calculated gain/loss for this month
 * @returns {number} return.currentValue - Current value of the fund
 * @returns {number} return.previousValue - Previous month's value (0 if new fund)
 * @returns {number} return.amountInvested - Amount invested this month
 * @returns {Object} return.fund - Fund details
 */
export function calculateFundGain(currentMonthFund, previousMonthFund) {
  const { currentValue, amountInvested, fund } = currentMonthFund;

  if (!previousMonthFund) {
    // Fund is new (first appearance or not in previous month)
    // Gain = currentValue - amountInvested
    const gain = currentValue - amountInvested;

    return {
      gain: gain,
      currentValue,
      previousValue: 0,
      amountInvested,
      fund,
    };
  }

  // Fund exists in previous month
  // Gain = currentValue - (previousValue + amountInvested)
  const previousValue = previousMonthFund.currentValue;
  const gain = currentValue - (previousValue + amountInvested);

  return {
    gain,
    currentValue,
    previousValue,
    amountInvested,
    fund,
  };
}

/**
 * Calculates gains for all investments in a given month
 *
 * @param {Object} currentMonth - Current month's financial data
 * @param {Array<Object>} currentMonth.investments - Array of investment funds
 * @param {Object|null} previousMonth - Previous month's financial data (null for first month)
 * @param {Array<Object>} previousMonth.investments - Array of investment funds from previous month
 *
 * @returns {Object} - Gains calculation result
 * @returns {Array<Object>} return.fundGains - Array of gain objects per fund
 * @returns {number} return.totalGain - Sum of all gains for the month
 * @returns {Array<Object>} return.soldFunds - Funds that existed in previous month but not current (were sold)
 */
export function calculateMonthlyInvestmentGains(
  currentMonth,
  previousMonth = null
) {
  const currentInvestments = currentMonth.investments || [];
  const previousInvestments = previousMonth?.investments || [];

  // Calculate gains for each fund in current month
  const fundGains = currentInvestments.map((currentFund) => {
    // Find matching fund in previous month by fund ID
    const previousFund = previousInvestments.find(
      (prevFund) => prevFund.fund.id === currentFund.fund.id
    );

    return calculateFundGain(currentFund, previousFund);
  });

  // Find funds that were sold (existed in previous month but not in current)
  const soldFunds = previousInvestments
    .filter((prevFund) => {
      const stillExists = currentInvestments.some(
        (currFund) => currFund.fund.id === prevFund.fund.id
      );
      return !stillExists;
    })
    .map((soldFund) => ({
      fund: soldFund.fund,
      finalValue: soldFund.currentValue,
      wasSold: true,
    }));

  // Calculate total gain for the month
  const totalGain = fundGains.reduce((sum, fundGain) => sum + fundGain.gain, 0);

  return {
    month: currentMonth.month,
    year: currentMonth.year,
    fundGains,
    totalGain,
    soldFunds,
  };
}

/**
 * Calculates investment gains for all months in the dataset
 *
 * @param {Array<Object>} monthlyReports - Array of monthly financial reports (sorted chronologically)
 *
 * @returns {Array<Object>} - Array of monthly gain calculations
 */
export function calculateAllMonthlyGains(monthlyReports) {
  if (!Array.isArray(monthlyReports) || monthlyReports.length === 0) {
    return [];
  }

  // Sort by year and month to ensure chronological order
  const sortedReports = [...monthlyReports].sort((a, b) => {
    if (a.year !== b.year) return a.year - b.year;
    return a.month - b.month;
  });

  return sortedReports.map((currentMonth, index) => {
    const previousMonth = index > 0 ? sortedReports[index - 1] : null;
    return calculateMonthlyInvestmentGains(currentMonth, previousMonth);
  });
}
