import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { MonthlyReportForm } from "./form";
import { getFoundEntities } from "@/server/queries";

export default async function ModalMonthlyReport() {
  const fundsOptions = await getFoundEntities();
  return (
    <Dialog>
      <DialogTrigger>Month Report</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Month Report</DialogTitle>
        </DialogHeader>
        <MonthlyReportForm fundsOptions={fundsOptions} />
      </DialogContent>
    </Dialog>
  );
}
