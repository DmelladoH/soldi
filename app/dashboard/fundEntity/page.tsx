import { FundEntitiesRepository } from "@/server/db/repositories";
import FundEntityView from "./components/view";

const fundEntitiesRepository = new FundEntitiesRepository();

export default async function FundEntity() {
  const fundEntities = await fundEntitiesRepository.findMany();

  return (
    <div className="h-screen p-3 sm:p-5">
      <h1 className="text-2xl font-bold">Fund Entities</h1>
      <div className="mt-4">
        <FundEntityView entities={fundEntities} />
      </div>
    </div>
  );
}
