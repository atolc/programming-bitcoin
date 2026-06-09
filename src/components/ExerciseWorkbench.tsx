import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Play,
  RotateCcw,
  Check,
  Copy,
  Loader2,
  Eye,
  EyeOff,
} from "lucide-react";
import { MarkdownRenderer } from "./MarkdownRenderer";
import { CodeBlock } from "./CodeBlock";
import { PythonEditorPanel } from "./PythonEditorPanel";
import { PythonConsole } from "./PythonConsole";
import { usePyodide } from "./PyodideProvider";
import {
  getLocalizedExerciseContent,
  type Exercise,
} from "@/data/exercises";
import { outputsMatch } from "@/lib/pyodide";
import type {
  PythonRunResult,
  PythonRunWithTestsResult,
} from "@/lib/pyodide";
import {
  markExerciseAttempted,
  markExercisePassed,
} from "@/lib/practiceProgress";
import type { Locale } from "@/lib/locale";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ExerciseWorkbenchProps = {
  exercise: Exercise;
  locale: Locale;
};

const KIND_LABELS: Record<Exercise["kind"], { en: string; es: string }> = {
  book: { en: "Book exercise", es: "Ejercicio del libro" },
  coding: { en: "Coding", es: "Programación" },
  demo: { en: "Demo", es: "Demo" },
  math: { en: "Math", es: "Matemáticas" },
};

export function ExerciseWorkbench({ exercise, locale }: ExerciseWorkbenchProps) {
  const { t } = useTranslation();
  const pyodide = usePyodide();
  const content = getLocalizedExerciseContent(exercise, locale);
  const [currentCode, setCurrentCode] = useState(exercise.starterCode);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    setCurrentCode(exercise.starterCode);
    setHasRun(false);
    setStdout("");
    setStderr("");
    setError(null);
    setPassed(null);
    setShowSolution(false);
  }, [exercise.id, exercise.starterCode]);

  useEffect(() => {
    if (pyodide.status === "ready" || pyodide.status === "loading") return;
    setIsPreloading(true);
    pyodide.ensureReady().finally(() => setIsPreloading(false));
  }, [pyodide]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(currentCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRun = async () => {
    if (exercise.offline) return;

    setIsRunning(true);
    setError(null);
    setStdout("");
    setStderr("");
    setPassed(null);
    markExerciseAttempted(exercise.id);

    const timeoutMs = exercise.timeoutMs ?? 10000;
    const { mode, expectedOutput, testCode } = exercise.validation;

    try {
      let result: PythonRunResult | PythonRunWithTestsResult;
      if (mode === "tests" && testCode) {
        result = await pyodide.runPythonWithTests(
          currentCode,
          testCode,
          timeoutMs,
        );
      } else {
        result = await pyodide.runPython(currentCode, timeoutMs);
      }

      setStdout(result.stdout);
      setStderr(result.stderr);
      setError(result.error ?? null);
      setHasRun(true);

      if (mode === "tests" && testCode) {
        const testPassed = !result.error && result.passed === true;
        setPassed(testPassed);
        if (testPassed) markExercisePassed(exercise.id);
      } else if (mode === "stdout" && expectedOutput) {
        const outputPassed =
          !result.error && outputsMatch(result.stdout, expectedOutput);
        setPassed(outputPassed);
        if (outputPassed) markExercisePassed(exercise.id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setHasRun(true);
      setPassed(false);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setCurrentCode(exercise.starterCode);
    setHasRun(false);
    setStdout("");
    setStderr("");
    setError(null);
    setPassed(null);
  };

  const pyodideLoading = pyodide.status === "loading" || isPreloading;
  const pyodideReady = pyodide.status === "ready";
  const kindLabel = KIND_LABELS[exercise.kind][locale];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,45%)_minmax(0,55%)] gap-6 lg:gap-0 lg:divide-x lg:divide-border min-h-[calc(100vh-12rem)]">
      <section
        aria-label={t("exercise.panelInstructions")}
        className="lg:pr-6 space-y-4"
      >
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">{kindLabel}</Badge>
          {exercise.bookRef ? (
            <Badge variant="secondary">{exercise.bookRef}</Badge>
          ) : null}
          {exercise.offline ? (
            <Badge variant="warning">{t("exercise.offline")}</Badge>
          ) : null}
        </div>

        <h2 className="text-2xl font-bold tracking-tight">{content.title}</h2>

        <MarkdownRenderer content={content.prompt} />

        {exercise.exampleCode ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t("exercise.example")}
            </h3>
            <CodeBlock code={exercise.exampleCode} lang="python" />
          </div>
        ) : content.example ? (
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              {t("exercise.example")}
            </h3>
            <MarkdownRenderer content={content.example} />
          </div>
        ) : null}

        {exercise.offline ? (
          <Alert variant="warning">
            <AlertDescription>{t("exercise.offlineDescription")}</AlertDescription>
          </Alert>
        ) : null}
      </section>

      <section
        aria-label={t("exercise.panelEditor")}
        className="lg:pl-6 flex flex-col min-h-[480px]"
      >
        <div className="flex-1 rounded-xl overflow-hidden border border-stone-800 shadow-xl bg-stone-950 text-stone-100 font-sans flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 bg-stone-900 border-b border-stone-800 shrink-0">
            <div className="flex items-center gap-2">
              <div className="size-3 rounded-full bg-rose-500/80" />
              <div className="size-3 rounded-full bg-amber-500/80" />
              <div className="size-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-stone-400 select-none">
                main.py
              </span>
            </div>

            <div className="flex items-center gap-2">
              <Button
                className="border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white"
                onClick={handleCopy}
                size="sm"
                type="button"
                variant="outline"
              >
                {copied ? (
                  <Check className="size-3.5 text-emerald-400" />
                ) : (
                  <Copy className="size-3.5" />
                )}
              </Button>

              {!exercise.offline ? (
                <>
                  <Button
                    className="border-transparent bg-primary text-primary-foreground hover:bg-primary/90"
                    disabled={isRunning || pyodideLoading}
                    onClick={handleRun}
                    size="sm"
                    type="button"
                  >
                    {isRunning || pyodideLoading ? (
                      <Loader2 className="size-3.5 animate-spin" />
                    ) : (
                      <Play className="size-3.5 fill-current" />
                    )}
                    <span>
                      {pyodideLoading
                        ? t("code.loadingPython")
                        : isRunning
                          ? t("code.running")
                          : t("code.run")}
                    </span>
                  </Button>
                  {hasRun ? (
                    <Button
                      className="border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700"
                      onClick={handleReset}
                      size="sm"
                      type="button"
                      variant="outline"
                    >
                      <RotateCcw className="size-3.5" />
                      <span>{t("code.reset")}</span>
                    </Button>
                  ) : null}
                </>
              ) : null}
            </div>
          </div>

          {pyodideLoading && !pyodideReady && !exercise.offline ? (
            <Alert
              className="rounded-none border-x-0 border-t-0 border-b-stone-800 bg-amber-950/40 text-amber-300"
              variant="warning"
            >
              <Loader2 className="size-3.5 animate-spin" />
              <AlertDescription>
                {pyodide.statusMessage || t("code.preparing")}
              </AlertDescription>
            </Alert>
          ) : null}

          <div className="flex-1 min-h-[280px]">
            <PythonEditorPanel
              code={currentCode}
              onChange={setCurrentCode}
              isEditing={!exercise.offline}
              height="280px"
              readOnly={exercise.offline}
            />
          </div>

          {!exercise.offline ? (
            <PythonConsole
              isRunning={isRunning}
              hasRun={hasRun}
              stdout={stdout}
              stderr={stderr}
              error={error}
              passed={
                exercise.validation.mode === "none" ? null : passed
              }
            />
          ) : exercise.solution ? (
            <div className="border-t border-stone-800 p-4">
              <Button
                className="border-stone-700 bg-stone-800 text-stone-300"
                onClick={() => setShowSolution(!showSolution)}
                size="sm"
                type="button"
                variant="outline"
              >
                {showSolution ? (
                  <EyeOff className="size-3.5" />
                ) : (
                  <Eye className="size-3.5" />
                )}
                <span>{t("exercise.showSolution")}</span>
              </Button>
              {showSolution ? (
                <pre className="mt-3 p-3 rounded-lg bg-stone-900 text-xs text-stone-300 overflow-x-auto">
                  {exercise.solution}
                </pre>
              ) : null}
            </div>
          ) : null}
        </div>

        {exercise.solution && !exercise.offline ? (
          <div className="mt-3">
            <Button
              onClick={() => setShowSolution(!showSolution)}
              size="sm"
              type="button"
              variant="ghost"
            >
              {showSolution ? (
                <EyeOff className="size-3.5" />
              ) : (
                <Eye className="size-3.5" />
              )}
              <span>{t("exercise.showSolution")}</span>
            </Button>
            {showSolution ? (
              <CodeBlock code={exercise.solution} lang="python" />
            ) : null}
          </div>
        ) : null}
      </section>
    </div>
  );
}
