import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import ThemeSwitchButton from "./theme-switch";
import Link from "next/link";
import { Button } from "./ui/button";
import { BarChart } from "lucide-react";
import UserFooter from "./userFooter";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <div className="pl-10 flex items-center justify-between p-4">
          <Link href="/dashboard" className="text-xl font-semibold">
            Soldi
          </Link>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <Button asChild className="w-full justify-start" variant="default">
            <Link href={"/dashboard/monthReport"}>
              <BarChart className="mr-2 h-4 w-4" />
              Month Report
            </Link>
          </Button>
          <ul className="mt-10 grid gap-3 pl-5">
            <li>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href={"/dashboard/"}>Home</Link>
              </Button>
            </li>
            <li>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href={"/dashboard/fundEntity"}>Fund Entity</Link>
              </Button>
            </li>
            {/* <li>
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link href={"/dashboard/reports"}>Reports</Link>
              </Button>
            </li> */}
          </ul>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between items-center">
          <UserFooter />
          <ThemeSwitchButton />
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
