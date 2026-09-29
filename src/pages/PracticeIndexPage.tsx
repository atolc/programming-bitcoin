import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Code2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "../components/AppHeader";
import { getChapters } from "../data/chapters";
import {
  EXERCISES,
  getChapterExerciseIds,
  getExerciseCountsByChapter,
} from "../data/exercises";
import { useLocale } from "../context/LocaleContext";
import { getChapterPracticeStats } from "../lib/practiceProgress";
import { usePracticeProgress } from "../hooks/use-practice-progress";
import { practicePath } from "../lib/routes";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";

function preloadPyodide() {
  import("../lib/pyodide").then((m) => m.initPyodide()).catch(() => {});
}

export function PracticeIndexPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const practiceProgress = usePracticeProgress();
  const chapters = getChapters(locale);
  const counts = useMemo(() => getExerciseCountsByChapter(), []);
  const totalStats = getChapterPracticeStats(
    EXERCISES.map((exercise) => exercise.id),
    practiceProgress,
  );
  const totalProgress = totalStats.total > 0
    ? (totalStats.passed / totalStats.total) * 100
    : 0;

  return (
    <div className="app-shell min-h-screen bg-background text-foreground">
      <AppHeader />
      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="max-w-3xl mb-10">
          <div className="flex items-center gap-2 mb-3">
            <Code2 className="size-6 text-primary" />
            <Badge variant="outline">{t("practice.badge")}</Badge>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("practice.title")}
          </h1>
          <p className="mt-3 text-lg text-muted-foreground leading-relaxed">
            {t("practice.subtitle")}
          </p>
        </div>

        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-card/90 to-primary/5">
          <CardContent className="grid gap-4 p-5 sm:grid-cols-[1fr_auto] sm:items-center sm:p-6">
            <div className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1">
                <span className="font-semibold">{t("practice.totalProgress")}</span>
                <span className="text-sm text-muted-foreground">
                  {t("exercise.progressCount", {
                    passed: totalStats.passed,
                    total: totalStats.total,
                  })}
                </span>
              </div>
              <Progress value={totalProgress}>
                <ProgressTrack>
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>
            </div>
            <span className="text-2xl font-bold tabular-nums text-primary">
              {Math.round(totalProgress)}%
            </span>
          </CardContent>
        </Card>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {chapters.map((chapter) => {
            const exerciseIds = getChapterExerciseIds(chapter.number);
            const count = counts[chapter.number] ?? exerciseIds.length;
            const stats = getChapterPracticeStats(exerciseIds, practiceProgress);
            const progress =
              stats.total > 0 ? (stats.passed / stats.total) * 100 : 0;

            return (
              <Card
                key={chapter.id}
                className="group hover:border-primary/40 transition-colors"
                onMouseEnter={preloadPyodide}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-2">
                    <Badge variant="secondary">
                      {t("chapter.chapterShort")} {chapter.number}
                    </Badge>
                    {stats.passed === stats.total && stats.total > 0 ? (
                      <CheckCircle2 className="size-5 text-emerald-500 shrink-0" />
                    ) : null}
                  </div>
                  <CardTitle className="text-lg leading-snug">
                    {chapter.title}
                  </CardTitle>
                  <CardDescription>
                    {t("practice.exerciseCount", { count })}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {stats.total > 0 ? (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-xs text-muted-foreground">
                        <span>{t("exercise.progress")}</span>
                        <span>
                          {t("exercise.progressCount", {
                            passed: stats.passed,
                            total: stats.total,
                          })}
                        </span>
                      </div>
                      <Progress value={progress}>
                        <ProgressTrack>
                          <ProgressIndicator />
                        </ProgressTrack>
                      </Progress>
                    </div>
                  ) : null}
                  <Link
                    to={practicePath(locale, chapter.folder)}
                    className="inline-flex items-center gap-1.5 text-sm font-medium text-primary hover:underline"
                  >
                    {t("practice.openChapter")}
                    <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>
    </div>
  );
}
