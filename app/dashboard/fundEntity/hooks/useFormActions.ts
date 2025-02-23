import { FundEntityWithId } from "@/lib/types";
import { useOptimistic, useTransition } from "react";
import { removeFundEntity, saveFundEntity } from "../actions";
import { formSchema } from "../formSchema";
import { z } from "zod";

type NewEntityState = {
  action: "create" | "update" | "delete";
  entity: FundEntityWithId;
  pending: boolean;
};

type EntityState = {
  entities: FundEntityWithId[];
  pending: boolean;
};

function reducer(state: EntityState, newState: NewEntityState) {
  switch (newState.action) {
    case "create":
      return {
        entities: [...state.entities, newState.entity],
        pending: newState.pending,
      };

    case "delete":
      return {
        entities: state.entities.filter(
          (entity) => entity.id !== newState.entity.id
        ),
        pending: newState.pending,
      };

    default:
      return state;
  }
}

export function useFormActions(entities: FundEntityWithId[]) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, startTransition] = useTransition();
  const [optimisticFunds, addOptimisticFund] = useOptimistic(
    { entities, pending: false },
    reducer
  );

  const onDelete = async (id: number) => {
    const { success, res } = await removeFundEntity(id);

    if (success && res) {
      startTransition(async () => {
        addOptimisticFund({
          action: "delete",
          entity: res,
          pending: false,
        });
      });
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const fund = values;

    const newFund = await saveFundEntity(fund);
    startTransition(async () => {
      addOptimisticFund({
        action: "create",
        entity: newFund[0],
        pending: true,
      });
    });
  };

  return {
    onDelete,
    onSubmit,
    fundList: optimisticFunds.entities,
    pending: optimisticFunds.pending,
  };
}
