"use server";

import { MonthlyReport } from "@/types/database";
import { MonthlyReportsRepository } from "@/server/db/repositories";
import { revalidatePath } from "next/cache";

const monthlyReportsRepository = new MonthlyReportsRepository();

export async function saveMonthReport(monthReport: MonthlyReport) {
  await monthlyReportsRepository.create(monthReport);
  revalidatePath("/");
}
