"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { redirect } from "next/navigation";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";

const chartConfig = {
  desktop: {
    label: "Amount",
    color: "var(--chart-3)",
  },
} satisfies ChartConfig;

interface MonthGraphProps {
  monthReport: {
    month: string;
    income: number;
    expense: number;
  }[];
  year: string;
}
export function MonthGraph({ monthReport, year }: MonthGraphProps) {
  return (
    <div>
      <ChartContainer config={chartConfig} className="w-full h-40">
        <BarChart
          onClick={(e) => {
            redirect(`/dashboard/reports/${year}/${e.activeLabel}`);
          }}
          accessibilityLayer
          data={monthReport}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip content={<ChartTooltipContent indicator="dashed" />} />
          <Bar dataKey="income" fill="var(--color-desktop)" radius={4} />
          <Bar dataKey="expense" fill="var(--color-mobile)" radius={4} />
        </BarChart>
      </ChartContainer>
    </div>
  );
}
