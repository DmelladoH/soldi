import EntityForm from "@/app/dashboard/fundEntity/components/form";
import { getFoundEntities } from "@/server/queries";

export default async function FundEntity() {
  const fundEntities = await getFoundEntities();

  return (
    <div className="h-screen">
      <h1>Fund Entities</h1>
      <EntityForm entities={fundEntities} />
    </div>
  );
}
