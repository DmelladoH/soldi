"use client"
import { Bar, BarChart, CartesianGrid, Cell, LabelList } from "recharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

export const description = "A bar chart with negative values"


interface RangeData {
  month: string;
  value: number;
}

export function InvestmentSummary({rangeData}: {rangeData: RangeData[] } ) {
    return (
        <Card>
            <CardHeader>
                <CardTitle>Bar Chart - Negative</CardTitle>
            </CardHeader>
            <CardContent>
            <ChartContainer config={chartConfig}>
                <BarChart accessibilityLayer data={rangeData}>
                <CartesianGrid vertical={false} />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel hideIndicator />}
                />
                <Bar dataKey="value">
                    <LabelList position="top" dataKey="month" fillOpacity={1} />
                    {rangeData.map((item: RangeData) => (
                    <Cell
                        key={item.month}
                        fill={item.value > 0 ? "var(--chart-1)" : "var(--chart-2)"}
                    />
                    ))}
                </Bar>
                </BarChart>
            </ChartContainer>
            </CardContent>
        </Card>
    )
}

const chartConfig = {
  visitors: {
    label: "value",
  },
} satisfies ChartConfig

