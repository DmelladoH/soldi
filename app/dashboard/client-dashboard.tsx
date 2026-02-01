"use client";

import { useMonthlyReports } from "@/hooks/use-monthly-reports";
import { useTransformedData } from "@/hooks/use-data-transformations";
import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

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

const ReportHeader = dynamic(
  () =>
    import("@/components/reportHeader").then((mod) => ({
      default: mod.ReportHeader,
    })),
  {
    loading: () => <Skeleton className="h-[200px] w-full" />,
    ssr: false,
  },
);

export function ClientDashboard() {
  const { data: monthlyReport, isLoading, error } = useMonthlyReports();
  const { stocks, chartData } = useTransformedData(monthlyReport || []);

  console.log({ stocks });
  if (isLoading) {
    return (
      <div className="grid gap-4 p-3 sm:p-5">
        <Skeleton className="h-[200px] w-full" />
        <Skeleton className="h-[300px] w-full" />
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

  const currentMonth = monthlyReport[monthlyReport.length - 1];
  const lastMonth = monthlyReport[monthlyReport.length - 2];

  return (
    <div className="grid gap-4 p-3 sm:p-5">
      <ReportHeader
        currentMonth={currentMonth}
        lastMonth={lastMonth}
        stocks={stocks}
      />
      <div className="w-full ">
        <TotalChart chartData={chartData} title="Total Money" />
      </div>
      <div>
        <h3 className="font-semibold leading-none tracking-tight my-5">
          Investments
        </h3>
        <FundTable stocks={stocks} />
      </div>
    </div>
  );
}
