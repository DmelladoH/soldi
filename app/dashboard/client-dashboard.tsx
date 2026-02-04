"use client";

import { useMonthlyReports } from "@/hooks/use-monthly-reports";
import {
  useTransformedData,
  useFinancialCalculations,
} from "@/hooks/use-data-transformations";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";
import { formatCurrency, getTotalMoney } from "@/lib/utils";

// Dynamic imports with loading states
const TotalChart = dynamic(
  () =>
    import("./_components/totalChart").then((mod) => ({
      default: mod.TotalChart,
    })),
  {
    loading: () => <Skeleton className="h-[300px] w-full" />,
    ssr: false,
  },
);

const FundTable = dynamic(
  () =>
    import("@/components/fundsTable").then((mod) => ({
      default: mod.FundTable,
    })),
  {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false,
  },
);

const InvestmentGains = dynamic(
  () =>
    import("./_components/investmentGains").then((mod) => ({
      default: mod.InvestmentGains,
    })),
  {
    loading: () => <Skeleton className="h-[100px] w-full" />,
    ssr: false,
  },
);

export function ClientDashboard() {
  const { data: monthlyReport, isLoading, error } = useMonthlyReports();
  const { stocks, chartData } = useTransformedData(monthlyReport || []);

  const currentMonth = monthlyReport?.[monthlyReport.length - 1];

  // Calculate total investment gains over all years
  const totalInvestmentGains = monthlyReport
    ? stocks.reduce((total, stock) => total + (stock.difference || 0), 0)
    : 0;

  if (isLoading) {
    return (
      <div className="grid gap-4 p-3 sm:p-5">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-[100px] w-full" />
        <Skeleton className="h-[200px] w-full" />
      </div>
    );
  }

  if (error || !monthlyReport?.length) {
    return (
      <div className="flex flex-col justify-center items-center flex-nowrap h-screen">
        <p>No Data</p>
      </div>
    );
  }

  const totalWealth = currentMonth ? getTotalMoney(currentMonth) : 0;

  const openStocks = stocks.filter((stock) => !stock.closed);
  const closedStocks = stocks.filter((stock) => stock.closed);

  return (
    <div className="grid gap-4 p-3 sm:p-5">
      <div className="w-full ">
        <TotalChart chartData={chartData} title={formatCurrency(totalWealth)} />
      </div>
      <InvestmentGains gains={totalInvestmentGains} isLoading={isLoading} />
      <div>
        <h3 className="font-semibold leading-none tracking-tight my-5">
          Open Positions
        </h3>
        <FundTable stocks={openStocks} />
      </div>
      {closedStocks.length > 0 && (
        <div>
          <h3 className="font-semibold leading-none tracking-tight my-5">
            Closed Positions
          </h3>
          <FundTable stocks={closedStocks} />
        </div>
      )}
    </div>
  );
}
