"use client";

import { FundEntityWithId } from "@/lib/types";
import FundEntityCard from "@/components/ui/FundEntityCard";
import EntityForm from "./form";
import { removeFundEntity } from "../actions";

export default function FundEntityView({
  entities,
}: {
  entities: FundEntityWithId[];
}) {
  return (
    <div className="grid">
      <EntityForm />
      <section className="mt-10">
        <h3>Entities</h3>
        {entities.length === 0 ? (
          <div className="flex justify-center mt-10">
            <p>No entities found</p>
          </div>
        ) : (
          <FundList entities={entities} />
        )}
      </section>
    </div>
  );
}

function FundList({ entities }: { entities: FundEntityWithId[] }) {
  const onDelete = async (id: number) => {
    await removeFundEntity(id);
  };

  return (
    <ul className="mt-3 grid gap-4">
      {entities.map((entity) => {
        return (
          <li key={entity.ISIN}>
            <FundEntityCard
              fundEntity={entity}
              onDelete={() => onDelete(entity.id)}
            />
          </li>
        );
      })}
    </ul>
  );
}
