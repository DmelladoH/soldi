import { FundEntitiesRepository, MovementTagsRepository } from "@/server/db/repositories";
import { MonthlyReportForm } from "./_components/monthlyReportForm";

const fundEntitiesRepository = new FundEntitiesRepository();
const movementTagsRepository = new MovementTagsRepository();

export default async function page() {
  const fundsOptions = await fundEntitiesRepository.findMany();
  const movementTags = await movementTagsRepository.findMany();

  return (
    <div className="grid p-3 sm:p-5">
      <h1 className="text-2xl font-bold">Month report</h1>
      <div className="mt-5 grid">
        <MonthlyReportForm
          fundsOptions={fundsOptions}
          movementTags={movementTags}
        />
      </div>
    </div>
  );
}
