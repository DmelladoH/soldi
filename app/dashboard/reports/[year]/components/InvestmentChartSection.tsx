import { InvestmentSummary } from "../../_components/investmentSummary";

interface InvestmentChartSectionProps {
  formattedData: Array<{ month: string; value: number }>;
}

export function InvestmentChartSection({
  formattedData,
}: InvestmentChartSectionProps) {
  return (
    <div className="flex-1">
      <InvestmentSummary rangeData={formattedData} />
    </div>
  );
}