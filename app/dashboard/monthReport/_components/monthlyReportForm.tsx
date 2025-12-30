"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import MonetaryInput from "@/components/ui/monetaryInput";
import { Select, SelectContent, SelectTrigger } from "@/components/ui/select";
import { MONTHS, MonthMap } from "@/lib/constants";
import { FundEntityWithId, MovementTag, movementType } from "@/lib/types";
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

interface cash {
  name: string;
  amount: string;
  currency: string;
}

interface movement {
  tag: MovementTag;
  amount: string;
  currency: string;
}
interface FromFields {
  month: number;
  year: number;
  income: movement[];
  expense: movement[];
  cash: cash[];
  funds: {
    fund: FundEntityWithId;
    currentValue: string;
    amountInvested: string;
    currency: string;
  }[];
}

const defaultValues = {
  month: new Date().getUTCMonth() + 1,
  year: new Date().getFullYear(),
  movements: [],
  cash: [],
  funds: [],
};

export function MonthlyReportForm({
  fundsOptions,
  movementTags,
}: {
  fundsOptions: FundEntityWithId[];
  movementTags: MovementTag[];
}) {
  const {
    register,
    control,
    handleSubmit,
    reset,
    watch,
    formState: { isSubmitting },
  } = useForm<FromFields>({ defaultValues });

  const onSubmit = async (data: FromFields) => {
    const movementsRaw = [...data.income, ...data.expense];
    const movements = movementsRaw.map(({ tag, amount, currency }) => ({
      description: "",
      tagId: tag.id,
      amount: Number.parseFloat(amount.replace(",", ".")),
      currency,
      type: tag.type,
    }));

    const formattedValues = {
      month: data.month,
      year: data.year,
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
                      {MonthMap[field.value as keyof typeof MonthMap]}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(MonthMap).map(([num, name]) => (
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
              type="income"
              movementTags={movementTags}
              control={control}
            />
          </div>
        </fieldset>
        <fieldset className="grid gap-5">
          <legend>Expenses</legend>
          <div className="mt-5">
            <IncomeAndExpenses
              type="expense"
              movementTags={movementTags}
              control={control}
            />
          </div>
        </fieldset>
      </div>
      <fieldset className="grid gap-5 mt-10 w-full">
        <legend>Cash</legend>
        <div className="mt-5">
          <Cash
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

function Cash({
  control,
  register,
  placeholder,
}: {
  control: Control<FromFields>;
  register: UseFormRegister<FromFields>;
  placeholder: string;
}) {
  const { fields, append, remove } = useFieldArray({
    name: "cash",
    control,
  });

  return (
    <>
      <ul className="grid gap-5">
        {fields.map((field, index) => (
          <li key={field.id} className="flex gap-2 items-end">
            <Label className="flex-grow">
              Name
              <Input
                className="mt-2 "
                {...register(`cash.${index}.name`)}
                placeholder={placeholder}
              />
            </Label>
            <Label>
              Amount
              <Controller
                name={`cash.${index}.amount`}
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

function IncomeAndExpenses({
  type,
  control,
  movementTags,
}: {
  type: movementType;
  control: Control<FromFields>;
  movementTags: MovementTag[];
}) {
  const { fields, append, remove } = useFieldArray({
    name: type,
    control,
  });

  return (
    <>
      <ul className="grid gap-5">
        {fields
          .filter((field) => field.tag.type === type)
          .map((field, index) => (
            <li key={field.id} className="flex gap-2 items-end">
              <Label className="flex-grow">
                Name
                <Controller
                  name={`${type}.${index}.tag`}
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={(id) => {
                        if (id == "") return;

                        field.onChange(
                          movementTags.find(
                            (tag) => tag.id === Number.parseInt(id)
                          )
                        );
                      }}
                      value={field.value?.name}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder="Select a tag"
                          className=" text-wrap"
                        >
                          {field.value?.name}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        {movementTags
                          .filter((tag) => tag.type === type)
                          .map((tag) => (
                            <SelectItem key={tag.id} value={tag.id.toString()}>
                              {tag.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </Label>
              <Label>
                Amount
                <Controller
                  name={`${type}.${index}.amount`}
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
              tag: movementTags.find((tag) => tag.type === type)!,
              amount: "0",
              currency: "€",
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
