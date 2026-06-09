import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

type Theme = "light" | "dark";

function getPreferredTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const storedTheme = localStorage.getItem("theme");
  if (storedTheme === "light" || storedTheme === "dark") {
    return storedTheme;
  }

  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

export function ThemeToggle() {
  const { t } = useTranslation();
  const [theme, setTheme] = useState<Theme>(getPreferredTheme);

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
    <Button
      onClick={() => setTheme(theme === "light" ? "dark" : "light")}
      size="icon"
      variant="outline"
      aria-label={theme === "dark" ? t("theme.light") : t("theme.dark")}
      title={theme === "dark" ? t("theme.light") : t("theme.dark")}
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
    </Button>
  );
}
