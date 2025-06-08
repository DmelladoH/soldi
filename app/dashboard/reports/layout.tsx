import { Button } from "@/components/ui/button";
import { ArrowLeftToLine, ArrowRight } from "lucide-react";

export default function ReportLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Financial Reports</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            //   onClick={handlePrevReport}
            //   disabled={currentReportIndex >= mockMonthlyReports.length - 1}
            className="flex items-center space-x-1"
          >
            <ArrowLeftToLine size={16} />
            <span>Older</span>
          </Button>
          <span className="text-sm font-medium">
            June 2023
            {/* {getMonthName(selectedReport.month)} {selectedReport.year} */}
          </span>
          <Button
            variant="outline"
            //   onClick={handleNextReport}
            //   disabled={currentReportIndex <= 0}
            className="flex items-center space-x-1"
          >
            <span>Newer</span>
            <ArrowRight size={16} />
          </Button>
        </div>
      </div>
      <div className="">{children}</div>
    </div>
  );
}
