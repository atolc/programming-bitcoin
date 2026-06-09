import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { chapters } from "../data/chapters";
import { chapterPath } from "../lib/routes";
import { getReadChapters } from "../lib/readProgress";
import { cn } from "../lib/utils";

const CHAPTERS_WITH_SANDBOX = new Set([1, 2, 3]);

function preloadPyodide() {
  import("../lib/pyodide").then((m) => m.initPyodide()).catch(() => {});
}

export function LandingPage() {
  const readChapters = useMemo(() => getReadChapters(), []);
  const firstChapter = chapters[0];

  return (
    <div className="app-shell min-h-screen relative overflow-hidden bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors duration-300">
      {/* Decorative blurred backgrounds */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-amber-500/10 dark:bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 dark:bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

      <AppHeader />

      <main className="relative z-10 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        {/* Hero */}
        <section className="max-w-3xl mx-auto text-center mb-20">
          <span className="inline-flex items-center rounded-full bg-amber-500/10 dark:bg-amber-500/5 px-4 py-1.5 text-xs font-semibold text-amber-600 dark:text-amber-400 border border-amber-500/20 dark:border-amber-500/10 shadow-sm">
            Resúmenes interactivos en español
          </span>
          <h2 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight pb-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            Programming Bitcoin
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-stone-600 dark:text-stone-400 leading-relaxed max-w-2xl mx-auto">
            Guía de estudio interactiva basada en el aclamado libro de Jimmy Song. Explora los 14 capítulos
            con código Python ejecutable en el navegador, quizzes de autoevaluación y notas clave.
          </p>
          <div className="mt-10 flex items-center justify-center">
            {firstChapter ? (
              <Link
                to={chapterPath(firstChapter.id)}
                className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-3.5 text-sm font-bold text-stone-950 shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Empezar Capítulo 1
                <ArrowRight className="size-4" />
              </Link>
            ) : null}
          </div>
        </section>

        {/* Chapter Grid */}
        <section>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-stone-900 dark:text-white">
                Capítulos del libro
              </h3>
              <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                {chapters.length} capítulos listos para explorar
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {chapters.map((chapter) => {
              const isRead =
                readChapters.has(chapter.id) ||
                chapter.aliases.some((alias) => readChapters.has(alias));
              const hasSandbox = CHAPTERS_WITH_SANDBOX.has(chapter.number);

              return (
                <Link
                  key={chapter.id}
                  to={chapterPath(chapter.id)}
                  onMouseEnter={hasSandbox ? preloadPyodide : undefined}
                  className={cn(
                    "group relative flex flex-col rounded-2xl border border-stone-200/80 dark:border-stone-800/80 bg-white/70 dark:bg-stone-900/70 backdrop-blur-sm p-6 shadow-sm",
                    "hover:border-amber-500/40 dark:hover:border-amber-500/30 hover:shadow-xl hover:shadow-amber-500/5 dark:hover:shadow-amber-500/2 hover:-translate-y-1 transition-all duration-300 ease-out",
                  )}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-bold shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                      {chapter.number}
                    </span>
                    {isRead ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 dark:bg-emerald-500/5 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 dark:border-emerald-500/10">
                        <CheckCircle2 className="size-3" />
                        Leído
                      </span>
                    ) : null}
                  </div>
                  <h4 className="mt-4 text-lg font-bold text-stone-900 dark:text-stone-100 leading-snug group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors">
                    {chapter.title}
                  </h4>
                  {hasSandbox ? (
                    <p className="mt-2.5 text-xs text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
                      <span className="size-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Incluye sandboxes Python interactivos
                    </p>
                  ) : null}
                  <span className="mt-auto pt-6 inline-flex items-center gap-1 text-xs font-semibold text-amber-500 dark:text-amber-400 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                    Leer capítulo <ArrowRight className="size-3.5" />
                  </span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-24 pt-8 border-t border-stone-200 dark:border-stone-800 text-center">
          <p className="text-sm text-stone-500 dark:text-stone-400">
            Basado en{" "}
            <em className="text-stone-700 dark:text-stone-300">
              Programming Bitcoin: Learn How to Program Bitcoin from Scratch
            </em>{" "}
            por Jimmy Song.
          </p>
        </footer>
      </main>
    </div>
  );
}
