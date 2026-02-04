"use client";

import React, { memo, useMemo } from "react";
import { Stock } from "@/types/database/queries";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { formatCurrency } from "@/lib/utils";

interface FundTableProps {
  stocks: Stock[];
}

export const FundTable = memo<FundTableProps>(({ stocks }) => {
  const sortedStocks = useMemo(() => {
    return [...stocks].sort((a, b) => b.currentValue - a.currentValue);
  }, [stocks]);

  const tableData = useMemo(() => {
    const totalCurrentValue = sortedStocks.reduce(
      (prev, curr) =>
        prev + (curr.closed ? curr.closingAmount || 0 : curr.currentValue),
      0,
    );

    const totalInvested = stocks.reduce(
      (prev, curr) => prev + curr.amountInvested,
      0,
    );

    const totalDiff = sortedStocks.reduce(
      (prev, curr) => prev + (curr.difference || 0),
      0,
    );

    const totalProfitRate =
      totalInvested === 0
        ? 0
        : ((totalCurrentValue - (totalCurrentValue - totalDiff)) /
            totalInvested) *
          100;

    return {
      totalCurrentValue,
      totalInvested,
      totalDiff,
      totalProfitRate,
    };
  }, [sortedStocks, stocks]);

  const getTextColor = useMemo(
    () => (value: number | null | undefined) => {
      if (!value || value === 0) return "";
      if (value >= 0) return "text-green-600";
      return "text-red-600";
    },
    [],
  );

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Fund</TableHead>
            <TableHead className="min-w-[120px] text-right">
              Current Value
            </TableHead>
            <TableHead className="min-w-[100px] text-right">Invested</TableHead>
            <TableHead className="min-w-[100px] text-right">
              Difference
            </TableHead>
            <TableHead className="min-w-[80px] text-right">Profit</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedStocks.map((stock) => (
            <TableRow
              key={stock.fund.id}
              className={stock.closed ? "bg-gray-100 opacity-75" : ""}
            >
              <TableCell className="min-w-[120px]">
                <div className="font-medium">{stock.fund.name}</div>
              </TableCell>

              <TableCell className="min-w-[120px] text-right">
                {formatCurrency(
                  stock.closed ? stock.closingAmount || 0 : stock.currentValue,
                )}
              </TableCell>
              <TableCell
                className={`min-w-[100px] text-right ${getTextColor(
                  stock.amountInvested,
                )}`}
              >
                {formatCurrency(stock.amountInvested)}
              </TableCell>

              <TableCell
                className={`min-w-[100px] text-right ${getTextColor(
                  stock.difference,
                )}`}
              >
                {formatCurrency(stock.difference || 0)}
              </TableCell>
              <TableCell
                className={`min-w-[80px] text-right ${getTextColor(
                  stock.profit,
                )}`}
              >
                {stock.profit && stock.profit >= 0 ? "+" : ""}
                {stock.profit?.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="min-w-[120px]"></TableCell>
            <TableCell className={`min-w-[100px] text-right `}>
              {formatCurrency(tableData.totalCurrentValue)}
            </TableCell>
            <TableCell
              className={`min-w-[100px] text-right ${getTextColor(
                tableData.totalInvested,
              )}`}
            >
              {formatCurrency(tableData.totalInvested)}
            </TableCell>
            <TableCell
              className={`min-w-[100px] text-right ${getTextColor(tableData.totalDiff)}`}
            >
              {formatCurrency(tableData.totalDiff)}
            </TableCell>
            <TableCell
              className={`min-w-[100px] text-right ${getTextColor(
                tableData.totalProfitRate,
              )}`}
            >
              {tableData.totalProfitRate >= 0 ? "+" : ""}
              {tableData.totalProfitRate.toFixed(2)}%
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
});

FundTable.displayName = "FundTable";
