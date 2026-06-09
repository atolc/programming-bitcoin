import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AppHeader } from "../components/AppHeader";
import { ExerciseWorkbench } from "../components/ExerciseWorkbench";
import { getChapters } from "../data/chapters";
import {
  getExerciseById,
  getExercisesByChapter,
  getLocalizedExerciseContent,
} from "../data/exercises";
import { findChapterByFolder } from "../data/content-manifest";
import { useLocale } from "../context/LocaleContext";
import { practicePath } from "../lib/routes";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";

export function ExerciseWorkbenchPage() {
  const { t } = useTranslation();
  const { locale } = useLocale();
  const { chapterSlug, exerciseId } = useParams();

  const chapterMeta = chapterSlug
    ? findChapterByFolder(locale, chapterSlug)
    : undefined;
  const chapters = getChapters(locale);
  const chapter = chapters.find((c) => c.number === chapterMeta?.number);
  const exercise = exerciseId ? getExerciseById(exerciseId) : undefined;

  if (!chapterSlug || !chapterMeta || !chapter || !exercise || exercise.chapter !== chapter.number) {
    return <Navigate to={practicePath(locale)} replace />;
  }

  const chapterExercises = getExercisesByChapter(chapter.number);
  const currentIndex = chapterExercises.findIndex((e) => e.id === exercise.id);
  const prevExercise = currentIndex > 0 ? chapterExercises[currentIndex - 1] : null;
  const nextExercise =
    currentIndex < chapterExercises.length - 1
      ? chapterExercises[currentIndex + 1]
      : null;
  const content = getLocalizedExerciseContent(exercise, locale);

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
              <BreadcrumbLink
                render={<Link to={practicePath(locale, chapter.folder)} />}
              >
                {t("chapter.chapterShort")} {chapter.number}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[200px] truncate">
                {content.title}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </>
        }
      />

      <main className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <Button
            render={<Link to={practicePath(locale, chapter.folder)} />}
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="size-4" />
            {t("practice.backToChapter")}
          </Button>

          <div className="flex items-center gap-2">
            {prevExercise ? (
              <Button
                render={
                  <Link
                    to={practicePath(locale, chapter.folder, prevExercise.id)}
                  />
                }
                size="sm"
                variant="outline"
              >
                <ChevronLeft className="size-4" />
                {t("practice.prevExercise")}
              </Button>
            ) : null}
            {nextExercise ? (
              <Button
                render={
                  <Link
                    to={practicePath(locale, chapter.folder, nextExercise.id)}
                  />
                }
                size="sm"
                variant="outline"
              >
                {t("practice.nextExercise")}
                <ChevronRight className="size-4" />
              </Button>
            ) : null}
          </div>
        </div>

        <ExerciseWorkbench exercise={exercise} locale={locale} />
      </main>
    </div>
  );
}
