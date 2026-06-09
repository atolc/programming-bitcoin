import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";

export function ThemeToggle() {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("theme") || "light";
    }
    return "light";
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      className="relative flex size-9 items-center justify-center rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-750 dark:text-stone-300 shadow-sm hover:bg-stone-50 dark:hover:bg-stone-850 transition-all duration-200 active:scale-95 cursor-pointer"
      aria-label="Toggle theme"
    >
      <div className="relative size-5 overflow-hidden">
        <span
          className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
            theme === "dark" ? "rotate-90 scale-0" : "rotate-0 scale-100"
          }`}
        >
          <Sun className="size-4" />
        </span>
        <span
          className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${
            theme === "dark" ? "rotate-0 scale-100" : "-rotate-90 scale-0"
          }`}
        >
          <Moon className="size-4" />
        </span>
      </div>
    </button>
  );
}
