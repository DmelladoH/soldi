import { FundEntityWithId } from './entities';

export interface Stock {
  fund: FundEntityWithId;
  currentValue: number;
  amountInvested: number;
  difference: number | undefined;
  profit: number | null;
  currency: string;
  closed?: boolean;
  closingAmount?: number;
}

export type PieEntity = {
  type: string;
  value?: number;
  percentage: number;
  fill: string;
};