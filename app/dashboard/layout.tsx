import { AppSidebar } from "@/components/app-sidebar";
import { ThemeProvider } from "@/components/theme-provider";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <header>
          <div>
            <AppSidebar />
          </div>
        </header>
        <main className="w-full p-5">
          <SidebarTrigger className="fixed left-0 top-6 z-50" />
          <div className="desktop:pl-5">{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
