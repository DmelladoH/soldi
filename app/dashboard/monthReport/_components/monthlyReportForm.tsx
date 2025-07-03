"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MonetaryInput from "@/components/ui/monetaryInput";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { FundEntityWithId, movementType } from "@/lib/types";
import { SelectItem, SelectValue } from "@radix-ui/react-select";
import { Plus, Trash } from "lucide-react";
import {
  Control,
  Controller,
  useFieldArray,
  useForm,
  UseFormRegister,
} from "react-hook-form";
import { saveMonthReport } from "../actions";

interface transaction {
  name: string;
  amount: string;
  currency: string;
}
interface FromFields {
  month: number;
  year: number;
  income: transaction[];
  expenses: transaction[];
  cash: transaction[];
  funds: {
    fund: FundEntityWithId;
    currentValue: string;
    amountInvested: string;
    currency: string;
  }[];
}

const Months = {
  1: "January",
  2: "February",
  3: "March",
  4: "April",
  5: "May",
  6: "June",
  7: "July",
  8: "August",
  9: "September",
  10: "October",
  11: "November",
  12: "December",
};

const defaultValues = {
  month: new Date().getMonth() + 1,
  year: new Date().getFullYear(),
  income: [
    {
      name: "",
      amount: "0",
      currency: "€",
    },
  ],
  expenses: [
    {
      name: "",
      amount: "0",
      currency: "€",
    },
  ],
  cash: [
    {
      name: "",
      amount: "0",
      currency: "€",
    },
  ],
  funds: [],
};

export function MonthlyReportForm({
  fundsOptions,
}: {
  fundsOptions: FundEntityWithId[];
}) {
  const {
    register,
    control,
    watch,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FromFields>({ defaultValues });

  console.log(watch());

  const onSubmit = async (data: FromFields) => {
    console.log(data);

    const movements = data.income.map(({ name, amount, currency }) => ({
      description: name,
      category: "income",
      amount: Number.parseFloat(amount.replace(",", ".")),
      currency,
      type: "income" as movementType,
    }));

    movements.push(
      ...data.expenses.map(({ name, amount, currency }) => ({
        description: name,
        category: "expense",
        amount: Number.parseFloat(amount.replace(",", ".")),
        currency,
        type: "expense" as movementType,
      }))
    );

    const date = new Date(
      Number(data.year),
      Number(data.month) - 1,
      new Date().getDate()
    );

    const formattedValues = {
      date: new Date(date.getFullYear(), date.getMonth(), 1).toISOString(),
      cash: data.cash.map((cash) => ({
        ...cash,
        amount: Number.parseFloat(cash.amount.replace(",", ".")),
      })),
      investments: data.funds.map((investment) => ({
        fund: investment.fund,
        amountInvested: Number.parseFloat(
          investment.amountInvested.replace(",", ".")
        ),
        currentValue: Number.parseFloat(
          investment.currentValue.replace(",", ".")
        ),
        currency: investment.currency,
      })),
      movements: movements,
    };

    await saveMonthReport(formattedValues);
    reset(defaultValues);
  };

  return (
    <form className="max-w-[1000px]" onSubmit={handleSubmit(onSubmit)}>
      <fieldset className="grid gap-5">
        <div className="flex gap-10 mt-5 w-full">
          <Label className="w-full grid gap-2">
            Month
            <Controller
              name="month"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={(id) => {
                    if (id == "") return;
                    field.onChange(Number(id));
                  }}
                  value={field.value.toString()}
                >
                  <SelectTrigger>
                    <SelectValue>
                      {Months[field.value as keyof typeof Months]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(Months).map(([num, name]) => (
                      <SelectItem key={num} value={num}>
                        {name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </Label>
          <Label className="w-full grid gap-2">
            Year
            <Input type="number" {...register("year")} />
          </Label>
        </div>
      </fieldset>
      <div className="flex gap-10 flex-col md:flex-row justify-between mt-10">
        <fieldset className="grid gap-5">
          <legend>Income</legend>
          <div className="mt-5">
            <IncomeAndExpenses
              name="income"
              placeholder="Payroll"
              control={control}
              register={register}
            />
          </div>
        </fieldset>
        <fieldset className="grid gap-5">
          <legend>Expenses</legend>
          <div className="mt-5">
            <IncomeAndExpenses
              name="expenses"
              placeholder="Rent"
              control={control}
              register={register}
            />
          </div>
        </fieldset>
      </div>
      <fieldset className="grid gap-5 mt-10 w-full">
        <legend>Cash</legend>
        <div className="mt-5">
          <IncomeAndExpenses
            name="cash"
            placeholder="Caixa bank"
            control={control}
            register={register}
          />
        </div>
      </fieldset>
      <fieldset className="grid gap-5 mt-10 ">
        <legend>Funds</legend>
        <div className="mt-5">
          <Funds fundsOptions={fundsOptions} control={control} />
        </div>
      </fieldset>
      <div className="mt-20 flex justify-end">
        <Button disabled={isSubmitting}>Submit</Button>
      </div>
    </form>
  );
}

function IncomeAndExpenses({
  name,
  control,
  register,
  placeholder,
}: {
  name: "income" | "expenses" | "cash";
  control: Control<FromFields>;
  register: UseFormRegister<FromFields>;
  placeholder: string;
}) {
  const { fields, append, remove } = useFieldArray({ name, control });

  return (
    <>
      <ul className="grid gap-5">
        {fields.map((field, index) => (
          <li key={field.id} className="flex gap-2 items-end">
            <Label className="flex-grow">
              Name
              <Input
                className="mt-2 "
                {...register(`${name}.${index}.name`)}
                placeholder={placeholder}
              />
            </Label>
            <Label>
              Amount
              <Controller
                name={`${name}.${index}.amount`}
                control={control}
                render={({ field }) => (
                  <MonetaryInput
                    className="mt-2"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </Label>
            <Button
              variant="secondary"
              type="button"
              className="mt-2"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              <Trash />
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            append({
              name: "",
              amount: "0",
              currency: "",
            });
          }}
        >
          <Plus /> Add
        </Button>
      </div>
    </>
  );
}

function Funds({
  control,
  fundsOptions,
}: {
  control: Control<FromFields>;
  fundsOptions: FundEntityWithId[];
}) {
  const name = "funds";
  const { fields, append, remove } = useFieldArray({ name, control });

  return (
    <>
      <ul className="grid gap-5">
        {fields.map((field, index) => (
          <li key={field.id} className="flex gap-2 items-end">
            <Label className="w-full grid gap-2">
              Fund
              <Controller
                name={`${name}.${index}.fund`}
                control={control}
                render={({ field }) => (
                  <Select
                    onValueChange={(id) => {
                      if (id == "") return;
                      field.onChange(
                        fundsOptions.find(
                          (fund) => fund.id === Number.parseInt(id)
                        )
                      );
                    }}
                    value={field.value?.name}
                  >
                    <SelectTrigger>
                      <SelectValue
                        placeholder="Select a fund"
                        className=" text-wrap"
                      >
                        {field.value?.name}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {fundsOptions.map(({ id, name }) => (
                        <SelectItem key={id} value={id.toString()}>
                          {name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </Label>
            <Label>
              Current amount
              <Controller
                name={`${name}.${index}.currentValue`}
                control={control}
                render={({ field }) => (
                  <MonetaryInput
                    className="mt-2"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </Label>
            <Label>
              Invested
              <Controller
                name={`${name}.${index}.amountInvested`}
                control={control}
                render={({ field }) => (
                  <MonetaryInput
                    className="mt-2"
                    value={field.value}
                    onChange={(value) => {
                      field.onChange(value);
                    }}
                  />
                )}
              />
            </Label>
            <Button
              variant="secondary"
              type="button"
              className="mt-2"
              disabled={fields.length === 1}
              onClick={() => remove(index)}
            >
              <Trash />
            </Button>
          </li>
        ))}
      </ul>
      <div className="mt-5">
        <Button
          variant="secondary"
          type="button"
          onClick={() => {
            append({
              fund: fundsOptions[0],
              currentValue: "0",
              amountInvested: "0",
              currency: "€",
            });
          }}
        >
          <Plus /> Add fund
        </Button>
      </div>
    </>
  );
}
