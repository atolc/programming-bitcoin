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
import { chapters, type Chapter } from "../data/chapters";
import { MarkdownRenderer } from "../components/MarkdownRenderer";
import { TableOfContents } from "../components/TableOfContents";
import { AppHeader } from "../components/AppHeader";
import { parseToc } from "../lib/toc";
import { chapterPath, homePath } from "../lib/routes";
import { markChapterRead, getReadChapters } from "../lib/readProgress";
import { cn } from "../lib/utils";

const SANDBOX_CHAPTERS = new Set(["capitulo-1", "capitulo-2", "capitulo-3"]);

const LazyPyodideProvider = lazy(() =>
  import("../components/PyodideProvider").then((m) => ({
    default: m.PyodideProvider,
  })),
);

function ChapterLayoutInner() {
  const { chapterId, sectionId } = useParams();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const [readChapters, setReadChapters] = useState<Set<string>>(() => getReadChapters());
  const searchInputRef = useRef<HTMLInputElement>(null);

  const validChapter = chapters.find((chapter) => chapter.id === chapterId);

  if (chapterId && !validChapter) {
    return <Navigate to={homePath()} replace />;
  }

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
      } as Chapter)
    );
  }, [validChapter]);

  const activeSectionTitle = useMemo(() => {
    if (!sectionId) return "";
    return (
      parseToc(activeChapter.content).find((item) => item.id === sectionId)?.text ??
      ""
    );
  }, [activeChapter.content, sectionId]);

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
    if (!sectionId) {
      window.scrollTo(0, 0);
    }
  }, [chapterId, sectionId]);

  useEffect(() => {
    if (!sectionId) return;

    let attempts = 0;
    let timeout = 0;

    const scrollToSection = () => {
      const targetEl = document.getElementById(sectionId);
      attempts += 1;
      if (!targetEl) {
        if (attempts < 10) {
          timeout = window.setTimeout(scrollToSection, 50);
        }
        return;
      }

      const offset = 90;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = targetEl.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;

      window.scrollTo({
        top: elementPosition - offset,
        behavior: attempts > 1 ? "smooth" : "auto",
      });
    };

    timeout = window.setTimeout(scrollToSection, 50);
    return () => window.clearTimeout(timeout);
  }, [sectionId, activeChapter.content]);

  useEffect(() => {
    if (!activeChapter.id) return;
    markChapterRead(activeChapter.id);
    setReadChapters(getReadChapters());
  }, [activeChapter.id]);

  const filteredChapters = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) return chapters;

    return chapters.filter((chapter) => {
      return (
        chapter.title.toLowerCase().includes(normalized) ||
        chapter.content.toLowerCase().includes(normalized)
      );
    });
  }, [query]);

  const activeIndex = useMemo(() => {
    return chapters.findIndex((c) => c.id === activeChapter.id);
  }, [activeChapter.id]);

  const prevChapter = activeIndex > 0 ? chapters[activeIndex - 1] : null;
  const nextChapter =
    activeIndex < chapters.length - 1 ? chapters[activeIndex + 1] : null;

  const breadcrumbs = (
    <>
      <Link
        to={homePath()}
        className="hover:text-amber-600 dark:hover:text-amber-400 transition-colors inline-flex items-center gap-1"
      >
        <Home className="size-3" />
        Inicio
      </Link>
      <span className="text-stone-300 dark:text-stone-700">/</span>
      <span>Capítulo {activeChapter.number}</span>
      <span className="text-stone-300 dark:text-stone-700">/</span>
      <span className="text-stone-800 dark:text-stone-200 max-w-[200px] truncate">
        {activeSectionTitle || activeChapter.title}
      </span>
    </>
  );

  return (
    <div className="app-shell min-h-screen">
      <div className="fixed top-0 left-0 w-full h-[3px] bg-stone-200 dark:bg-stone-800 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-75 ease-out"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

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
              "fixed inset-0 top-16 z-30 w-full bg-white dark:bg-stone-900 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)] lg:w-auto lg:border-r lg:border-stone-200 lg:dark:border-stone-800 lg:bg-transparent lg:dark:bg-transparent overflow-y-auto px-4 lg:px-0 py-6 pr-0 lg:pr-6 transition-all duration-200",
              menuOpen ? "block" : "hidden",
            )}
          >
            <div className="space-y-5 pb-8">
              <Link
                to={homePath()}
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-900/60 px-3 py-2 text-sm font-medium text-stone-600 dark:text-stone-400 hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all lg:hidden"
              >
                <Home className="size-4" />
                Todos los capítulos
              </Link>

              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-stone-400">
                  <Search className="size-4" />
                </span>
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Buscar en resúmenes..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  className="h-9.5 w-full rounded-lg border border-stone-300 dark:border-stone-800 bg-white dark:bg-stone-900/60 pl-9.5 pr-12 text-sm text-stone-900 dark:text-stone-100 outline-none ring-amber-500/20 dark:ring-amber-500/10 focus:border-amber-500 dark:focus:border-amber-500 focus:ring-4 transition-all duration-150 placeholder:text-stone-400 dark:placeholder:text-stone-500"
                />
                <div className="absolute inset-y-0 right-3 flex items-center gap-1.5 pointer-events-none">
                  {query ? (
                    <button
                      type="button"
                      onClick={() => setQuery("")}
                      className="pointer-events-auto text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 cursor-pointer"
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : (
                    <kbd className="hidden sm:inline-flex h-5 select-none items-center gap-0.5 rounded border border-stone-200 dark:border-stone-800 bg-stone-50 dark:bg-stone-800 px-1.5 font-mono text-[9px] font-medium text-stone-400 dark:text-stone-500">
                      <span>Ctrl</span><span>K</span>
                    </kbd>
                  )}
                </div>
              </div>

              <nav className="space-y-1" aria-label="Capítulos">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-3 mb-2">
                  Capítulos del Libro
                </p>
                {filteredChapters.length > 0 ? (
                  filteredChapters.map((chapter) => {
                    const isActive = activeChapter.id === chapter.id;
                    const isRead = readChapters.has(chapter.id);
                    return (
                      <button
                        key={chapter.id}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150 cursor-pointer",
                          isActive
                            ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-medium"
                            : "text-stone-600 dark:text-stone-400 hover:bg-stone-100/60 dark:hover:bg-stone-900/40 hover:text-stone-900 dark:hover:text-stone-200",
                        )}
                        type="button"
                        onClick={() => {
                          navigate(chapterPath(chapter.id));
                          setMenuOpen(false);
                        }}
                      >
                        <span
                          className={cn(
                            "flex size-5.5 shrink-0 items-center justify-center rounded text-[11px] font-bold transition-all duration-150",
                            isActive
                              ? "bg-amber-500 text-white shadow-sm shadow-amber-500/10"
                              : "bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400 group-hover:bg-stone-300/60 dark:group-hover:bg-stone-700 group-hover:text-stone-800 dark:group-hover:text-stone-200",
                          )}
                        >
                          {chapter.number}
                        </span>
                        <span className="leading-snug truncate flex-1">{chapter.title}</span>
                        {isRead && !isActive ? (
                          <CheckCircle2 className="size-3.5 shrink-0 text-emerald-500/70" />
                        ) : null}
                      </button>
                    );
                  })
                ) : (
                  <div className="px-3 py-4 text-center text-xs text-stone-400 dark:text-stone-500">
                    No se encontraron capítulos
                  </div>
                )}
              </nav>
            </div>
          </aside>

          <div className="grid grid-cols-1 xl:grid-cols-[1fr_256px] gap-0 py-8 lg:pl-10">
            <article className="min-w-0 pr-0 xl:pr-10">
              <div className="mb-8 border-b border-stone-200 dark:border-stone-800 pb-6">
                <div className="flex items-center justify-between gap-4 flex-wrap">
                  <div>
                    <span className="inline-flex items-center rounded-full bg-amber-50 dark:bg-amber-950/20 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:text-amber-400 border border-amber-200/30">
                      Capítulo {activeChapter.number}
                    </span>
                    <h2 className="mt-3 text-3xl sm:text-4xl font-extrabold tracking-tight text-stone-900 dark:text-white">
                      {activeChapter.title}
                    </h2>
                  </div>
                </div>
              </div>

              <div className="min-h-[400px]">
                <MarkdownRenderer content={activeChapter.content} />
              </div>

              <div className="mt-16 flex flex-wrap gap-4 items-center justify-between border-t border-stone-200 dark:border-stone-800 pt-8 pb-12">
                {prevChapter ? (
                  <button
                    onClick={() => navigate(chapterPath(prevChapter.id))}
                    className="group flex flex-col items-start gap-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4.5 hover:border-amber-500 hover:bg-stone-50/50 dark:hover:bg-stone-800/60 text-left transition-all duration-200 max-w-[280px] w-full shadow-sm cursor-pointer"
                    type="button"
                  >
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-amber-500 transition-colors">
                      <ChevronLeft className="size-3.5" /> Anterior
                    </span>
                    <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate w-full group-hover:text-stone-900 dark:group-hover:text-white">
                      Cap. {prevChapter.number}: {prevChapter.title}
                    </span>
                  </button>
                ) : (
                  <div className="w-full max-w-[280px]" />
                )}

                {nextChapter ? (
                  <button
                    onClick={() => navigate(chapterPath(nextChapter.id))}
                    className="group flex flex-col items-end gap-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4.5 hover:border-amber-500 hover:bg-stone-50/50 dark:hover:bg-stone-800/60 text-right transition-all duration-200 max-w-[280px] w-full shadow-sm cursor-pointer"
                    type="button"
                  >
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-stone-400 group-hover:text-amber-500 transition-colors">
                      Siguiente <ChevronRight className="size-3.5" />
                    </span>
                    <span className="text-sm font-semibold text-stone-800 dark:text-stone-200 truncate w-full group-hover:text-stone-900 dark:group-hover:text-white">
                      Cap. {nextChapter.number}: {nextChapter.title}
                    </span>
                  </button>
                ) : (
                  <div className="w-full max-w-[280px]" />
                )}
              </div>
            </article>

            <TableOfContents content={activeChapter.content} chapterId={activeChapter.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function ChapterLayout() {
  const { chapterId } = useParams();
  const needsPyodide = chapterId ? SANDBOX_CHAPTERS.has(chapterId) : false;

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
