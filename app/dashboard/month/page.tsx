import { getMonthlyReportWithInvestments } from "@/server/queries";
import MonthSummaryCard from "./_components/monthSummaryCard";
import { geStockDifference, getStockProfit } from "@/lib/utils";

export default async function page() {
  const res = await getMonthlyReportWithInvestments();

  return (
    <>
      <h1 className="text-center text-3xl mt-5">2024</h1>
      <section className="grid gap-10 mt-5">
        {res.length === 0 ? (
          <div className="flex flex-1 justify-center items-center mt-9">
            <p className="text-sm">No Data</p>
          </div>
        ) : (
          <>
            {res.map((item, indx) => (
              <MonthSummaryCard
                key={item.id}
                month={new Date(item.date).toLocaleDateString("es-ES", {
                  month: "long",
                })}
                totalAmount={
                  item.cash.reduce((acc, curr) => acc + curr.amount, 0) +
                  item.investments.reduce(
                    (acc, curr) => acc + curr.currentValue,
                    0
                  )
                }
                regularIncome={item.payroll}
                additionalIncomes={item.additionalIncome}
                expenses={item.expenses}
                bankAccounts={item.cash.map((cash) => ({
                  name: cash.name,
                  amount: cash.amount,
                  currency: "EUR",
                }))}
                stocks={item.investments.map((stock) => ({
                  fund: stock.fund,
                  currentValue: stock.currentValue,
                  amountInvested: stock.amountInvested,
                  difference: geStockDifference(res, stock, indx),
                  profit: getStockProfit(res, stock, indx),
                  currency: stock.currency,
                }))}
              />
            ))}
          </>
        )}
      </section>
    </>
  );
}
