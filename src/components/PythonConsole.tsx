import { Terminal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Badge } from "@/components/ui/badge";

type PythonConsoleProps = {
  filename?: string;
  isRunning: boolean;
  hasRun: boolean;
  stdout: string;
  stderr: string;
  error: string | null;
  matchExpected?: boolean | null;
  passed?: boolean | null;
};

export function PythonConsole({
  filename = "main.py",
  isRunning,
  hasRun,
  stdout,
  stderr,
  error,
  matchExpected = null,
  passed = null,
}: PythonConsoleProps) {
  const { t } = useTranslation();

  const statusBadge =
    passed !== null ? (
      <Badge
        className="uppercase tracking-wider"
        variant={passed ? "success" : "warning"}
      >
        {passed ? t("exercise.pass") : t("exercise.fail")}
      </Badge>
    ) : matchExpected !== null ? (
      <Badge
        className="uppercase tracking-wider"
        variant={matchExpected ? "success" : "warning"}
      >
        {matchExpected ? t("code.match") : t("code.mismatch")}
      </Badge>
    ) : null;

  return (
    <div className="border-t border-stone-800 bg-stone-900/60 backdrop-blur-sm">
      <div className="flex items-center justify-between px-4 py-2 bg-stone-900/90 text-xs font-mono text-stone-400 border-b border-stone-800">
        <div className="flex items-center gap-1.5">
          <Terminal className="size-3.5" />
          <span>{t("code.console")}</span>
        </div>
        {statusBadge}
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
                {t("code.exitCode")}
              </div>
            ) : null}
          </div>
        ) : (
          <div className="text-stone-500 italic">{t("code.clickRun")}</div>
        )}
      </div>
    </div>
  );
}
