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
          {stocks.map((stock) => (
            <TableRow key={stock.fund.id}>
              <TableCell className="min-w-[120px]">
                <div className="font-medium">{stock.fund.name}</div>
              </TableCell>
              <TableCell className="min-w-[120px] text-right">
                {formatCurrency(stock.currentValue)}
              </TableCell>
              <TableCell
                className={`min-w-[100px] text-right ${getTextColor(
                  stock.amountInvested
                )}`}
              >
                {formatCurrency(stock.amountInvested)}
              </TableCell>
              <TableCell
                className={`min-w-[100px] text-right ${getTextColor(
                  stock.difference
                )}`}
              >
                {formatCurrency(stock.difference || 0)}
              </TableCell>
              <TableCell
                className={`min-w-[80px] text-right ${getTextColor(
                  stock.profit
                )}`}
              >
                {stock.profit && stock.profit >= 0 ? "+" : ""}
                {stock.profit?.toFixed(2)}%
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
