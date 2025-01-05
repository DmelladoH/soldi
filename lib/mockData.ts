import { Entity, MonthlyForm } from "./types";

export const entities: Entity[] = [
  {
    name: "Cuenta corriente",
    currentAmount: 1000,
    currency: "EUR",
  },
  {
    name: "Cuenta de ahorro",
    currentAmount: 2000,
    currency: "EUR",
  },
];

export const monthResume: MonthlyForm = {
  income: 1000,
  additionalIncome: [
    {
      description: "Freelance",
      amount: 500,
    },
  ],
  investments: [
    {
      ISIN: "ES1234567890",
      currentValue: 2000,
      amountInvested: 1000,
      currency: "EUR",
    },
  ],
};
