import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import ThemeSwitchButton from "./theme-switch";

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader>
        <h2>Soldi</h2>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <ThemeSwitchButton />
        </SidebarGroup>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
}
