import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "./ui/table";

export interface Stocks {
  fund: string;
  currentValue: number;
  amountInvested: number;
  difference: number | undefined;
  profit: number | null;
  currency: string;
}

export function FundTable({ stocks }: { stocks: Stocks[] }) {
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
          <TableRow key={stock.fund}>
            <TableCell>
              <div>{stock.fund}</div>
            </TableCell>
            <TableCell className="text-right">
              {stock.currency}
              {stock.currentValue.toFixed(2)}
            </TableCell>
            <TableCell
              className={`text-right ${
                stock.amountInvested >= 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {stock.currency}
              {stock.amountInvested.toFixed(2)}
            </TableCell>
            <TableCell
              className={`text-right ${
                stock.difference && stock.difference >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stock.currency}
              {stock.difference?.toFixed(2)}
            </TableCell>
            <TableCell
              className={`text-right ${
                stock.profit && stock.profit >= 0
                  ? "text-green-600"
                  : "text-red-600"
              }`}
            >
              {stock.profit && stock.profit >= 0 ? "+" : ""}
              {stock.profit?.toFixed(2)}%
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
