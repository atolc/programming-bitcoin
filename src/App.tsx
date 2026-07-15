import { Routes, Route, Navigate, Outlet, useParams } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ChapterLayout } from "./pages/ChapterLayout";
import { PracticeLayout } from "./pages/PracticeLayout";
import { PracticeIndexPage } from "./pages/PracticeIndexPage";
import { PracticeChapterPage } from "./pages/PracticeChapterPage";
import { ExerciseWorkbenchPage } from "./pages/ExerciseWorkbenchPage";
import { NotFoundPage } from "./pages/NotFoundPage";
import { LocaleProvider } from "./context/LocaleContext";
import {
  findChapterByIdLegacy,
  findSectionByIdLegacy,
} from "./data/chapters";
import { DEFAULT_LOCALE, isLocale, LOCALES, type Locale } from "./lib/locale";
import {
  chapterPath,
  homePath,
  PRACTICE_SEGMENTS,
  practicePath,
} from "./lib/routes";

function LocaleLayout({ locale }: { locale: Locale }) {
  return (
    <LocaleProvider locale={locale}>
      <Outlet />
    </LocaleProvider>
  );
}

function LegacyDocsRedirect() {
  const { chapterId, sectionId } = useParams();
  if (!chapterId) return <Navigate to={homePath(DEFAULT_LOCALE)} replace />;
  const chapter = findChapterByIdLegacy(chapterId);
  const section = chapter ? findSectionByIdLegacy(chapter, sectionId) : undefined;
  return (
    <Navigate
      to={chapterPath(
        DEFAULT_LOCALE,
        chapter?.folder ?? chapterId,
        section?.id ?? sectionId,
      )}
      replace
    />
  );
}

function LegacyChapterRedirect() {
  const { chapterId, sectionId } = useParams();
  if (!chapterId || isLocale(chapterId)) {
    return <Navigate to={homePath(DEFAULT_LOCALE)} replace />;
  }
  const chapter = findChapterByIdLegacy(chapterId);
  const section = chapter ? findSectionByIdLegacy(chapter, sectionId) : undefined;
  return (
    <Navigate
      to={chapterPath(
        DEFAULT_LOCALE,
        chapter?.folder ?? chapterId,
        section?.id ?? sectionId,
      )}
      replace
    />
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={homePath(DEFAULT_LOCALE)} replace />} />
      {LOCALES.map((locale) => (
        <Route key={locale} path={locale} element={<LocaleLayout locale={locale} />}>
          <Route index element={<LandingPage />} />
          <Route path={PRACTICE_SEGMENTS[locale]} element={<PracticeLayout />}>
            <Route index element={<PracticeIndexPage />} />
            <Route path=":chapterSlug" element={<PracticeChapterPage />} />
            <Route
              path=":chapterSlug/:exerciseId"
              element={<ExerciseWorkbenchPage />}
            />
          </Route>
          <Route path=":chapterId" element={<ChapterLayout />} />
          <Route path=":chapterId/:sectionId" element={<ChapterLayout />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      ))}
      <Route path="/docs/:chapterId" element={<LegacyDocsRedirect />} />
      <Route
        path="/docs/:chapterId/:sectionId"
        element={<LegacyDocsRedirect />}
      />
      <Route path="/:chapterId/:sectionId" element={<LegacyChapterRedirect />} />
      <Route path="/:chapterId" element={<LegacyChapterRedirect />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
