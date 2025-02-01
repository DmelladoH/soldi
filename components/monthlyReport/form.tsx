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
import { FundEntity } from "@/lib/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type FormValues = {
  date: string;
  payroll: number;
  cash: Array<{
    name: string;
    amount: number;
  }>;
  additionalIncome: Array<{
    name: string;
    amount: number;
  }>;
  investments: Array<{
    fund: string;
    currentValue: number;
    amountInvested: number;
  }>;
};

const formSchema = z.object({
  date: z.string().date(),
  payroll: z.coerce.number(),
  cash: z.array(
    z.object({
      name: z.string(),
      amount: z.coerce.number(),
    })
  ),
  additionalIncome: z.array(
    z.object({
      name: z.string(),
      amount: z.coerce.number(),
    })
  ),
  investments: z.array(
    z.object({
      fund: z.string(),
      currentValue: z.coerce.number(),
      amountInvested: z.coerce.number(),
    })
  ),
});

export function MonthlyReportForm({
  fundsOptions,
}: {
  fundsOptions: FundEntity[];
}) {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: new Date().toISOString().split("T")[0],
      payroll: 0,
      cash: [{ name: "", amount: 0 }],
      additionalIncome: [{ name: "", amount: 0 }],
      investments: [
        {
          fund: "",
          currentValue: 0,
          amountInvested: 0,
        },
      ],
    },
  });

  // 2. Define a submit handler.
  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
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
        </div>
        <div className="flex gap-3">
          <CashForm form={form} />
          <AdditionalForm form={form} />
        </div>

        <InvestmentForm form={form} fundsOptions={fundsOptions} />
        <Button type="submit">Submit</Button>
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
  fundsOptions: FundEntity[];
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
                        {fundsOptions.map(({ ISIN, name }) => (
                          <SelectItem key={ISIN} value={name}>
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
      <Button type="button" onClick={() => append({ fund: "", currentValue: "0", amountInvested: "0" })}>
        Add
      </Button>
    </>
  );
}
