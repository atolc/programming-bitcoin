import { Routes, Route, Navigate, useParams } from "react-router-dom";
import { LandingPage } from "./pages/LandingPage";
import { ChapterLayout } from "./pages/ChapterLayout";
import { findChapterById } from "./data/chapters";
import { chapterPath, homePath } from "./lib/routes";

function LegacyDocsRedirect() {
  const { chapterId, sectionId } = useParams();
  if (!chapterId) return <Navigate to={homePath()} replace />;
  const chapter = findChapterById(chapterId);
  return <Navigate to={chapterPath(chapter?.id ?? chapterId, sectionId)} replace />;
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/:chapterId" element={<ChapterLayout />} />
      <Route path="/:chapterId/:sectionId" element={<ChapterLayout />} />
      <Route path="/docs/:chapterId" element={<LegacyDocsRedirect />} />
      <Route path="/docs/:chapterId/:sectionId" element={<LegacyDocsRedirect />} />
      <Route path="*" element={<Navigate to={homePath()} replace />} />
    </Routes>
  );
}
