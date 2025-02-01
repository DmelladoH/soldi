import { FundEntity } from "@/lib/types";
import { Card, CardContent, CardFooter, CardHeader } from "./card";
import { Button } from "./button";

export default function FundEntityCard({
  fundEntity,
}: {
  fundEntity: FundEntity;
}) {
  return (
    <Card className="">
      <CardHeader>
        {fundEntity.name} - ({fundEntity.type})
      </CardHeader>
      <CardContent>{fundEntity.ISIN}</CardContent>
      <CardFooter>
        <Button variant="destructive">Delete</Button>
      </CardFooter>
    </Card>
  );
}
