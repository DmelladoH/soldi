import { getFoundEntities } from "@/server/db/queries/foundEntities";
import FundEntityView from "./components/view";

export default async function FundEntity() {
  const fundEntities = await getFoundEntities();

  return (
    <div className="h-screen">
      <h1>Fund Entities</h1>
      <div className="mt-4">
        <FundEntityView entities={fundEntities} />
      </div>
    </div>
  );
}
