"use client"

import { useMemo } from 'react'
import { MonthReportWithId, Stock } from '@/types/database'
import { formatStockFromReport, getTotalChart } from '@/lib/utils'

export const useTransformedData = (reports: MonthReportWithId[]) => {
  const transformedStocks = useMemo(() => {
    return formatStockFromReport(reports)
  }, [reports])

  const chartData = useMemo(() => {
    return getTotalChart(reports)
  }, [reports])

  return {
    stocks: transformedStocks,
    chartData,
  }
}

export const useFinancialCalculations = (currentMonth: MonthReportWithId | undefined, lastMonth: MonthReportWithId | undefined, stocks: Stock[]) => {
  const calculations = useMemo(() => {
    if (!currentMonth) {
      return {
        currentMonthIncome: 0,
        currentMonthExpenses: 0,
        lastMonthIncome: 0,
        lastMonthExpenses: 0,
        lastMonthSavingsRate: '0',
        currentMonthSavingsRate: '0',
        previousMonthWealth: 0,
        totalWealth: 0,
        totalDiff: 0,
        gains: 0,
        cash: 0,
        prevCash: 0,
      }
    }

    const currentMonthIncome = currentMonth.movements
      .filter(m => m.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0)
    
    const currentMonthExpenses = currentMonth.movements
      .filter(m => m.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0)

    const lastMonthIncome = lastMonth?.movements
      ?.filter(m => m.type === 'income')
      .reduce((acc, curr) => acc + curr.amount, 0) || 0
    
    const lastMonthExpenses = lastMonth?.movements
      ?.filter(m => m.type === 'expense')
      .reduce((acc, curr) => acc + curr.amount, 0) || 0

    const lastMonthSavingsRate =
      lastMonthIncome === 0
        ? '0'
        : (((lastMonthIncome - lastMonthExpenses) / lastMonthIncome) * 100).toFixed(2)

    const currentMonthSavingsRate =
      currentMonthIncome === 0
        ? '0'
        : (((currentMonthIncome - currentMonthExpenses) / currentMonthIncome) * 100).toFixed(2)

    const previousMonthWealth = lastMonth ? (
      lastMonth.cash.reduce((acc, curr) => acc + curr.amount, 0) +
      lastMonth.investments.reduce((acc, curr) => acc + curr.currentValue, 0)
    ) : 0

    const totalWealth = (
      currentMonth.cash.reduce((acc, curr) => acc + curr.amount, 0) +
      currentMonth.investments.reduce((acc, curr) => acc + curr.currentValue, 0)
    )

    const totalDiff = stocks.reduce(
      (prev, curr) => prev + (curr.difference || 0),
      0,
    )

    const gains = currentMonthIncome + totalDiff
    const cash = currentMonth.cash.reduce((acc, curr) => acc + curr.amount, 0)
    const prevCash = lastMonth?.cash.reduce((acc, curr) => acc + curr.amount, 0) || 0

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
    }
  }, [currentMonth, lastMonth, stocks])

  return calculations
}