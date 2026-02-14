import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

type ExpenseMovementLike = {
  tagId: number;
  tagName?: string;
  amount: number;
  currency: string;
  avgAmount?: number;
};

export function ExpenseMovementsTable({
  movements,
  showAverage,
}: {
  movements: ExpenseMovementLike[];
  showAverage?: boolean;
}) {
  if (movements.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="text-lg font-semibold mb-3">Expenses</h3>
      <Card className="p-2">
        <div className="grid gap-1">
          <div
            className={`hidden md:grid ${
              showAverage
                ? "grid-cols-[1fr_auto_auto_auto]"
                : "grid-cols-[1fr_auto_auto]"
            } gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground`}
          >
            <div>Tag</div>
            <div className="text-right">Amount</div>
            {showAverage && <div className="text-right">Avg</div>}
          </div>
          <div className="grid gap-1">
            {movements.map((m, idx) => (
              <div
                key={`${m.tagId}-${idx}`}
                className={`rounded-md border bg-background px-3 py-2 md:grid ${
                  showAverage
                    ? "md:grid-cols-[1fr_auto_auto_auto]"
                    : "md:grid-cols-[1fr_auto_auto]"
                } md:gap-3`}
              >
                <div className="font-medium truncate">
                  {m.tagName || String(m.tagId)}
                </div>
                <div className="mt-1 md:mt-0 text-right tabular-nums font-semibold">
                  {formatCurrency(m.amount)}
                </div>
                {showAverage && (
                  <div className="mt-1 md:mt-0 text-right tabular-nums font-semibold">
                    {formatCurrency(m.avgAmount ?? 0)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
