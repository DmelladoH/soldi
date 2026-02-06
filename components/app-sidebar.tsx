import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "./ui/button";
import { BarChart } from "lucide-react";
import UserFooter from "./userFooter";

export function AppSidebar() {
  return (
    <Sidebar variant="inset">
      <SidebarHeader>
        <div className="pl-6 sm:pl-10 flex items-center justify-between p-3 sm:p-4">
          <Link href="/dashboard" className="text-lg sm:text-xl font-semibold">
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
          <ul className="mt-8 sm:mt-10 grid gap-2 sm:gap-3 pl-3 sm:pl-5">
            <li>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-sm sm:text-base"
              >
                <Link href={"/dashboard"}>Home</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-sm sm:text-base"
              >
                <Link href={"/dashboard/fundEntity"}>Fund Entity</Link>
              </Button>
            </li>
            <li>
              <Button
                asChild
                variant="ghost"
                className="w-full justify-start text-sm sm:text-base"
              >
                <Link href={"/dashboard/reports"}>Reports</Link>
              </Button>
            </li>
          </ul>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter>
        <div className="flex justify-between items-center p-3 sm:p-4">
          <UserFooter />
          {/* <ThemeSwitchButton /> */}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
