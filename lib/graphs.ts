import { ChartConfig } from "@/components/ui/chart";
import { PieEntity, Stock } from "./types";

export const getPieConfigByFundType = (stocks: Stock[]): PieEntity[] => {
  if (stocks.length === 0) {
    return [];
  }
  const totalValue = stocks.reduce((sum, stock) => sum + stock.currentValue, 0);

  const groupedByType = Object.groupBy(stocks, (s) => s.fund.type);

  return Object.entries(groupedByType).map(([type, items]) => {
    const value = items!.reduce((sum, i) => sum + i.currentValue, 0);

    return {
      type,
      value,
      percentage: totalValue ? (value / totalValue) * 100 : 0,
      fill: `var(--color-${type})`,
    };
  });
};

export const buildChartConfig = (chartData: PieEntity[]): ChartConfig => {
  return chartData.reduce<ChartConfig>((acc, item, index) => {
    acc[item.type] = {
      label: `${item.type} (${Math.round(item.percentage)}%)`,
      color: `var(--chart-${index + 1})`,
    };

    return acc;
  }, {});
};
