"use client";

import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@components/ui/input";
import { Button } from "@components/ui/button";
import { useOptimistic, useTransition } from "react";
import { FundEntity } from "@/lib/types";
import { saveFundEntity } from "../actions";

const formSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  ISIN: z.string().min(1, {
    message: "ISIN is required",
  }),
  currency: z.string().min(1, {
    message: "Currency is required",
  }),
  type: z.string().min(1, {
    message: "Type is required",
  }),
});

type EntityState = {
  newEntity: FundEntity;
  updateEntity: FundEntity;
  pending: boolean;
};

export default function EntityForm({ entities }: { entities: FundEntity[] }) {
  const [state, mutate] = useOptimistic(
    { entities, pending: false },
    function createReducer(state, newState: EntityState) {
      if (newState.newEntity) {
        return {
          entities: [...state.entities, newState.newEntity],
          pending: newState.pending,
        };
      } else {
        return {
          entities: state.entities,
          pending: newState.pending,
        };
      }
    }
  );

  return (
    <>
      <FormSection mutate={mutate} pending={state.pending} />
      <section>
        <h3>Entities</h3>
        {state.entities.map((entity) => {
          return (
            <div key={entity.ISIN}>
              <h4>{entity.name}</h4>
              <p>{entity.ISIN}</p>
            </div>
          );
        })}
      </section>
    </>
  );
}

function FormSection({
  mutate,
  pending,
}: {
  mutate: (newState: EntityState) => void;
  pending: boolean;
}) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPending, startTransition] = useTransition();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      ISIN: "",
      currency: "",
      type: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    const fund = values;
    form.reset({
      name: "",
      ISIN: "",
      currency: "",
      type: "",
    });

    startTransition(async () => {
      mutate({
        newEntity: fund,
        updateEntity: fund,
        pending: true,
      });

      await saveFundEntity(fund);
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ISIN"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ISIN</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="currency"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Currency</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={pending}>
          Submit
        </Button>
      </form>
    </Form>
  );
}
