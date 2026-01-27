import { Cash } from "@/types/database";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

export default function AccountsCart({
  bankAccounts,
}: {
  bankAccounts: Cash[];
}) {
  return (
    <Card className="grid">
      <CardHeader>
        <CardTitle className="text-lg">Bank Accounts</CardTitle>
      </CardHeader>
      <CardContent className="">
        {bankAccounts.length === 0 ? (
          <div className="flex flex-1 justify-center items-center">
            <p className="text-sm">No Data</p>
          </div>
        ) : (
          <ul className="grid gap-2">
            {bankAccounts.map((account, index) => (
              <li key={account.name}>
                <p key={index}>
                  {account.name}: {account.amount.toLocaleString()}
                  {account.currency}
                </p>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
