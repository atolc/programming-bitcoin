import { lazy, Suspense, useEffect, useMemo, useRef, useState } from "react";
import {
  useNavigate,
  useParams,
  Link,
  Navigate,
} from "react-router-dom";
import {
  Search,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Home,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  getChapters,
  findChapterById,
  findSectionById,
  type Chapter,
  SANDBOX_CHAPTER_NUMBERS,
} from "../data/chapters";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { TableOfContents } from "../components/TableOfContents";
import { AppHeader } from "../components/AppHeader";
import { useLocale } from "../context/LocaleContext";
import { markChapterRead, getReadChapters } from "../lib/readProgress";
import { cn } from "../lib/utils";
import { LatexText } from "../components/LatexText";
import { Badge } from "@/components/ui/badge";
import {
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Kbd } from "@/components/ui/kbd";
import {
  Progress,
  ProgressIndicator,
  ProgressTrack,
} from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

const LazyPyodideProvider = lazy(() =>
  import("../components/PyodideProvider").then((m) => ({
    default: m.PyodideProvider,
  })),
);

function ChapterLayoutInner() {
  const { t } = useTranslation();
  const { locale, homePath, chapterPath } = useLocale();
  const { chapterId, sectionId } = useParams();
  const navigate = useNavigate();
  const chapters = getChapters(locale);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [readChapters, setReadChapters] = useState<Set<string>>(() => getReadChapters());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const validChapter = findChapterById(locale, chapterId);
  const redirectHome = Boolean(chapterId && !validChapter);

  const activeChapter = useMemo(() => {
    return (
      validChapter ??
      chapters[0] ??
      ({
        id: "",
        number: 0,
        title: "",
        filename: "",
        content: "",
        folder: "",
        sections: [],
        aliases: [],
      } as Chapter)
    );
  }, [validChapter, chapters]);

  const activeSection = useMemo(() => {
    return sectionId ? findSectionById(activeChapter, sectionId) : undefined;
  }, [activeChapter, sectionId]);

  const invalidSection = Boolean(sectionId && !activeSection);
  const activeContent = activeSection?.content ?? activeChapter.content;
  const activeTitle = activeSection?.title ?? activeChapter.title;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const docHeight =
        document.documentElement.scrollHeight - window.innerHeight;
      const scrollPos = window.scrollY;
      if (docHeight > 0) {
        setScrollPercent((scrollPos / docHeight) * 100);
      } else {
        setScrollPercent(0);
      }
    };
    window.addEventListener("scroll", handleScroll);
    setScrollPercent(0);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapterId]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [chapterId, sectionId]);

  useEffect(() => {
    if (!activeChapter.number) return;
    markChapterRead(activeChapter.number);
    setReadChapters(getReadChapters());
  }, [activeChapter.number]);

  const filteredChapters = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return chapters;

    return chapters.filter((chapter) => {
      return (
        chapter.title.toLowerCase().includes(normalized) ||
        chapter.content.toLowerCase().includes(normalized) ||
        chapter.sections.some((section) => {
          return (
            section.title.toLowerCase().includes(normalized) ||
            section.content.toLowerCase().includes(normalized)
          );
        })
      );
    });
  }, [query, chapters]);

  const activeIndex = useMemo(() => {
    return chapters.findIndex((c) => c.id === activeChapter.id);
  }, [activeChapter.id, chapters]);

  const prevChapter = activeIndex > 0 ? chapters[activeIndex - 1] : null;
  const nextChapter =
    activeIndex < chapters.length - 1 ? chapters[activeIndex + 1] : null;

  const activeSectionIndex = useMemo(() => {
    if (!activeSection) return -1;
    return activeChapter.sections.findIndex((s) => s.id === activeSection.id);
  }, [activeChapter.sections, activeSection]);

  const prevNav = useMemo(() => {
    if (activeChapter.sections.length === 0 || activeSectionIndex === -1 || activeSectionIndex === 0) {
      return prevChapter
        ? {
            label: t("chapter.prevChapter"),
            title: `${t("chapter.chapterShort")} ${prevChapter.number}: ${prevChapter.title}`,
            path: chapterPath(prevChapter.folder),
          }
        : null;
    }
    const prevSec = activeChapter.sections[activeSectionIndex - 1];
    return {
      label: t("chapter.prevSection"),
      title: prevSec.title,
      path: chapterPath(activeChapter.folder, prevSec.id),
    };
  }, [activeChapter, activeSectionIndex, prevChapter, t, chapterPath]);

  const nextNav = useMemo(() => {
    if (activeChapter.sections.length === 0) {
      return nextChapter
        ? {
            label: t("chapter.nextChapter"),
            title: `${t("chapter.chapterShort")} ${nextChapter.number}: ${nextChapter.title}`,
            path: chapterPath(nextChapter.folder),
          }
        : null;
    }
    if (activeSectionIndex === -1) {
      const firstSec = activeChapter.sections[0];
      return {
        label: t("chapter.nextSection"),
        title: firstSec.title,
        path: chapterPath(activeChapter.folder, firstSec.id),
      };
    }
    if (activeSectionIndex === activeChapter.sections.length - 1) {
      return nextChapter
        ? {
            label: t("chapter.nextChapter"),
            title: `${t("chapter.chapterShort")} ${nextChapter.number}: ${nextChapter.title}`,
            path: chapterPath(nextChapter.folder),
          }
        : null;
    }
    const nextSec = activeChapter.sections[activeSectionIndex + 1];
    return {
      label: t("chapter.nextSection"),
      title: nextSec.title,
      path: chapterPath(activeChapter.folder, nextSec.id),
    };
  }, [activeChapter, activeSectionIndex, nextChapter, t, chapterPath]);

  if (redirectHome) {
    return <Navigate to={homePath()} replace />;
  }

  if (invalidSection) {
    return <Navigate to={chapterPath(activeChapter.folder)} replace />;
  }

  const breadcrumbs = (
    <>
      <BreadcrumbItem>
        <BreadcrumbLink
          render={<Link to={homePath()} />}
          className="inline-flex items-center gap-1 hover:text-primary"
        >
          <Home className="size-3" />
          {t("chapter.home")}
        </BreadcrumbLink>
      </BreadcrumbItem>
      <BreadcrumbSeparator>/</BreadcrumbSeparator>
      <BreadcrumbItem>
        {activeSection ? (
          <BreadcrumbLink
            render={<Link to={chapterPath(activeChapter.folder)} />}
            className="hover:text-primary"
          >
            {t("chapter.chapter")} {activeChapter.number}
          </BreadcrumbLink>
        ) : (
          <BreadcrumbPage>{t("chapter.chapter")} {activeChapter.number}</BreadcrumbPage>
        )}
      </BreadcrumbItem>
      <BreadcrumbSeparator>/</BreadcrumbSeparator>
      <BreadcrumbItem>
        <BreadcrumbPage className="max-w-[200px] truncate">
          <LatexText text={activeTitle} />
        </BreadcrumbPage>
      </BreadcrumbItem>
    </>
  );

  return (
    <div className="app-shell min-h-screen">
      <Progress
        className="fixed top-0 left-0 z-50 h-[3px] w-full gap-0"
        value={scrollPercent}
      >
        <ProgressTrack className="h-[3px] rounded-none bg-muted">
          <ProgressIndicator className="rounded-none bg-primary" />
        </ProgressTrack>
      </Progress>

      <AppHeader
        breadcrumbs={breadcrumbs}
        showMenuButton
        menuOpen={menuOpen}
        onMenuToggle={() => setMenuOpen((value) => !value)}
      />

      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr]">
          <aside
            className={cn(
              "fixed inset-0 top-16 z-30 w-full bg-background lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)] lg:w-auto lg:border-r lg:border-border lg:bg-transparent overflow-hidden px-4 lg:px-0 py-6 pr-0 lg:pr-6 transition-all duration-200",
              menuOpen ? "block" : "hidden",
            )}
          >
            <ScrollArea className="h-full">
              <div className="space-y-5 pb-8">
                <Button
                  className="w-full justify-start lg:hidden"
                  onClick={() => setMenuOpen(false)}
                  render={<Link to={homePath()} />}
                  variant="outline"
                >
                  <Home className="size-4" />
                  {t("chapter.allChapters")}
                </Button>

                <InputGroup>
                  <InputGroupAddon>
                    <Search className="size-4 text-muted-foreground" />
                  </InputGroupAddon>
                  <InputGroupInput
                    ref={searchInputRef}
                    type="text"
                    placeholder={t("chapter.searchPlaceholder")}
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                  />
                  <InputGroupAddon align="inline-end">
                    {query ? (
                      <Button
                        className="size-7"
                        onClick={() => setQuery("")}
                        size="icon-xs"
                        type="button"
                        variant="ghost"
                        aria-label={t("chapter.clearSearch")}
                      >
                        <X className="size-3.5" />
                      </Button>
                    ) : (
                      <span className="hidden sm:inline-flex items-center gap-0.5">
                        <Kbd>Ctrl</Kbd>
                        <Kbd>K</Kbd>
                      </span>
                    )}
                  </InputGroupAddon>
                </InputGroup>

                <nav className="space-y-1" aria-label={t("chapter.chaptersNav")}>
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground px-3 mb-2">
                    {t("chapter.chaptersNav")}
                  </p>
                  {filteredChapters.length > 0 ? (
                    filteredChapters.map((chapter) => {
                      const isActive = activeChapter.id === chapter.id;
                      const isRead = readChapters.has(String(chapter.number));
                      return (
                        <Button
                          key={chapter.id}
                          className={cn(
                            "group h-auto w-full justify-start gap-3 px-3 py-2 text-left",
                            isActive && "bg-accent text-accent-foreground font-medium",
                          )}
                          onClick={() => {
                            navigate(chapterPath(chapter.folder));
                            setMenuOpen(false);
                          }}
                          type="button"
                          variant="ghost"
                        >
                          <span
                            className={cn(
                              "flex size-5.5 shrink-0 items-center justify-center rounded text-[11px] font-bold transition-all duration-150",
                              isActive
                                ? "bg-primary text-primary-foreground shadow-sm shadow-primary/10"
                                : "bg-muted text-muted-foreground group-hover:bg-muted/80 group-hover:text-foreground",
                            )}
                          >
                            {chapter.number}
                          </span>
                          <span className="leading-snug truncate flex-1">{chapter.title}</span>
                          {isRead && !isActive ? (
                            <CheckCircle2 className="size-3.5 shrink-0 text-success" />
                          ) : null}
                        </Button>
                      );
                    })
                  ) : (
                    <div className="px-3 py-4 text-center text-xs text-muted-foreground">
                      {t("chapter.noResults")}
                    </div>
                  )}
                </nav>
              </div>
            </ScrollArea>
          </aside>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_256px] gap-0 py-8 lg:pl-10">
            <article className="min-w-0 pr-0 xl:pr-10">
              <div className="mb-8 border-b border-border pb-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <Badge variant="secondary" className="rounded-full">
                      {t("chapter.chapter")} {activeChapter.number}
                    </Badge>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                      <LatexText text={activeTitle} />
                    </h2>
                    {activeSection ? (
                      <p className="mt-2 text-sm text-muted-foreground">
                        <LatexText text={activeChapter.title} />
                      </p>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="min-h-[400px]">
                <MarkdownRenderer content={activeContent} />
                {!activeSection && activeChapter.sections.length > 0 ? (
                  <section className="not-prose mt-10 grid gap-3 sm:grid-cols-2">
                    {activeChapter.sections.map((section) => (
                      <Card
                        key={section.id}
                        className="group transition-all duration-150 hover:border-primary/60"
                        render={<Link to={chapterPath(activeChapter.folder, section.id)} />}
                      >
                        <CardHeader className="gap-2">
                          <CardTitle className="text-sm group-hover:text-primary transition-colors">
                            <LatexText text={section.title} />
                          </CardTitle>
                          <CardDescription className="inline-flex items-center gap-1 text-xs font-semibold text-primary">
                            {t("chapter.openSection")} <ChevronRight className="size-3.5" />
                          </CardDescription>
                        </CardHeader>
                      </Card>
                    ))}
                  </section>
                ) : null}
              </div>

              <div className="mt-16 flex flex-wrap gap-4 items-center justify-between border-t border-border pt-8 pb-12">
                {prevNav ? (
                  <Card
                    className="group max-w-[280px] w-full hover:border-primary transition-all duration-200"
                    render={
                      <button
                        type="button"
                        onClick={() => navigate(prevNav.path)}
                      />
                    }
                  >
                    <CardContent className="flex flex-col items-start gap-1 p-4.5 text-left">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                        <ChevronLeft className="size-3.5" /> {prevNav.label}
                      </span>
                      <span className="text-sm font-semibold text-foreground truncate w-full">
                        <LatexText text={prevNav.title} />
                      </span>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="w-full max-w-[280px]" />
                )}

                {nextNav ? (
                  <Card
                    className="group max-w-[280px] w-full hover:border-primary transition-all duration-200"
                    render={
                      <button
                        type="button"
                        onClick={() => navigate(nextNav.path)}
                      />
                    }
                  >
                    <CardContent className="flex flex-col items-end gap-1 p-4.5 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-muted-foreground group-hover:text-primary transition-colors">
                        {nextNav.label} <ChevronRight className="size-3.5" />
                      </span>
                      <span className="text-sm font-semibold text-foreground truncate w-full">
                        <LatexText text={nextNav.title} />
                      </span>
                    </CardContent>
                  </Card>
                ) : (
                  <div className="w-full max-w-[280px]" />
                )}
              </div>
            </article>

            <TableOfContents
              chapterFolder={activeChapter.folder}
              sections={activeChapter.sections}
              activeSectionId={activeSection?.id}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChapterLayout() {
  const { locale } = useLocale();
  const { chapterId } = useParams();
  const chapter = findChapterById(locale, chapterId);
  const needsPyodide = chapter ? SANDBOX_CHAPTER_NUMBERS.has(chapter.number) : false;

  if (needsPyodide) {
    return (
      <Suspense fallback={<ChapterLayoutInner />}>
        <LazyPyodideProvider>
          <ChapterLayoutInner />
        </LazyPyodideProvider>
      </Suspense>
    );
  }

  return <ChapterLayoutInner />;
}
