import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import ThemeSwitchButton from "./theme-switch";
import Link from "next/link";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2>Soldi</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <ThemeSwitchButton />
          <ul>
            <li>
              <Link href={"/dashboard/fundEntity"}>Fund Entity</Link>
            </li>
          </ul>
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
