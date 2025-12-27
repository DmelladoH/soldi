import { Stock } from "@/lib/types";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";
import { formatCurrency } from "@/lib/utils";

export function FundTable({ stocks }: { stocks: Stock[] }) {
  const getTextColor = (value: number | null | undefined) => {
    if (!value || value === 0) return "";
    if (value >= 0) return "text-green-600";
    return "text-red-600";
  };

  const totalCurrentValue = stocks.reduce(
    (prev, curr) => prev + curr.currentValue,
    0
  );

  const totalInvested = stocks.reduce(
    (prev, curr) => prev + curr.amountInvested,
    0
  );

  const totalDiff = stocks.reduce(
    (prev, curr) => prev + (curr.difference || 0),
    0
  );

  const totalProfitRate =
    totalInvested === 0
      ? 0
      : ((totalCurrentValue - (totalCurrentValue - totalDiff)) / totalInvested) * 100;

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
          <TableRow>
            <TableCell className="min-w-[120px]"></TableCell>
            <TableCell className={`min-w-[100px] text-right `}>
              {formatCurrency(totalCurrentValue)}
            </TableCell>
            <TableCell
              className={`min-w-[100px] text-right ${getTextColor(
                totalInvested
              )}`}
            >
              {formatCurrency(totalInvested)}
            </TableCell>
            <TableCell
              className={`min-w-[100px] text-right ${getTextColor(totalDiff)}`}
            >
              {formatCurrency(totalDiff)}
            </TableCell>
            <TableCell
              className={`min-w-[100px] text-right ${getTextColor(
                totalProfitRate
              )}`}
            >
              {totalProfitRate >= 0 ? "+" : ""}
              {totalProfitRate.toFixed(2)}%
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}
