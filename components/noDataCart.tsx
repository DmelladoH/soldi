import { Card, CardContent } from "./ui/card";

export default function NoDataCart() {
  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="flex justify-center items-center h-full">
        No Data
      </CardContent>
    </Card>
  );
}
