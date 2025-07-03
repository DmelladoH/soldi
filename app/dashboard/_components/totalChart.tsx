"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

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
    <Card className="flex flex-col h-full">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-3 sm:p-6">
        {chartData.length === 0 ? (
          <div className="flex flex-1 justify-center items-center min-h-[200px] sm:min-h-[300px]">
            <p className="text-sm text-muted-foreground">No Data</p>
          </div>
        ) : (
          <div className="w-full h-full min-h-[200px] sm:min-h-[300px]">
            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={chartData}
                margin={{
                  left: 8,
                  right: 8,
                  top: 8,
                  bottom: 8,
                }}
                width={undefined}
                height={undefined}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" fontSize={12} tick={{ fontSize: 10 }} />
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="amount" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
