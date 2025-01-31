import { getEntities } from "@/server/queries";
import { NextResponse } from "next/server";

export async function GET() {
  const entities = await getEntities();
  return NextResponse.json([...entities]);
}
