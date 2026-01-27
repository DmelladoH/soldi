import { FundEntityWithId, MovementTag } from '../database/entities';
import { movementType } from '../business/financial';

export interface MonthlyReportFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

export interface FundEntityFormProps {
  initialData?: FundEntityWithId;
  onSubmit: (data: any) => void;
  isLoading?: boolean;
}

// Form field types
export interface CashField {
  name: string;
  amount: string;
  currency: string;
}

export interface MovementField {
  tag: MovementTag;
  amount: string;
  currency: string;
}

export interface InvestmentField {
  fund: FundEntityWithId;
  currentValue: string;
  amountInvested: string;
  currency: string;
}

export interface MonthlyReportFormFields {
  month: number;
  year: number;
  income: MovementField[];
  expense: MovementField[];
  cash: CashField[];
  funds: InvestmentField[];
}