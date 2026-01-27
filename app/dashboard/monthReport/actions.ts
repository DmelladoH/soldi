"use server";

import { MonthlyReport } from "@/types/database";
import { addMonthlyReport } from "@/server/db/queries/report";
import { revalidatePath } from "next/cache";

export async function saveMonthReport(monthReport: MonthlyReport) {
  await addMonthlyReport(monthReport);
  revalidatePath("/");
}
