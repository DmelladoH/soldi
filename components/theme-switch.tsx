"use client";

import { useTheme } from "next-themes";

export default function ThemeSwitchButton() {
  const { setTheme, theme } = useTheme();

  console.log({ theme });

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <button className="p-2 border" onClick={toggleTheme}>
      {theme === "dark" ? "light" : "dark"}
    </button>
  );
}
