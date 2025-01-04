import { ThemeProvider } from "@/components/theme-provider";
import ThemeSwitchButton from "@/components/theme-switch";

export default function DashboardLayout() {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <header>
        <h3>header</h3>
        <div>
          <ThemeSwitchButton />
        </div>
      </header>
      <aside>
        <p>aside</p>
      </aside>
      <main>main</main>
    </ThemeProvider>
  );
}
