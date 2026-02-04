"use server";

import { MonthlyReport } from "@/types/database";
import { MonthlyReportsRepository } from "@/server/db/repositories";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { MONTHS } from "@/lib/constants";

const monthlyReportsRepository = new MonthlyReportsRepository();

export async function saveMonthReport(monthReport: MonthlyReport) {
  await monthlyReportsRepository.create(monthReport);
  revalidatePath("/");
}

export async function updateMonthReport(id: number, monthReport: MonthlyReport) {
  await monthlyReportsRepository.update(id, monthReport);
  revalidatePath("/");
  revalidatePath("/dashboard/reports");
  
  // Redirect to the month report view
  const monthName = MONTHS[monthReport.month - 1];
  redirect(`/dashboard/reports/${monthReport.year}/${monthName}`);
}
