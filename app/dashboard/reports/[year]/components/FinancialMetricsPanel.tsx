import { formatCurrency } from "@/lib/utils";
import type { FinancialMetrics } from "../hooks/useYearReportData";

interface FinancialMetricsPanelProps {
  totalInvestmentGains: number;
  financialMetrics: FinancialMetrics;
}

export function FinancialMetricsPanel({
  totalInvestmentGains,
  financialMetrics,
}: FinancialMetricsPanelProps) {
  const {
    percentageGainsThisYear,
    percentageGainsTotal,
    savingsRate,
    avgMonthlySavings,
    avgMonthlyInvested,
  } = financialMetrics;

  return (
    <div className="w-80 flex-shrink-0">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 gap-3">
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
            <span className="text-xs font-medium text-gray-700">
              Total investments gains
            </span>
            <div className="text-right">
              <span className="font-bold text-sm text-gray-900">
                {formatCurrency(totalInvestmentGains)}
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
            <span className="text-xs font-medium text-gray-700">
              Profit over invested this year
            </span>
            <span className="font-bold text-sm text-gray-900">{`${percentageGainsThisYear.toFixed(2)}%`}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-100">
            <span className="text-xs font-medium text-gray-700">
              Profit over total invested
            </span>
            <span className="font-bold text-sm text-gray-900">{`${percentageGainsTotal.toFixed(2)}%`}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-100">
            <span className="text-xs font-medium text-gray-700">
              Savings Rate
            </span>
            <span className="font-bold text-sm text-gray-900">{`${savingsRate.toFixed(2)}%`}</span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-teal-50 to-cyan-50 rounded-lg border border-teal-100">
            <span className="text-xs font-medium text-gray-700">
              Avg Monthly Savings
            </span>
            <span className="font-bold text-sm text-gray-900">
              {formatCurrency(avgMonthlySavings)}
            </span>
          </div>
          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-rose-50 to-red-50 rounded-lg border border-rose-100">
            <span className="text-xs font-medium text-gray-700">
              Avg Monthly Investment
            </span>
            <span className="font-bold text-sm text-gray-900">
              {formatCurrency(avgMonthlyInvested)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
