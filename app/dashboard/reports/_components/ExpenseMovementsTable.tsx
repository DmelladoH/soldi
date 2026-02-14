import type { Movement } from "@/types";
import { Card } from "@/components/ui/card";

export function ExpenseMovementsTable({
  movements,
}: {
  movements: Movement[];
}) {
  if (movements.length === 0) return null;

  return (
    <div className="mt-5">
      <h3 className="text-lg font-semibold mb-3">Expenses</h3>
      <Card className="p-2">
        <div className="grid gap-1">
          <div className="hidden md:grid grid-cols-[1fr_auto_auto] gap-3 px-3 py-2 text-xs font-semibold text-muted-foreground">
            <div>Tag</div>
            <div className="text-right">Amount</div>
            <div>Currency</div>
          </div>
          <div className="grid gap-1">
            {movements.map((m, idx) => (
              <div
                key={`${m.tagId}-${idx}`}
                className="rounded-md border bg-background px-3 py-2 md:grid md:grid-cols-[1fr_auto_auto] md:gap-3"
              >
                <div className="font-medium truncate">
                  {m.tagName || String(m.tagId)}
                </div>
                <div className="mt-1 md:mt-0 text-right tabular-nums font-semibold">
                  {m.amount.toFixed(2)}
                </div>
                <div className="mt-1 md:mt-0 text-sm text-muted-foreground">
                  {m.currency}
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
}
