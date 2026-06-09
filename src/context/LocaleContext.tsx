import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TITLES, type Locale } from "../lib/locale";
import {
  chapterPath,
  homePath,
  practicePath,
  PRACTICE_SEGMENTS,
} from "../lib/routes";
import {
  findChapterByFolder,
  resolveLocalizedPath,
} from "../data/content-manifest";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  homePath: () => string;
  chapterPath: (chapterId: string, sectionId?: string) => string;
  practicePath: (chapterSlug?: string, exerciseId?: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const { chapterId, sectionId, chapterSlug, exerciseId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const onPracticeRoute = Object.values(PRACTICE_SEGMENTS).some((segment) =>
    location.pathname.includes(`/${segment}`),
  );
  const { i18n } = useTranslation();

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.title = DOCUMENT_TITLES[locale];
  }, [locale, i18n]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) return;

      if (onPracticeRoute) {
        if (!chapterSlug) {
          navigate(practicePath(nextLocale));
          return;
        }
        const chapter = findChapterByFolder(locale, chapterSlug);
        if (!chapter) {
          navigate(practicePath(nextLocale));
          return;
        }
        const targetSlug = chapter.folders[nextLocale];
        navigate(
          exerciseId
            ? practicePath(nextLocale, targetSlug, exerciseId)
            : practicePath(nextLocale, targetSlug),
        );
        return;
      }

      if (!chapterId) {
        navigate(homePath(nextLocale));
        return;
      }

      const chapter = findChapterByFolder(locale, chapterId);
      if (!chapter) {
        navigate(homePath(nextLocale));
        return;
      }

      const resolved = resolveLocalizedPath(
        locale,
        nextLocale,
        chapterId,
        sectionId,
      );

      if (!resolved.chapterSlug) {
        navigate(homePath(nextLocale));
        return;
      }

      navigate(
        chapterPath(
          nextLocale,
          resolved.chapterSlug,
          resolved.sectionSlug,
        ),
      );
    },
    [chapterId, locale, navigate, onPracticeRoute, chapterSlug, exerciseId, sectionId],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      homePath: () => homePath(locale),
      chapterPath: (id, section) => chapterPath(locale, id, section),
      practicePath: (slug, exId) => practicePath(locale, slug, exId),
    }),
    [locale, setLocale],
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}
