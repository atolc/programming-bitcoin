import { useTranslation } from "react-i18next";
import { LOCALES, LOCALE_LABELS, type Locale } from "../lib/locale";
import { useLocale } from "../context/LocaleContext";
import { Button } from "@/components/ui/button";
import { cn } from "../lib/utils";

export function LanguageSwitcher() {
  const { t } = useTranslation();
  const { locale, setLocale } = useLocale();

  return (
    <div
      className="inline-flex items-center rounded-lg border border-border bg-muted/40 p-0.5"
      role="group"
      aria-label={t("language.label")}
    >
      {LOCALES.map((code) => (
        <Button
          key={code}
          type="button"
          size="sm"
          variant="ghost"
          className={cn(
            "h-7 min-w-9 px-2 text-xs font-semibold",
            locale === code && "bg-background text-foreground shadow-sm",
          )}
          onClick={() => setLocale(code as Locale)}
          aria-pressed={locale === code}
          aria-label={t(`language.${code}`)}
        >
          {LOCALE_LABELS[code as Locale]}
        </Button>
      ))}
    </div>
  );
}
