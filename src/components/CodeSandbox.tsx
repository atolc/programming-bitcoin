import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, RotateCcw, Terminal, Check, Copy, Loader2 } from "lucide-react";
import { codeToHtml } from "shiki";
import { usePyodideOptional } from "./PyodideProvider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipPopup,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const { t } = useTranslation();
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
      setError(t("code.pythonUnavailable"));
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
    <div className="relative my-8 rounded-xl overflow-hidden border border-stone-800 shadow-xl bg-stone-950 text-stone-100 font-sans not-prose">
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
          <Tooltip>
            <TooltipTrigger
              render={
                <Button
                  className="border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white"
                  onClick={handleCopy}
                  size="sm"
                  type="button"
                  variant="outline"
                />
              }
            >
              {copied ? (
                <>
                  <Check className="size-3.5 text-emerald-400" />
                  <span>{t("code.copied")}</span>
                </>
              ) : (
                <>
                  <Copy className="size-3.5" />
                  <span>{t("code.copyShort")}</span>
                </>
              )}
            </TooltipTrigger>
            <TooltipPopup>{t("code.copy")}</TooltipPopup>
          </Tooltip>

          {!hasRun ? (
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
          ) : (
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
          )}
        </div>
      </div>

      {pyodideLoading && !pyodideReady ? (
        <Alert
          className="rounded-none border-x-0 border-t-0 border-b-stone-800 bg-amber-950/40 text-amber-300"
          variant="warning"
        >
          <Loader2 className="size-3.5 animate-spin" />
          <AlertDescription>
            {pyodide?.statusMessage || t("code.preparing")}
          </AlertDescription>
        </Alert>
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
            <span>{t("code.console")}</span>
          </div>
          {matchExpected !== null ? (
            <Badge
              className="uppercase tracking-wider"
              variant={matchExpected ? "success" : "warning"}
            >
              {matchExpected ? t("code.match") : t("code.mismatch")}
            </Badge>
          ) : null}
        </div>

        <div className="p-4 min-h-[72px] font-mono text-xs text-stone-300 leading-relaxed">
          {isRunning ? (
            <div className="flex items-center gap-2 text-stone-400">
              <span className="size-2 rounded-full bg-primary animate-ping" />
              <span>{t("code.runningScript")}</span>
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
                    <pre className="text-stone-500 italic">{t("code.noOutput")}</pre>
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
              {t("code.clickRun")}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
