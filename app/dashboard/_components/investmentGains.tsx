"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface InvestmentGainsProps {
  gains: number;
  isLoading?: boolean;
}

export function InvestmentGains({ gains, isLoading }: InvestmentGainsProps) {
  const isPositive = gains >= 0;
  
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Investment Gains</CardTitle>
        {isPositive ? (
          <TrendingUp className="h-4 w-4 text-green-600" />
        ) : (
          <TrendingDown className="h-4 w-4 text-red-600" />
        )}
      </CardHeader>
      <CardContent>
        <div className={`text-2xl font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
          {isLoading ? (
            <div className="h-8 w-32 bg-gray-200 animate-pulse rounded" />
          ) : (
            <>
              {isPositive ? "+" : ""}
              {formatCurrency(gains)}
            </>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1">
          {isPositive ? "Lifetime profit from investments" : "Lifetime loss from investments"}
        </p>
      </CardContent>
    </Card>
  );
}