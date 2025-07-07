import { FundEntityWithId, FundEntity } from "@/lib/types";
import { eq } from "drizzle-orm";
import { db } from "..";
import { monthlyReportInvestments, fundEntities } from "../schema";

export async function getFoundEntities() {
  try {
    const res = await db.query.fundEntities.findMany();
    const processedRes: FundEntityWithId[] = res.map((entity) => ({
      id: entity.id,
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

export async function getReportsFromFundEntity(id: number) {
  try {
    const res = await db
      .select()
      .from(monthlyReportInvestments)
      .where(eq(monthlyReportInvestments.fundEntityId, id));

    return res;
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

export async function addFoundEntity(
  fundEntity: FundEntity
): Promise<FundEntityWithId[]> {
  try {
    const res = await db.insert(fundEntities).values(fundEntity).returning();
    return res;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error adding fund entity: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while adding fund entity.");
    }
  }
}

export async function deleteFundEntity(
  id: number
): Promise<FundEntityWithId[]> {
  try {
    return await db
      .delete(fundEntities)
      .where(eq(fundEntities.id, id))
      .returning();
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error deleting fund entity: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while deleting fund entity.");
    }
  }
}
