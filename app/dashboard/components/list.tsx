import { getMonthlyReportWithInvestments } from "@/server/queries";
import MonthResumeCart from "./cart";

export default async function MonthReportList() {
  const monthlyReport = (await getMonthlyReportWithInvestments()).toSorted(
    (a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  );

  console.log({ monthlyReport });
  return (
    <ul>
      {monthlyReport.map((report, index) => (
        <li key={report.id}>
          <MonthResumeCart
            resume={report}
            lasMonthInvestments={monthlyReport[index + 1]?.investments}
          />
        </li>
      ))}
    </ul>
  );
}

// function monthCard(){

// }
