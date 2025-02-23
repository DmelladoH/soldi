import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Euro } from "lucide-react";

interface FinanceCardProps {
  totalAmount: number;
}

export default function FinanceCard({ totalAmount }: FinanceCardProps) {
  return (
    <Card className="w-full mx-auto">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
        <Euro className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">
          {totalAmount.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
        </div>
        <p className="text-xs text-muted-foreground">Across all accounts</p>
      </CardContent>
    </Card>
  );
}
