import { PieEntity } from '../database/queries';

export interface ChartDataPoint {
  month: string;
  amount: number;
  total?: number;
  invested?: number;
}

export interface PieChartData extends PieEntity {
  name: string;
}

export interface FinancialCardProps {
  title: string;
  amount: number;
  currency: string;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}