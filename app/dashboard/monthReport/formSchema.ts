import { z } from "zod";

export const formSchema = z.object({
  date: z.string().date().min(1, {
    message: "Date is required",
  }),
  payroll: z.coerce.number().min(1, {
    message: "Payroll is required",
  }),
  expenses: z.coerce.number().min(1, {
    message: "Expenses is required",
  }),
  payrollCurrency: z.string().min(1, {
    message: "Payroll currency is required",
  }),
  cash: z.array(
    z.object({
      name: z.string(),
      amount: z.coerce.number(),
      currency: z.string(),
    })
  ),
  additionalIncome: z.array(
    z.object({
      name: z.string(),
      amount: z.coerce.number(),
      currency: z.string(),
    })
  ),
  investments: z.array(
    z.object({
      fund: z.string(),
      currentValue: z.coerce.number(),
      amountInvested: z.coerce.number(),
      currency: z.string(),
    })
  ),
});
