import { FundEntitiesRepository, MovementTagsRepository, MonthlyReportsRepository } from "@/server/db/repositories";
import { MonthlyReportForm } from "@/app/dashboard/monthReport/_components/monthlyReportForm";
import { MONTHS } from "@/lib/constants";
import { notFound, redirect } from "next/navigation";

const fundEntitiesRepository = new FundEntitiesRepository();
const movementTagsRepository = new MovementTagsRepository();
const monthlyReportsRepository = new MonthlyReportsRepository();

export default async function EditMonthReportPage({
  params,
}: {
  params: Promise<{ year: string; month: string }>;
}) {
  const { month, year } = await params;
  
  // Convert month name to number
  const monthNumber = MONTHS.indexOf(month.toLocaleLowerCase()) + 1;
  if (monthNumber === 0) {
    notFound();
  }

  const yearNumber = Number(year);
  if (isNaN(yearNumber)) {
    notFound();
  }

  // Get existing report data
  const existingReport = await monthlyReportsRepository.findByYearMonth(monthNumber, yearNumber);
  
  if (!existingReport) {
    redirect("/dashboard/reports");
  }

  const fundsOptions = await fundEntitiesRepository.findMany();
  const movementTags = await movementTagsRepository.findMany();

  return (
    <div className="grid p-3 sm:p-5">
      <h1 className="text-2xl font-bold">
        Edit Report - {month.charAt(0).toUpperCase() + month.slice(1)} {year}
      </h1>
      <div className="mt-5 grid">
        <MonthlyReportForm
          fundsOptions={fundsOptions}
          movementTags={movementTags}
          initialData={existingReport}
          isEditing={true}
          reportId={existingReport.id}
        />
      </div>
    </div>
  );
}