import { lazy, Suspense } from "react";
import { Outlet } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

const LazyPyodideProvider = lazy(() =>
  import("../components/PyodideProvider").then((m) => ({
    default: m.PyodideProvider,
  })),
);

function PracticeLoading() {
  const { t } = useTranslation();
  return (
    <div className="flex min-h-[50vh] items-center justify-center gap-2 text-muted-foreground">
      <Loader2 className="size-5 animate-spin" />
      <span>{t("code.preparing")}</span>
    </div>
  );
}

export function PracticeLayout() {
  return (
    <Suspense fallback={<PracticeLoading />}>
      <LazyPyodideProvider>
        <Outlet />
      </LazyPyodideProvider>
    </Suspense>
  );
}
