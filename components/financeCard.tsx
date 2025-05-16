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
      className={cn("p-6 rounded-lg shadow-sm border flex-grow", className)}
    >
      <div className="flex items-center">
        <div className="p-2 rounded-md bg-slate-300">{icon}</div>
        <div className="ml-4">
          <h3 className="text-sm font-medium ">{title}</h3>
          <div className="flex items-baseline">
            <p className="text-2xl font-semibold">{value}</p>
            {change && (
              <p
                className={cn(
                  "ml-2 text-sm font-medium",
                  change.positive
                    ? "text-finance-light-green"
                    : "text-finance-red"
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
