"use server";

import { FundEntity, FundEntityWithId } from "@/types/database";
import { FundEntitiesRepository } from "@/server/db/repositories";
import { revalidatePath } from "next/cache";

const fundEntitiesRepository = new FundEntitiesRepository();

export async function addFundEntity(fundEntity: FundEntity) {
  const res = await fundEntitiesRepository.create(fundEntity);
  revalidatePath("/");
  return res;
}

export async function getFundReports(id: number) {
  const entities = await fundEntitiesRepository.getInvestmentHistory(id);
  revalidatePath("/");
  return entities;
}

export async function removeFundEntity(id: number): Promise<FundEntityWithId> {
  const deletedEntity = await fundEntitiesRepository.delete(id);
  revalidatePath("/");
  return deletedEntity;
}