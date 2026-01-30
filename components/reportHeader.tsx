"use client"

import React, { memo, useMemo } from 'react'
import {
  formatCurrency,
  getTotalMoney,
  getTotalMovementByType,
} from "@/lib/utils";
import { Wallet, ArrowDown, TrendingUp, BadgeEuro } from "lucide-react";
import FinanceCard from "./financeCard";
import { MonthReportWithId } from "@/types/database";
import { Stock } from "@/types/database/queries";

interface ReportHeaderProps {
  currentMonth: MonthReportWithId | undefined;
  lastMonth?: MonthReportWithId | undefined;
  stocks: Stock[];
}

export const ReportHeader = memo<ReportHeaderProps>(({ currentMonth, lastMonth, stocks }) => {
  const financialCalculations = useMemo(() => {
    const currentMonthIncome = getTotalMovementByType(
      currentMonth?.movements || [],
      "income",
    );
    const currentMonthExpenses = getTotalMovementByType(
      currentMonth?.movements || [],
      "expense",
    );
    const lastMonthIncome = getTotalMovementByType(
      lastMonth?.movements || [],
      "income",
    );
    const lastMonthExpenses = getTotalMovementByType(
      lastMonth?.movements || [],
      "expense",
    );

    const lastMonthSavingsRate =
      lastMonthIncome === 0
        ? "0"
        : (
            ((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) *
            100
          ).toFixed(2);

    const currentMonthSavingsRate =
      currentMonthIncome === 0
        ? "0"
        : (
            ((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) *
            100
          ).toFixed(2);

    const previousMonthWealth = lastMonth ? getTotalMoney(lastMonth) : 0;
    const totalWealth = currentMonth ? getTotalMoney(currentMonth) : 0;

    const totalDiff = stocks.reduce(
      (prev, curr) => prev + (curr.difference || 0),
      0,
    );

    const gains = currentMonthIncome + totalDiff;
    const cash = currentMonth?.cash.reduce((curr, acc) => curr + acc.amount, 0) || 0;
    const prevCash = lastMonth?.cash.reduce((curr, acc) => curr + acc.amount, 0) || 0;

    return {
      currentMonthIncome,
      currentMonthExpenses,
      lastMonthIncome,
      lastMonthExpenses,
      lastMonthSavingsRate,
      currentMonthSavingsRate,
      previousMonthWealth,
      totalWealth,
      totalDiff,
      gains,
      cash,
      prevCash,
    };
  }, [currentMonth, lastMonth, stocks]);

  return (
    <div className="grid gap-4 auto-rows-auto [grid-template-columns:repeat(auto-fill,minmax(291px,1fr))] [&>div]:col-span-1">
      <div className="flex-grow">
        <FinanceCard
          title="Net Worth"
          value={formatCurrency(financialCalculations.totalWealth)}
          change={
            lastMonth
              ? {
                  value: formatCurrency(financialCalculations.totalWealth - financialCalculations.previousMonthWealth),
                  positive: financialCalculations.totalWealth > financialCalculations.previousMonthWealth,
                }
              : undefined
          }
          icon={<Wallet className="h-5 w-5 text-finance-blue" />}
        />
      </div>
      <div className="flex-grow">
        <FinanceCard
          title="Cash"
          change={
            lastMonth
              ? {
                  value: formatCurrency(financialCalculations.cash - financialCalculations.prevCash),
                  positive: financialCalculations.cash > financialCalculations.prevCash,
                }
              : undefined
          }
          value={formatCurrency(financialCalculations.cash)}
          icon={<BadgeEuro className="h-5 w-5" />}
        />
      </div>
      <div className="flex-grow">
        <FinanceCard
          title="Monthly Income"
          change={
            lastMonth
              ? {
                  value: formatCurrency(financialCalculations.currentMonthIncome - financialCalculations.lastMonthIncome),
                  positive: financialCalculations.currentMonthIncome > financialCalculations.lastMonthIncome,
                }
              : undefined
          }
          value={formatCurrency(financialCalculations.currentMonthIncome)}
          icon={<ArrowDown className="h-5 w-5 text-moneyRed" />}
        />
      </div>
      <div className="flex-grow">
        <FinanceCard
          title="Monthly Expenses"
          change={
            lastMonth
              ? {
                  value: formatCurrency(
                    financialCalculations.currentMonthExpenses - financialCalculations.lastMonthExpenses,
                  ),
                  positive: financialCalculations.currentMonthExpenses > financialCalculations.lastMonthExpenses,
                }
              : undefined
          }
          value={formatCurrency(financialCalculations.currentMonthExpenses)}
          icon={<ArrowDown className="h-5 w-5 text-moneyRed" />}
        />
      </div>
      <div className="flex-grow">
        <FinanceCard
          title="Saving Rate"
          value={`${financialCalculations.currentMonthSavingsRate}%`}
          change={
            lastMonth
              ? {
                  value: `${(
                    Number(financialCalculations.currentMonthSavingsRate) -
                    Number(financialCalculations.lastMonthSavingsRate)
                  ).toFixed(2)}%`,
                  positive:
                    Number(financialCalculations.currentMonthSavingsRate) >
                    Number(financialCalculations.lastMonthSavingsRate),
                }
              : undefined
          }
          icon={<TrendingUp className="h-5 w-5 text-yellow-600" />}
        />
      </div>
    </div>
  );
})

ReportHeader.displayName = 'ReportHeader'