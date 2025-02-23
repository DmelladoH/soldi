import { FundEntity } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "./button";

export default function FundEntityCard({
  fundEntity,
  onDelete,
}: {
  fundEntity: FundEntity;
  onDelete: () => void;
}) {
  return (
    <Card className="">
      <CardHeader>
        {fundEntity.name} - ({fundEntity.type})
      </CardHeader>
      <CardContent>{fundEntity.ISIN}</CardContent>
      <CardFooter>
        <Button variant="destructive" onClick={onDelete}>
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}
