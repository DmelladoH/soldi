"use client";

import { CartesianGrid, Line, LineChart, XAxis } from "recharts";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  desktop: {
    label: "Amount",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function TotalChart({
  chartData,
  title,
}: {
  chartData: { month: string; amount: number }[];
  title: string;
}) {
  return (
    <Card className="grid flex-grow">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        {chartData.length === 0 ? (
          <div className="flex flex-1 justify-center items-center">
            <p className="text-sm">No Data</p>
          </div>
        ) : (
          <ChartContainer config={chartConfig}>
            <LineChart
              accessibilityLayer
              data={chartData}
              margin={{
                left: 12,
                right: 12,
              }}
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
                content={<ChartTooltipContent hideLabel />}
              />
              <Line
                dataKey="amount"
                type="linear"
                stroke="var(--color-desktop)"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
}
