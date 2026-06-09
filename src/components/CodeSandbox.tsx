import { useEffect, useState } from "react";
import { Play, RotateCcw, Terminal, Check, Copy, Loader2 } from "lucide-react";
import { codeToHtml } from "shiki";
import { usePyodideOptional } from "./PyodideProvider";
import { cn } from "../lib/utils";

interface CodeSandboxProps {
  code: string;
  expectedOutput?: string;
  filename?: string;
}

function normalizeOutput(text: string) {
  return text.trim().replace(/\r\n/g, "\n");
}

function outputsMatch(actual: string, expected: string) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

export function CodeSandbox({
  code,
  expectedOutput = "",
  filename = "main.py",
}: CodeSandboxProps) {
  const pyodide = usePyodideOptional();
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function highlight() {
      try {
        const highlighted = await codeToHtml(code, {
          lang: "python",
          theme: "github-dark",
        });
        if (isMounted) setHtml(highlighted);
      } catch (err) {
        console.error("Shiki highlight error:", err);
        if (isMounted) setHtml("");
      }
    }
    highlight();
    return () => { isMounted = false; };
  }, [code]);

  useEffect(() => {
    if (!pyodide || pyodide.status === "ready" || pyodide.status === "loading") return;
    setIsPreloading(true);
    pyodide.ensureReady().finally(() => setIsPreloading(false));
  }, [pyodide]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRun = async () => {
    if (!pyodide) {
      setError("Motor Python no disponible");
      setHasRun(true);
      return;
    }

    setIsRunning(true);
    setError(null);
    setStdout("");
    setStderr("");

    try {
      const result = await pyodide.runPython(code);
      setStdout(result.stdout);
      setStderr(result.stderr);
      setError(result.error ?? null);
      setHasRun(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
      setHasRun(true);
    } finally {
      setIsRunning(false);
    }
  };

  const handleReset = () => {
    setHasRun(false);
    setStdout("");
    setStderr("");
    setError(null);
  };

  const pyodideLoading = pyodide?.status === "loading" || isPreloading;
  const pyodideReady = pyodide?.status === "ready";
  const matchExpected =
    hasRun && !error && expectedOutput
      ? outputsMatch(stdout, expectedOutput)
      : null;

  return (
    <div className="relative my-8 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl bg-stone-950 text-stone-100 font-sans not-prose">
      <div className="flex items-center justify-between px-4 py-3 bg-stone-900 border-b border-stone-800">
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-rose-500/80" />
          <div className="size-3 rounded-full bg-amber-500/80" />
          <div className="size-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-stone-400 select-none">
            {filename}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
            title="Copiar código"
            type="button"
          >
            {copied ? (
              <>
                <Check className="size-3.5 text-emerald-400" />
                <span>Copiado</span>
              </>
            ) : (
              <>
                <Copy className="size-3.5" />
                <span>Copiar</span>
              </>
            )}
          </button>

          {!hasRun ? (
            <button
              onClick={handleRun}
              disabled={isRunning || pyodideLoading}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-stone-950 text-xs font-bold transition-all active:scale-95 cursor-pointer disabled:cursor-not-allowed"
              type="button"
            >
              {isRunning || pyodideLoading ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Play className="size-3.5 fill-current" />
              )}
              <span>
                {pyodideLoading
                  ? "Cargando Python..."
                  : isRunning
                    ? "Ejecutando..."
                    : "Ejecutar"}
              </span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-all active:scale-95 cursor-pointer"
              type="button"
            >
              <RotateCcw className="size-3.5" />
              <span>Reiniciar</span>
            </button>
          )}
        </div>
      </div>

      {pyodideLoading && !pyodideReady ? (
        <div className="px-4 py-2 bg-amber-950/40 border-b border-stone-800 text-xs text-amber-300 flex items-center gap-2">
          <Loader2 className="size-3.5 animate-spin" />
          {pyodide?.statusMessage || "Preparando entorno Python..."}
        </div>
      ) : null}

      <div className="relative">
        {html ? (
          <div
            className="p-5 font-mono text-sm overflow-x-auto [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0 text-stone-100 max-h-[350px]"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        ) : (
          <div className="p-5 font-mono text-sm overflow-x-auto text-stone-100 max-h-[350px]">
            <pre className="!bg-transparent !m-0 !p-0"><code>{code}</code></pre>
          </div>
        )}
      </div>

      <div className="border-t border-stone-800 bg-stone-900/60 backdrop-blur-sm">
        <div className="flex items-center justify-between px-4 py-2 bg-stone-900/90 text-xs font-mono text-stone-400 border-b border-stone-800">
          <div className="flex items-center gap-1.5">
            <Terminal className="size-3.5" />
            <span>Consola</span>
          </div>
          {matchExpected !== null ? (
            <span
              className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider",
                matchExpected
                  ? "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50"
                  : "bg-amber-950/60 text-amber-400 border border-amber-800/50",
              )}
            >
              {matchExpected ? "Coincide" : "Difiere"}
            </span>
          ) : null}
        </div>

        <div className="p-4 min-h-[72px] font-mono text-xs text-stone-300 leading-relaxed">
          {isRunning ? (
            <div className="flex items-center gap-2 text-stone-400">
              <span className="size-2 rounded-full bg-amber-500 animate-ping" />
              <span>Ejecutando script de Python...</span>
            </div>
          ) : hasRun ? (
            <div className="space-y-1">
              <div className="text-stone-500">$ python {filename}</div>
              {error ? (
                <pre className="text-red-400 whitespace-pre-wrap font-semibold">{error}</pre>
              ) : (
                <>
                  {stdout ? (
                    <pre className="text-emerald-400 whitespace-pre-wrap font-semibold">{stdout.trim()}</pre>
                  ) : null}
                  {stderr ? (
                    <pre className="text-amber-400 whitespace-pre-wrap">{stderr.trim()}</pre>
                  ) : null}
                  {!stdout && !stderr && !error ? (
                    <pre className="text-stone-500 italic">(sin salida)</pre>
                  ) : null}
                </>
              )}
              {!error ? (
                <div className="text-[10px] text-stone-500 mt-2 border-t border-stone-800/40 pt-1">
                  Process finished with exit code 0
                </div>
              ) : null}
            </div>
          ) : (
            <div className="text-stone-500 italic">
              Haz clic en &quot;Ejecutar&quot; para correr el código con Pyodide.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
