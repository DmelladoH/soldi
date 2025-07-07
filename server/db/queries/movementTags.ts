import { db } from "..";

export async function getMovementTags() {
  const res = await db.query.movementTag.findMany();
  return res;
}
