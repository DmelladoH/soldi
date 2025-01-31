import EntityForm from "@/app/dashboard/fundEntity/components/form";
import { getFoundEntities } from "@/server/queries";

export default async function FundEntity() {
  const fundEntities = await getFoundEntities();

  return (
    <div className="w-screen h-screen flex justify-center align-middle">
      <h1>Fund Entity</h1>
      <EntityForm entities={fundEntities} />
    </div>
  );
}
