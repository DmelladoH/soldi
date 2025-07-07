"use server";

import { FundEntity, FundEntityWithId } from "@/lib/types";
import {
  addFoundEntity,
  getReportsFromFundEntity,
  deleteFundEntity,
} from "@/server/db/queries/foundEntities";

import { revalidatePath } from "next/cache";

export async function saveFundEntity(
  fundEntity: FundEntity
): Promise<FundEntityWithId[]> {
  const res = await addFoundEntity(fundEntity);
  revalidatePath("/");
  return res;
}

export async function removeFundEntity(
  id: number
): Promise<{ success: boolean; res: FundEntityWithId | null }> {
  const entities = await getReportsFromFundEntity(id);
  if (entities.length > 0) {
    return { success: false, res: null };
  }

  const deletedEntity = await deleteFundEntity(id);
  revalidatePath("/");
  return { success: true, res: deletedEntity[0] };
}
