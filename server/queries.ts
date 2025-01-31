import { db } from "./db";

export async function getEntities() {
  try {
    const res = await db.query.Entity.findMany();
    return res;
  } catch (e: unknown) {
    if (e instanceof Error) {
      throw new Error(`Error getting Entities: ${e.message}`);
    } else {
      throw new Error("An unknown error occurred while getting the Entities.");
    }
  }
}
