"use client";

import { FundEntityWithId } from "@/lib/types";
import { useFormActions } from "../hooks/useFormActions";
import FundEntityCard from "@/components/ui/FundEntityCard";
import EntityForm from "./form";

export default function FundEntityView({
  entities,
}: {
  entities: FundEntityWithId[];
}) {
  const { onSubmit, onDelete, fundList, pending } = useFormActions(entities);

  return (
    <div className="grid">
      <EntityForm onSubmit={onSubmit} pending={pending} />
      <section className="mt-10">
        <h3>Entities</h3>
        {fundList.length === 0 ? (
          <div className="flex justify-center mt-10">
            <p>No entities found</p>
          </div>
        ) : (
          <FundList entities={fundList} onDelete={onDelete} />
        )}
      </section>
    </div>
  );
}

function FundList({
  entities,
  onDelete,
}: {
  entities: FundEntityWithId[];
  onDelete: (id: number) => void;
}) {
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
