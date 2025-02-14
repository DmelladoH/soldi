import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import ThemeSwitchButton from "./theme-switch";
import Link from "next/link";
import ModalMonthlyReport from "./monthlyReport/modal";
import { Button } from "./ui/button";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center justify-between p-4">
          <Link href="/dashboard" className="text-xl font-semibold">
            Soldi
          </Link>
          <ThemeSwitchButton />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <ModalMonthlyReport />
          <ul className="mt-10 grid gap-3 pl-5">
            <li>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href={"/dashboard/fundEntity"}>Fund Entity</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href={"/dashboard/month"}>Summary</Link>
              </Button>
            </li>
          </ul>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
