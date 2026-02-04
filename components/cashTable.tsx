"use client";

import React, { memo, useMemo } from "react";
import { Cash } from "@/types/database/entities";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { formatCurrency } from "@/lib/utils";

interface CashTableProps {
  cash: Cash[];
}

export const CashTable = memo<CashTableProps>(({ cash }) => {
  const tableData = useMemo(() => {
    const totalAmount = cash.reduce((prev, curr) => prev + curr.amount, 0);
    return { totalAmount };
  }, [cash]);

  return (
    <div className="w-full overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="min-w-[120px]">Account</TableHead>
            <TableHead className="min-w-[120px] text-right">Amount</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cash.map((item) => (
            <TableRow key={item.name}>
              <TableCell className="min-w-[120px]">
                <div className="font-medium">{item.name}</div>
              </TableCell>
              <TableCell className="min-w-[120px] text-right">
                {formatCurrency(item.amount)}
              </TableCell>
            </TableRow>
          ))}
          <TableRow>
            <TableCell className="font-medium">Total</TableCell>
            <TableCell className="min-w-[120px] text-right font-medium">
              {formatCurrency(tableData.totalAmount)}
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
});

CashTable.displayName = "CashTable";
