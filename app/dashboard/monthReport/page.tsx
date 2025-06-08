import { getFoundEntities } from "@/server/queries";
import { MonthlyReportForm } from "./_components/monthlyReportForm";

export default async function page() {
  const fundsOptions = await getFoundEntities();
  return (
    <div className="grid">
      <h1 className="text-xl">Month report</h1>
      <div className="mt-5 grid justify-center">
        <MonthlyReportForm fundsOptions={fundsOptions} />
      </div>
    </div>
  );
}
