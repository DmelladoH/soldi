"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { FundEntityWithId } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CurrencyTypes } from "@/lib/constants";
import { formSchema } from "../formSchema";
import { useState } from "react";
import { saveMonthReport } from "../actions";
import MonetaryInput from "@/components/ui/monetaryInput";

type FormValues = {
  date: string;
  payroll: number;
  expenses: number;
  payrollCurrency: string;
  cash: Array<{
    name: string;
    amount: number;
    currency: string;
  }>;
  additionalIncome: Array<{
    name: string;
    amount: number;
    currency: string;
  }>;
  investments: Array<{
    fund: FundEntityWithId;
    currentValue: number;
    amountInvested: number;
    currency: string;
  }>;
};

const defaultValue = {
  date: new Date().toISOString().split("T")[0],
  payroll: 0,
  expenses: 0,
  payrollCurrency: CurrencyTypes.Euro,
  cash: [{ name: "", amount: 0, currency: CurrencyTypes.Euro }],
  additionalIncome: [],
  investments: [],
};

export function MonthlyReportForm({
  fundsOptions,
}: {
  fundsOptions: FundEntityWithId[];
}) {
  const [pending, setPending] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValue,
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setPending(true);
      const formattedValues = {
        ...values,
        investments: values.investments.map((investment) => ({
          ...investment,
          fund: investment.fund,
        })),
      };
      await saveMonthReport(formattedValues);
      form.reset(defaultValue);
    } catch (e) {
      console.log(e);
    } finally {
      setPending(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-3 mt-5">
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Date</FormLabel>
                <FormControl>
                  <Input type="Date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="payroll"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Payroll</FormLabel>
                  <FormControl>
                    <MonetaryInput {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="payrollCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex gap-3">
            <FormField
              control={form.control}
              name="expenses"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Expenses</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex gap-3">
          <AdditionalForm form={form} />
        </div>

        <div className="flex gap-3">
          <CashForm form={form} />
        </div>
        <InvestmentForm form={form} fundsOptions={fundsOptions} />
        <div className="flex justify-end">
          <Button type="submit" disabled={pending}>
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
}

function AdditionalForm({ form }: { form: UseFormReturn<FormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalIncome",
  });
  return (
    <div className="grid gap-3">
      <h4>Additional Income</h4>
      <ul className="grid gap-2">
        {fields.map((item, index) => (
          <li key={item.id} className="flex gap-3">
            <FormField
              control={form.control}
              name={`additionalIncome.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`additionalIncome.${index}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`additionalIncome.${index}.currency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => remove(index)}
              className=" self-end"
            >
              X
            </Button>
          </li>
        ))}
      </ul>
      <div>
        <Button
          type="button"
          onClick={() =>
            append({ name: "", amount: 0, currency: CurrencyTypes.Euro })
          }
        >
          +
        </Button>
      </div>
    </div>
  );
}

function CashForm({ form }: { form: UseFormReturn<FormValues> }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cash",
  });
  return (
    <div className="grid gap-3">
      <h4>Cash</h4>
      <ul className="grid gap-2">
        {fields.map((item, index) => (
          <li key={item.id} className="flex gap-3">
            <FormField
              control={form.control}
              name={`cash.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input type="text" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`cash.${index}.amount`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`cash.${index}.currency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => remove(index)}
              className="self-end"
            >
              X
            </Button>
          </li>
        ))}
      </ul>
      <div>
        <Button
          type="button"
          onClick={() =>
            append({ name: "", amount: 0, currency: CurrencyTypes.Euro })
          }
        >
          +
        </Button>
      </div>
    </div>
  );
}

function InvestmentForm({
  form,
  fundsOptions,
}: {
  form: any; // eslint-disable-line @typescript-eslint/no-explicit-any
  fundsOptions: FundEntityWithId[];
}) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "investments",
  });
  return (
    <div className="grid gap-3">
      <h4>Investments Income</h4>
      <ul>
        {fields.map((item, index) => (
          <li key={item.id} className="flex gap-3">
            <FormField
              control={form.control}
              name={`investments.${index}.fund`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fund</FormLabel>
                  <FormControl>
                    <Select
                      onValueChange={(id) =>
                        field.onChange(
                          fundsOptions.find(
                            (fund) => fund.id === Number.parseInt(id)
                          )
                        )
                      }
                      value={field.value?.id || ""}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a fund">
                            {field.value?.name || "Select a fund"}
                          </SelectValue>
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fundsOptions.map((fund) => (
                          <SelectItem key={fund.id} value={fund.id.toString()}>
                            {fund.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name={`investments.${index}.currentValue`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Amount</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`investments.${index}.amountInvested`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount invested</FormLabel>
                  <FormControl>
                    <Input type="number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`investments.${index}.currency`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-10" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => remove(index)}
              className=" self-end"
            >
              X
            </Button>
          </li>
        ))}
      </ul>
      <div>
        <Button
          type="button"
          onClick={() =>
            append({ fund: null, currentValue: "0", amountInvested: "0" })
          }
        >
          +
        </Button>
      </div>
    </div>
  );
}
