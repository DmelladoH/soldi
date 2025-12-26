"use client";

import { Area, AreaChart, CartesianGrid, XAxis, ResponsiveContainer } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  total: {
    label: "total",
    color: "var(--chart-1)",
  },
  invested: {
    label: "invested",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig
export function TotalChart({
  chartData,
  title,
}: {
  chartData: { month: string; total: number; invested: number }[];
  title: string;
}) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="h-[300px]">
      <ChartContainer config={chartConfig} className="h-full w-full">
  <ResponsiveContainer width="100%" height="100%">
    <AreaChart
      accessibilityLayer
      data={chartData}
      margin={{ left: 12, right: 12 }}
    >
      <CartesianGrid vertical={false} />
      <XAxis
        dataKey="month"
        tickLine={false}
        axisLine={false}
        tickMargin={8}
        tickFormatter={(value) => value.slice(0, 3)}
      />
      <ChartTooltip
        cursor={false}
        content={<ChartTooltipContent indicator="line" />}
      />
      <Area
        dataKey="total"
        type="natural"
        fill="var(--color-total)"
        fillOpacity={0.4}
        stroke="var(--color-total)"
      />
      <Area
        dataKey="invested"
        type="natural"
        fill="var(--color-invested)"
        fillOpacity={0.4}
        stroke="var(--color-invested)"
      />
      <ChartLegend content={<ChartLegendContent />} />
    </AreaChart>
  </ResponsiveContainer>
</ChartContainer>
      </CardContent>
    </Card>
  );
}


