import { cn } from "@/lib/utils";
import { Card } from "./ui/card";

interface FinanceCardProps {
  title: string;
  value: string;
  change?: {
    value: string;
    positive: boolean;
  };
  icon: React.ReactNode;
  className?: string;
}

export default function FinanceCard({
  title,
  value,
  change,
  icon,
  className,
}: FinanceCardProps) {
  return (
    <Card
      className={cn(
        "p-4 sm:p-6 rounded-lg shadow-sm border flex-grow",
        className
      )}
    >
      <div className="flex items-center">
        <div className="p-2 rounded-md bg-slate-200 flex-shrink-0">{icon}</div>
        <div className="ml-3 sm:ml-4 min-w-0 flex-1">
          <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">
            {title}
          </h3>
          <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-2">
            <p className="text-lg sm:text-2xl font-semibold truncate">
              {value}
            </p>
            {change && (
              <p
                className={cn(
                  "text-xs sm:text-sm font-medium",
                  change.positive ? "text-moneyGreen" : "text-moneyRed"
                )}
              >
                {change.positive ? "+" : ""}
                {change.value}
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
