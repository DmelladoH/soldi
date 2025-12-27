import { getFoundEntities } from "@/server/db/queries/foundEntities";
import { MonthlyReportForm } from "./_components/monthlyReportForm";
import { getMovementTags } from "@/server/db/queries/movementTags";

export default async function page() {
  const fundsOptions = await getFoundEntities();
  const movementTags = await getMovementTags();

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
