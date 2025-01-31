import { FundEntity } from "@/lib/types";
import { db } from "./db";
import { FundEntities } from "./db/schema";

export async function getEntities() {
  try {
    const res = await db.query.entities.findMany();
    return res;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error getting Entities: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while getting the Entities.");
    }
  }
}

export async function getFoundEntities() {
  try {
    const res = await db.query.FundEntities.findMany();
    const processedRes: FundEntity[] = res.map((entity) => ({
      ISIN: entity.ISIN,
      name: entity.name,
      currency: entity.currency,
      type: entity.type,
    }));
    return processedRes;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error getting fund entity: ${e.message}`);
    } else {
      throw new Error(
        "An unknown error occurred while getting all fundEntities."
      );
    }
  }
}

export async function addFoundEntity(fundEntity: FundEntity) {
  try {
    await db.insert(FundEntities).values(fundEntity);
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error adding fund entity: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while adding fund entity.");
    }
  }
}
