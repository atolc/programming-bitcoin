import { useMemo, useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle2, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "../components/AppHeader";
import { getChapters } from "../data/chapters";
import {
  getExercisesByChapter,
  getLocalizedExerciseContent,
  type ExerciseKind,
} from "../data/exercises";
import { findChapterByFolder } from "../data/content-manifest";
import { useLocale } from "../context/LocaleContext";
import { getPracticeProgress } from "../lib/practiceProgress";
import { practicePath } from "../lib/routes";
import { Badge } from "@/components/ui/badge";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const FILTERS: Array<ExerciseKind | "all"> = [
  "all",
  "book",
  "coding",
  "demo",
  "math",
];

export function PracticeChapterPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { chapterSlug } = useParams();
  const [filter, setFilter] = useState<ExerciseKind | "all">("all");
  const progress = useMemo(() => getPracticeProgress(), []);

  const chapterMeta = chapterSlug
    ? findChapterByFolder(locale, chapterSlug)
    : undefined;
  const chapters = getChapters(locale);
  const chapter = chapters.find((c) => c.number === chapterMeta?.number);

  if (!chapterSlug || !chapterMeta || !chapter) {
    return <Navigate to={practicePath(locale)} replace />;
  }

  const exercises = getExercisesByChapter(chapter.number).filter(
    (e) => filter === "all" || e.kind === filter,
  );

  return (
    <div className="app-shell min-h-screen bg-background text-foreground">
      <AppHeader
        breadcrumbs={
          <>
            <BreadcrumbItem>
              <BreadcrumbLink render={<Link to={practicePath(locale)} />}>
                {t("practice.title")}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {t("chapter.chapterShort")} {chapter.number}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        }
      />

      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        <Button
          className="mb-6"
          render={<Link to={practicePath(locale)} />}
          size="sm"
          variant="ghost"
        >
          <ArrowLeft className="size-4" />
          {t("practice.backToIndex")}
        </Button>

        <div className="mb-8">
          <Badge variant="secondary" className="mb-2">
            {t("chapter.chapterShort")} {chapter.number}
          </Badge>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            {chapter.title}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("practice.chapterExercises", { count: exercises.length })}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {FILTERS.map((kind) => (
            <Button
              key={kind}
              onClick={() => setFilter(kind)}
              size="sm"
              type="button"
              variant={filter === kind ? "default" : "outline"}
            >
              {t(`practice.filter${kind === "all" ? "All" : kind.charAt(0).toUpperCase() + kind.slice(1)}`)}
            </Button>
          ))}
        </div>

        <div className="space-y-2">
          {exercises.length === 0 ? (
            <p className="text-muted-foreground py-8 text-center">
              {t("practice.noExercises")}
            </p>
          ) : (
            exercises.map((exercise) => {
              const content = getLocalizedExerciseContent(exercise, locale);
              const status = progress[exercise.id];
              return (
                <Link
                  key={exercise.id}
                  to={practicePath(locale, chapter.folder, exercise.id)}
                  className={cn(
                    "flex items-center justify-between gap-4 rounded-xl border border-border bg-card px-4 py-3 hover:border-primary/40 transition-colors group",
                  )}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-[10px] uppercase">
                        {exercise.kind}
                      </Badge>
                      {exercise.offline ? (
                        <Badge variant="warning" className="text-[10px]">
                          {t("exercise.offline")}
                        </Badge>
                      ) : null}
                      {status === "passed" ? (
                        <CheckCircle2 className="size-4 text-emerald-500" />
                      ) : null}
                    </div>
                    <p className="font-medium truncate">{content.title}</p>
                    {exercise.bookRef ? (
                      <p className="text-xs text-muted-foreground truncate">
                        {exercise.bookRef}
                      </p>
                    ) : null}
                  </div>
                  <ChevronRight className="size-5 text-muted-foreground shrink-0 group-hover:text-primary transition-colors" />
                </Link>
              );
            })
          )}
        </div>
      </main>
    </div>
  );
}
