import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

type BankAccount = {
  name: string;
  balance: number;
};

type Investment = {
  fundName: string;
  currentValue: number;
  amountInvested: number;
  difference: number;
  percentageChange: number;
};

type FinanceSummaryProps = {
  month: string;
  year: number;
  totalAmount: number;
  regularIncome: number;
  additionalIncomes: { source: string; amount: number }[];
  bankAccounts: BankAccount[];
  investments: Investment[];
};

export default function FinanceSummaryCard({
  month,
  year,
  totalAmount,
  regularIncome,
  additionalIncomes,
  bankAccounts,
  investments,
}: FinanceSummaryProps) {
  const totalIncome =
    regularIncome +
    additionalIncomes.reduce((sum, income) => sum + income.amount, 0);

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-center">
          Financial Summary - {month} {year}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="text-center">
          <p className="text-3xl font-bold text-primary">
            ${totalAmount.toLocaleString()}
          </p>
          <p className="text-sm text-muted-foreground">Total Amount</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Income</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="font-semibold">
                Regular: ${regularIncome.toLocaleString()}
              </p>
              {additionalIncomes.map((income, index) => (
                <p key={index}>
                  {income.source}: ${income.amount.toLocaleString()}
                </p>
              ))}
              <p className="mt-2 font-bold">
                Total: ${totalIncome.toLocaleString()}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Bank Accounts</CardTitle>
            </CardHeader>
            <CardContent>
              {bankAccounts.map((account, index) => (
                <p key={index}>
                  {account.name}: ${account.balance.toLocaleString()}
                </p>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fund Name</TableHead>
                  <TableHead className="text-right">Current Value</TableHead>
                  <TableHead className="text-right">Amount Invested</TableHead>
                  <TableHead className="text-right">Difference</TableHead>
                  <TableHead className="text-right">Change</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {investments.map((investment, index) => (
                  <TableRow key={index}>
                    <TableCell>{investment.fundName}</TableCell>
                    <TableCell className="text-right">
                      ${investment.currentValue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      ${investment.amountInvested.toLocaleString()}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        investment.difference >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      ${Math.abs(investment.difference).toLocaleString()}
                      {investment.difference >= 0 ? "↑" : "↓"}
                    </TableCell>
                    <TableCell
                      className={`text-right ${
                        investment.percentageChange >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      }`}
                    >
                      {investment.percentageChange.toFixed(2)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </CardContent>
    </Card>
  );
}
