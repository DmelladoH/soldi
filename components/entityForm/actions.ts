"use server";

import { FundEntity } from "@/lib/types";
import { addFoundEntity } from "@/server/queries";
import { revalidatePath } from "next/cache";

export async function saveFundEntity(fundEntity: FundEntity) {
  await addFoundEntity(fundEntity);
  revalidatePath("/");
}
