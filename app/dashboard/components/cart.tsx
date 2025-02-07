import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import NumberDisplay from "@/components/ui/numberDisplay";
import { Investments, MonthResume } from "@/lib/types";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function MonthResumeCart({
  resume,
  lasMonthInvestments,
}: {
  resume: MonthResume;
  lasMonthInvestments: Investments[] | undefined;
}) {
  const date = new Date(resume.date);
  const dateString = date.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
  const month = date.toLocaleDateString("en-GB", {
    month: "long",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex gap-1 align-baseline">
          <h3 className="text-lg">{month}</h3>
          <span className="text-sm">({dateString})</span>
        </CardTitle>
        <CardContent>
          <section>
            <h4>Cash</h4>
            <ul>
              {resume.cash.map((cash) => (
                <li key={cash.name}>
                  <CashDisplay
                    name={cash.name}
                    amount={cash.amount}
                    currency={"€"}
                  />
                </li>
              ))}
            </ul>
          </section>
          <section>
            <h4>Investments</h4>
            <ul>
              {resume.investments.map((inv) => (
                <li key={inv.fund}>
                  <InvestmentDisplay
                    fund={inv.fund}
                    currentValue={inv.currentValue}
                    amountInvested={inv.amountInvested}
                    lastMonthValue={
                      lasMonthInvestments?.find((el) => el.fund === inv.fund)
                        ?.currentValue
                    }
                  />
                </li>
              ))}
            </ul>
          </section>
        </CardContent>
      </CardHeader>
    </Card>
  );
}

function CashDisplay({
  name,
  amount,
  currency,
}: {
  name: string;
  amount: number;
  currency: string;
}) {
  return (
    <div className="flex gap-1 align-baseline">
      <span>{name}</span>
      <NumberDisplay amount={amount} currency={currency} />
    </div>
  );
}

function InvestmentDisplay({
  fund,
  currentValue,
  amountInvested,
  lastMonthValue,
}: {
  fund: string;
  currentValue: number;
  amountInvested: number;
  lastMonthValue?: number;
}) {
  return (
    <div>
      <span>{fund}</span>
      <NumberDisplay amount={currentValue} currency={"€"} />
      <NumberDisplay amount={amountInvested} currency={"€"} />
      {lastMonthValue != null && (
        <>
          {currentValue - lastMonthValue > 0 ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <NumberDisplay
            amount={currentValue - lastMonthValue}
            currency={"€"}
          />
        </>
      )}
    </div>
  );
}
