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
        <main className="w-full p-3 sm:p-5">
          <SidebarTrigger className="fixed left-2 top-4 z-50 sm:left-4 sm:top-6" />
          <div className="md:pl-6 md:pt-0 pt-16">{children}</div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
}
