import { getFoundEntities } from "@/server/queries";
import { MonthlyReportForm } from "./_components/monthlyReportForm";

export default async function page() {
  const fundsOptions = await getFoundEntities();
  return (
    <div className="grid justify-center">
      <h2 className="text-xl">Month report</h2>
      <MonthlyReportForm fundsOptions={fundsOptions} />
    </div>
  );
}
