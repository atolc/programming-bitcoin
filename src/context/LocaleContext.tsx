import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  type ReactNode,
} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { DOCUMENT_TITLES, type Locale } from "../lib/locale";
import { chapterPath, homePath } from "../lib/routes";
import {
  findChapterByFolder,
  resolveLocalizedPath,
} from "../data/content-manifest";

type LocaleContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  homePath: () => string;
  chapterPath: (chapterId: string, sectionId?: string) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  const { chapterId, sectionId } = useParams();
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    void i18n.changeLanguage(locale);
    document.documentElement.lang = locale;
    document.title = DOCUMENT_TITLES[locale];
  }, [locale, i18n]);

  const setLocale = useCallback(
    (nextLocale: Locale) => {
      if (nextLocale === locale) return;

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
    [chapterId, locale, navigate, sectionId],
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      homePath: () => homePath(locale),
      chapterPath: (id, section) => chapterPath(locale, id, section),
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
