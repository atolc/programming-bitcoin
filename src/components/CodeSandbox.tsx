import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Play, RotateCcw, Check, Copy, Loader2, Edit2, Eye } from "lucide-react";
import { usePyodideOptional } from "./PyodideProvider";
import { PythonEditorPanel } from "./PythonEditorPanel";
import { PythonConsole } from "./PythonConsole";
import { outputsMatch } from "@/lib/pyodide";
import { Alert, AlertDescription } from "@/components/ui/alert";
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

export function CodeSandbox({
  code,
  expectedOutput = "",
  filename = "main.py",
}: CodeSandboxProps) {
  const { t } = useTranslation();
  const pyodide = usePyodideOptional();
  const [currentCode, setCurrentCode] = useState(code);
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);
  const [stdout, setStdout] = useState("");
  const [stderr, setStderr] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPreloading, setIsPreloading] = useState(false);

  useEffect(() => {
    setCurrentCode(code);
  }, [code]);

  useEffect(() => {
    if (!pyodide || pyodide.status === "ready" || pyodide.status === "loading") return;
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
      const result = await pyodide.runPython(currentCode);
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
    setCurrentCode(code);
    setHasRun(false);
    setStdout("");
    setStderr("");
    setError(null);
    pyodide?.resetGlobals();
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
          <Button
            className="border-stone-700 bg-stone-800 text-stone-300 hover:bg-stone-700 hover:text-white"
            onClick={() => setIsEditing(!isEditing)}
            size="sm"
            type="button"
            variant="outline"
          >
            {isEditing ? (
              <>
                <Eye className="size-3.5" />
                <span>{t("code.preview")}</span>
              </>
            ) : (
              <>
                <Edit2 className="size-3.5" />
                <span>{t("code.edit")}</span>
              </>
            )}
          </Button>

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

      <div className="relative h-[250px]">
        <PythonEditorPanel
          code={currentCode}
          onChange={setCurrentCode}
          isEditing={isEditing}
          height="250px"
        />
      </div>

      <PythonConsole
        filename={filename}
        isRunning={isRunning}
        hasRun={hasRun}
        stdout={stdout}
        stderr={stderr}
        error={error}
        matchExpected={matchExpected}
      />
    </div>
  );
}
