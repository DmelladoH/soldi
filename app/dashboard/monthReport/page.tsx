import { getFoundEntities } from "@/server/db/queries/foundEntities";
import { MonthlyReportForm } from "./_components/monthlyReportForm";
import { getMovementTags } from "@/server/db/queries/movementTags";

export default async function page() {
  const fundsOptions = await getFoundEntities();
  const movementTags = await getMovementTags();
  return (
    <div className="grid">
      <h1 className="text-xl">Month report</h1>
      <div className="mt-5 grid justify-center">
        <MonthlyReportForm
          fundsOptions={fundsOptions}
          movementTags={movementTags}
        />
      </div>
    </div>
  );
}
