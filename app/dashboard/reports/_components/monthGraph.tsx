"use client";

import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { redirect } from "next/navigation";
import { CartesianGrid, XAxis, Bar, BarChart } from "recharts";

const chartConfig = {
  desktop: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

interface MonthGraphProps {
  monthReport: {
    month: string;
    income: number;
    expense: number;
  }[];
}
export function MonthGraph({ monthReport }: MonthGraphProps) {
  return (
    <div>
      <ChartContainer config={chartConfig} className="w-full h-40">
        <BarChart
          onClick={(e) => {
            redirect(`/dashboard/reports/2025/${e.activeLabel}`);
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
