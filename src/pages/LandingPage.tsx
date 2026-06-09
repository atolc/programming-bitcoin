import { useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { AppHeader } from "../components/AppHeader";
import { chapters } from "../data/chapters";
import { chapterPath } from "../lib/routes";
import { getReadChapters } from "../lib/readProgress";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { GradientButton } from "@/components/ui/gradient-button";

const CHAPTERS_WITH_SANDBOX = new Set([1, 2, 3]);

function preloadPyodide() {
  import("../lib/pyodide").then((m) => m.initPyodide()).catch(() => {});
}

export function LandingPage() {
  const readChapters = useMemo(() => getReadChapters(), []);
  const firstChapter = chapters[0];

  return (
    <div className="app-shell min-h-screen relative overflow-hidden bg-background text-foreground transition-colors duration-300">
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />

      <AppHeader />

      <main className="relative z-10 mx-auto max-w-8xl px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
        <section className="max-w-3xl mx-auto text-center mb-20">
          <h2 className="mt-6 text-5xl sm:text-6xl font-extrabold tracking-tight pb-1 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 bg-clip-text text-transparent">
            Programming Bitcoin
          </h2>
          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Guía de estudio interactiva basada en el aclamado libro de Jimmy Song. Explora los 14 capítulos
            con código Python ejecutable en el navegador, quizzes de autoevaluación y notas clave.
          </p>
          <div className="mt-10 flex items-center justify-center">
            {firstChapter ? (
              <GradientButton render={<Link to={chapterPath(firstChapter.id)} />}>
                Empezar Capítulo 1
                <ArrowRight className="size-4" />
              </GradientButton>
            ) : null}
          </div>
        </section>

        <section>
          <div className="flex items-end justify-between gap-4 mb-8">
            <div>
              <h3 className="text-2xl font-bold tracking-tight text-foreground">
                Capítulos del libro
              </h3>
              <p className="mt-1 text-sm text-muted-foreground">
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
                <Card
                  key={chapter.id}
                  className="group relative backdrop-blur-sm bg-card/70 transition-all duration-300 ease-out hover:border-primary/40 hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1"
                  render={<Link to={chapterPath(chapter.id)} onMouseEnter={hasSandbox ? preloadPyodide : undefined} />}
                >
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 text-white text-sm font-bold shadow-md shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
                        {chapter.number}
                      </span>
                      {isRead ? (
                        <Badge variant="success" className="gap-1 uppercase tracking-wider">
                          <CheckCircle2 className="size-3" />
                          Leído
                        </Badge>
                      ) : null}
                    </div>
                    <CardTitle className="text-lg leading-snug group-hover:text-primary transition-colors">
                      {chapter.title}
                    </CardTitle>
                    {hasSandbox ? (
                      <CardDescription className="flex items-center gap-1.5">
                        <span className="size-1.5 rounded-full bg-success animate-pulse" />
                        Incluye sandboxes Python interactivos
                      </CardDescription>
                    ) : null}
                  </CardHeader>
                  <CardContent className="pt-0">
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300">
                      Leer capítulo <ArrowRight className="size-3.5" />
                    </span>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        <footer className="mt-24 pt-8 border-t border-border text-center">
          <p className="text-sm text-muted-foreground">
            Basado en{" "}
            <em className="text-foreground/80">
              Programming Bitcoin: Learn How to Program Bitcoin from Scratch
            </em>{" "}
            por Jimmy Song.
          </p>
        </footer>
      </main>
    </div>
  );
}
