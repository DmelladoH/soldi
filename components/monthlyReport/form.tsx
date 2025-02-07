"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
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
import { addMonthlyReport } from "@/server/queries";
import { CurrencyTypes } from "@/lib/constants";
import { redirect } from "next/navigation";

type FormValues = {
  date: string;
  payroll: number;
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
    fund: string;
    currentValue: number;
    amountInvested: number;
    currency: string;
  }>;
};

const formSchema = z.object({
  date: z.string().date(),
  payroll: z.coerce.number(),
  payrollCurrency: z.string(),
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

export function MonthlyReportForm({
  fundsOptions,
}: {
  fundsOptions: FundEntityWithId[];
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      payroll: 0,
      payrollCurrency: CurrencyTypes.Euro,
      cash: [{ name: "", amount: 0, currency: CurrencyTypes.Euro }],
      additionalIncome: [],
      investments: [],
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const formattedValues = {
      ...values,
      investments: values.investments.map((investment) => ({
        ...investment,
        fund: parseInt(investment.fund),
      })),
    };
    addMonthlyReport(formattedValues);
    redirect("/dashboard");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="flex gap-3">
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
        <div className="flex gap-3">
          <FormField
            control={form.control}
            name="payroll"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Payroll</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
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
                  <Input
                    defaultValue={CurrencyTypes.Euro}
                    {...field}
                    className="max-w-10"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <AdditionalForm form={form} />
        </div>

        <div className="flex gap-3">
          <CashForm form={form} />
        </div>
        <InvestmentForm form={form} fundsOptions={fundsOptions} />
        <div>
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </Form>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function AdditionalForm({ form }: { form: any }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "additionalIncome",
  });
  return (
    <div>
      <h4>Additional Income</h4>
      <ul>
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
              name="payrollCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={CurrencyTypes.Euro}
                      {...field}
                      className="max-w-10"
                    />
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
      <Button type="button" onClick={() => append({ name: "", amount: 0 })}>
        +
      </Button>
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function CashForm({ form }: { form: any }) {
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "cash",
  });
  return (
    <div>
      <h4>Cash</h4>
      <ul>
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
              name="payrollCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={CurrencyTypes.Euro}
                      {...field}
                      className="max-w-10"
                    />
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
      <Button type="button" onClick={() => append({ name: "", amount: 0 })}>
        +
      </Button>
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
    <>
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
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {fundsOptions.map(({ id, name }) => (
                          <SelectItem key={id} value={id.toString()}>
                            {name}
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
              name="payrollCurrency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Currency</FormLabel>
                  <FormControl>
                    <Input
                      defaultValue={CurrencyTypes.Euro}
                      {...field}
                      className="max-w-10"
                    />
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
      <Button
        type="button"
        onClick={() =>
          append({ fund: "", currentValue: "0", amountInvested: "0" })
        }
      >
        Add
      </Button>
    </>
  );
}
