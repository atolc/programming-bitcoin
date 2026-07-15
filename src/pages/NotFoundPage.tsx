import { Link, useLocation } from "react-router-dom";
import { ArrowLeft, Home, BookOpen } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "../components/AppHeader";
import { Button } from "@/components/ui/button";
import { GradientButton } from "@/components/ui/gradient-button";
import { homePath } from "../lib/routes";
import { LocaleProvider } from "../context/LocaleContext";
import { parseLocale } from "../lib/locale";

function NotFoundContent({ locale }: { locale: ReturnType<typeof parseLocale> }) {
  const { t } = useTranslation();
  const location = useLocation();

  const homeHref = homePath(locale);

  return (
    <div className="app-shell min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      {/* Ambient background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <AppHeader />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-[calc(100vh-64px)] px-4 text-center">
        {/* 404 number */}
        <div className="relative mb-2">
          <span className="text-[8rem] sm:text-[12rem] font-black leading-none select-none bg-gradient-to-br from-amber-400/20 via-orange-500/20 to-amber-600/10 bg-clip-text text-transparent">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-[8rem] sm:text-[12rem] font-black leading-none select-none bg-gradient-to-br from-amber-400 via-orange-500 to-amber-600 bg-clip-text text-transparent opacity-30 blur-sm">
              404
            </span>
          </div>
        </div>

        {/* Title and description */}
        <h1 className="mt-4 text-2xl sm:text-3xl font-bold tracking-tight">
          {t("notFound.title")}
        </h1>
        <p className="mt-3 text-muted-foreground max-w-md leading-relaxed">
          {t("notFound.description")}
        </p>

        {/* Attempted path */}
        <div className="mt-4 px-4 py-2 rounded-lg bg-muted/50 border border-border">
          <code className="text-sm font-mono text-muted-foreground break-all">
            {location.pathname}
          </code>
        </div>

        {/* Actions */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <GradientButton render={<Link to={homeHref} />}>
            <Home className="size-4" />
            {t("notFound.goHome")}
          </GradientButton>

          <Button variant="outline" render={<Link to={homeHref} />}>
            <BookOpen className="size-4" />
            {t("notFound.browseChapters")}
          </Button>
        </div>

        {/* Back hint */}
        <button
          type="button"
          onClick={() => window.history.back()}
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          {t("notFound.goBack")}
        </button>
      </main>
    </div>
  );
}

/**
 * NotFoundPage — rendered for unmatched routes (both locale-nested and top-level).
 *
 * When mounted inside a <LocaleLayout> the LocaleContext is already provided.
 * When mounted at the top-level catch-all it is outside any LocaleLayout, so
 * AppHeader's useLocale() call would throw.  We wrap with a fallback
 * LocaleProvider using the default locale so the header renders correctly in
 * both cases.
 */
export function NotFoundPage() {
  // Detect locale from URL prefix so the header shows the right language when
  // possible (e.g. /en/... → 'en', /es/... → 'es').
  const location = useLocation();
  const segments = location.pathname.split("/").filter(Boolean);
  const detectedLocale = parseLocale(segments[0]);

  return (
    <LocaleProvider locale={detectedLocale}>
      <NotFoundContent locale={detectedLocale} />
    </LocaleProvider>
  );
}
