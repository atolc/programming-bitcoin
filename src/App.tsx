import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ChapterLayout } from "./pages/ChapterLayout";
import { LocaleProvider } from "./context/LocaleContext";
import {
  findChapterByIdLegacy,
  findSectionByIdLegacy,
} from "./data/chapters";
import { DEFAULT_LOCALE, isLocale } from "./lib/locale";
import { chapterPath, homePath } from "./lib/routes";

function LocaleRoutes() {
  return (
    <LocaleProvider>
      <Routes>
        <Route index element={<LandingPage />} />
        <Route path=":chapterId" element={<ChapterLayout />} />
        <Route path=":chapterId/:sectionId" element={<ChapterLayout />} />
      </Routes>
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
      <Route path="/:locale/*" element={<LocaleRoutes />} />
      <Route path="/docs/:chapterId" element={<LegacyDocsRedirect />} />
      <Route
        path="/docs/:chapterId/:sectionId"
        element={<LegacyDocsRedirect />}
      />
      <Route path="/:chapterId/:sectionId" element={<LegacyChapterRedirect />} />
      <Route path="/:chapterId" element={<LegacyChapterRedirect />} />
      <Route path="*" element={<Navigate to={homePath(DEFAULT_LOCALE)} replace />} />
    </Routes>
  );
}
