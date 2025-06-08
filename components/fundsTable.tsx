import { FundEntityWithId } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { formatCurrency } from "@/lib/utils";

export interface Stocks {
  fund: FundEntityWithId;
  currentValue: number;
  amountInvested: number;
  difference: number | undefined;
  profit: number | null;
  currency: string;
}

export function FundTable({ stocks }: { stocks: Stocks[] }) {
  const getTextColor = (value: number | null | undefined) => {
    if (!value || value === 0) return "";
    if (value >= 0) return "text-green-600";
    return "text-red-600";
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fund</TableHead>
          <TableHead>Current Value</TableHead>
          <TableHead className="text-right">Invested</TableHead>
          <TableHead className="text-right">Difference</TableHead>
          <TableHead className="text-right">Profit</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {stocks.map((stock) => (
          <TableRow key={stock.fund.id}>
            <TableCell>
              <div>{stock.fund.name}</div>
            </TableCell>
            <TableCell className="text-right">
              {formatCurrency(stock.currentValue)}
            </TableCell>
            <TableCell
              className={`text-right ${getTextColor(stock.amountInvested)}`}
            >
              {formatCurrency(stock.amountInvested)}
            </TableCell>
            <TableCell
              className={`text-right ${getTextColor(stock.difference)}`}
            >
              {formatCurrency(stock.difference || 0)}
            </TableCell>
            <TableCell className={`text-right ${getTextColor(stock.profit)}`}>
              {stock.profit && stock.profit >= 0 ? "+" : ""}
              {stock.profit?.toFixed(2)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
