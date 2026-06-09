import { useEffect, useMemo, useRef, useState } from "react";
import {
  Routes,
  Route,
  useNavigate,
  useParams,
  useLocation,
  Navigate,
} from "react-router-dom";
import {
  BookOpen,
  FileDown,
  Menu,
  Search,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { chapters, type Chapter } from "./data/chapters";
import { MarkdownRenderer } from "./components/MarkdownRenderer";
import { TableOfContents } from "./components/TableOfContents";
import { ThemeToggle } from "./components/ThemeToggle";
import { ChapterQuiz } from "./components/ChapterQuiz";
import { parseToc } from "./lib/toc";
import { cn } from "./lib/utils";

const pdfHref =
  "./pdfs/Programming Bitcoin Learn How to Program Bitcoin from Scratch by Jimmy Song (z-lib.org).pdf";

function GithubIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
      <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
  );
}

function DocsLayout() {
  const { chapterId, sectionId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrollPercent, setScrollPercent] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Find active chapter or default to the first one
  const activeChapter = useMemo(() => {
    return (
      chapters.find((chapter) => chapter.id === chapterId) ??
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
  }, [chapterId]);

  const activeSectionTitle = useMemo(() => {
    if (!sectionId) return "";
    return (
      parseToc(activeChapter.content).find((item) => item.id === sectionId)?.text ??
      ""
    );
  }, [activeChapter.content, sectionId]);

  // Handle Ctrl+K shortcut to focus search
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

  // Track scroll progress
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
    // Reset scroll percent on chapter change
    setScrollPercent(0);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapterId]);

  // Scroll to top when switching chapters without a subtopic route
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

  // Filter chapters based on search query
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

  // Next & Previous chapters
  const activeIndex = useMemo(() => {
    return chapters.findIndex((c) => c.id === activeChapter.id);
  }, [activeChapter.id]);

  const prevChapter = activeIndex > 0 ? chapters[activeIndex - 1] : null;
  const nextChapter =
    activeIndex < chapters.length - 1 ? chapters[activeIndex + 1] : null;

  return (
    <div className="app-shell min-h-screen">
      {/* Scroll Progress Bar */}
      <div className="fixed top-0 left-0 w-full h-[3px] bg-stone-200 dark:bg-stone-800 z-50">
        <div
          className="h-full bg-amber-500 transition-all duration-75 ease-out"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Header (Top Nav) */}
      <header className="sticky top-0 z-40 border-b border-stone-200 dark:border-stone-800 bg-white/80 dark:bg-stone-900/80 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-8xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <button
              className="inline-flex size-9 items-center justify-center rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 lg:hidden text-stone-700 dark:text-stone-300 hover:bg-stone-50 dark:hover:bg-stone-800 transition-all active:scale-95 cursor-pointer"
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              aria-label="Toggle Navigation"
            >
              {menuOpen ? <X className="size-4.5" /> : <Menu className="size-4.5" />}
            </button>
            <div className="flex size-9 items-center justify-center rounded-lg bg-amber-500 text-white shadow-md shadow-amber-500/20">
              <BookOpen className="size-4.5" aria-hidden="true" />
            </div>
            <div>
              <h1 className="text-base font-semibold tracking-tight">
                Programming Bitcoin
              </h1>
              <p className="text-xs text-stone-500 dark:text-stone-400 font-medium">
                Guía de Estudio y Resúmenes
              </p>
            </div>
          </div>

          {/* Breadcrumbs for desktop */}
          <div className="hidden md:flex items-center gap-2 text-xs font-medium text-stone-500 dark:text-stone-400">
            <span>Docs</span>
            <span className="text-stone-300 dark:text-stone-700">/</span>
            <span>Capítulo {activeChapter.number}</span>
            <span className="text-stone-300 dark:text-stone-700">/</span>
            <span className="text-stone-800 dark:text-stone-200 max-w-[200px] truncate">
              {activeSectionTitle || activeChapter.title}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <a
              className="inline-flex size-9 items-center justify-center rounded-lg border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 shadow-sm hover:bg-stone-50 dark:hover:bg-stone-800 transition-all duration-200 active:scale-95"
              href={pdfHref}
              target="_blank"
              rel="noreferrer"
              title="Descargar PDF"
            >
              <FileDown className="size-4.5" aria-hidden="true" />
            </a>
            <a
              className="inline-flex size-9 items-center justify-center rounded-lg bg-stone-950 dark:bg-stone-900 text-white dark:text-stone-100 shadow-sm hover:bg-stone-800 dark:hover:bg-stone-800/80 transition-all duration-200 active:scale-95"
              href="https://github.com/caeher/programming-bitcoin"
              target="_blank"
              rel="noreferrer"
              title="Ver en GitHub"
            >
              <GithubIcon className="size-4.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <div className="mx-auto max-w-8xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-0 lg:grid-cols-[280px_1fr]">
          {/* Sidebar Drawer for mobile / Sticky Sidebar for desktop */}
          <aside
            className={cn(
              "fixed inset-0 top-16 z-30 w-full bg-white dark:bg-stone-900 lg:sticky lg:top-16 lg:block lg:h-[calc(100vh-64px)] lg:w-auto lg:border-r lg:border-stone-200 lg:dark:border-stone-800 lg:bg-transparent lg:dark:bg-transparent overflow-y-auto px-4 lg:px-0 py-6 pr-0 lg:pr-6 transition-all duration-200",
              menuOpen ? "block" : "hidden"
            )}
          >
            <div className="space-y-5 pb-8">
              {/* Premium Search Bar in Origin UI style */}
              <div className="relative">
                <span className="absolute inset-y-0 left-3 flex items-center text-stone-400 dark:text-stone-400">
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
                      className="pointer-events-auto text-stone-400 hover:text-stone-600 dark:hover:text-stone-200"
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

              {/* Navigation Chapters */}
              <nav className="space-y-1" aria-label="Capítulos">
                <p className="text-[11px] font-bold uppercase tracking-wider text-stone-400 dark:text-stone-500 px-3 mb-2">
                  Capítulos del Libro
                </p>
                {filteredChapters.length > 0 ? (
                  filteredChapters.map((chapter) => {
                    const isActive = activeChapter.id === chapter.id;
                    return (
                      <button
                        key={chapter.id}
                        className={cn(
                          "group flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-all duration-150 cursor-pointer",
                          isActive
                            ? "bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400 font-medium"
                            : "text-stone-600 dark:text-stone-400 hover:bg-stone-100/60 dark:hover:bg-stone-900/40 hover:text-stone-900 dark:hover:text-stone-200"
                        )}
                        type="button"
                        onClick={() => {
                          navigate(`/docs/${chapter.id}`);
                          setMenuOpen(false);
                        }}
                      >
                        <span
                          className={cn(
                            "flex size-5.5 shrink-0 items-center justify-center rounded text-[11px] font-bold transition-all duration-150",
                            isActive
                              ? "bg-amber-500 text-white shadow-sm shadow-amber-500/10"
                              : "bg-stone-200/80 dark:bg-stone-800 text-stone-600 dark:text-stone-400 group-hover:bg-stone-300/60 dark:group-hover:bg-stone-700 group-hover:text-stone-800 dark:group-hover:text-stone-200"
                          )}
                        >
                          {chapter.number}
                        </span>
                        <span className="leading-snug truncate">{chapter.title}</span>
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

          {/* Document Content & Right TOC */}
          <div className="grid grid-cols-1 xl:grid-cols-[1fr_256px] gap-0 py-8 lg:pl-10">
            {/* Content Article */}
            <article className="min-w-0 pr-0 xl:pr-10">
              {/* Header block inside article */}
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

              {/* Main Markdown Body */}
              <div className="min-h-[400px]">
                <MarkdownRenderer content={activeChapter.content} />
                {activeChapter.id === "capitulo-1" ? <ChapterQuiz /> : null}
              </div>

              {/* Navigation Pagination (Prev / Next) */}
              <div className="mt-16 flex flex-wrap gap-4 items-center justify-between border-t border-stone-200 dark:border-stone-800 pt-8 pb-12">
                {prevChapter ? (
                  <button
                    onClick={() => navigate(`/docs/${prevChapter.id}`)}
                    className="group flex flex-col items-start gap-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4.5 hover:border-amber-500 hover:bg-stone-50/50 dark:hover:bg-stone-800/60 text-left transition-all duration-200 max-w-[280px] w-full shadow-sm cursor-pointer"
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
                    onClick={() => navigate(`/docs/${nextChapter.id}`)}
                    className="group flex flex-col items-end gap-1 rounded-xl border border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-900 p-4.5 hover:border-amber-500 hover:bg-stone-50/50 dark:hover:bg-stone-800/60 text-right transition-all duration-200 max-w-[280px] w-full shadow-sm cursor-pointer"
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

            {/* Sticky Scrollspy TOC (Desktop only) */}
            <TableOfContents content={activeChapter.content} chapterId={activeChapter.id} />
          </div>
        </div>
      </div>
    </div>
  );
}

export function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to={`/docs/${chapters[0]?.id || ""}`} replace />} />
      <Route path="/docs/:chapterId" element={<DocsLayout />} />
      <Route path="/docs/:chapterId/:sectionId" element={<DocsLayout />} />
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
