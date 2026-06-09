import { useEffect, useState } from "react";
import { Play, RotateCcw, Terminal, Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";

interface CodeSandboxProps {
  code: string;
  output: string;
  filename?: string;
}

export function CodeSandbox({ code, output, filename = "main.py" }: CodeSandboxProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [hasRun, setHasRun] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function highlight() {
      try {
        const highlighted = await codeToHtml(code, {
          lang: "python",
          theme: "github-dark",
        });
        if (isMounted) {
          setHtml(highlighted);
        }
      } catch (err) {
        console.error("Shiki highlight error:", err);
        if (isMounted) {
          setHtml("");
        }
      }
    }
    highlight();
    return () => {
      isMounted = false;
    };
  }, [code]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasRun(true);
    }, 800); // Simulated delay for visual feedback
  };

  const handleReset = () => {
    setHasRun(false);
  };

  return (
    <div className="relative my-8 rounded-xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl bg-stone-950 text-stone-100 font-sans">
      {/* Window Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-stone-900 border-b border-stone-800">
        {/* macOS style buttons */}
        <div className="flex items-center gap-2">
          <div className="size-3 rounded-full bg-rose-500/80" />
          <div className="size-3 rounded-full bg-amber-500/80" />
          <div className="size-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs font-mono text-stone-400 select-none">
            {filename}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
            title="Copiar código"
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
              disabled={isRunning}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-500 hover:bg-amber-600 disabled:bg-amber-500/50 text-stone-950 text-xs font-bold transition-all active:scale-95 cursor-pointer"
            >
              <Play className="size-3.5 fill-current" />
              <span>{isRunning ? "Ejecutando..." : "Ejecutar"}</span>
            </button>
          ) : (
            <button
              onClick={handleReset}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs font-medium transition-all active:scale-95 cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>Reiniciar</span>
            </button>
          )}
        </div>
      </div>

      {/* Editor Body */}
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

      {/* Terminal Output */}
      <div className="border-t border-stone-800 bg-stone-900/60 backdrop-blur-sm">
        <div className="flex items-center gap-1.5 px-4 py-2 bg-stone-900/90 text-xs font-mono text-stone-400 border-b border-stone-800">
          <Terminal className="size-3.5" />
          <span>Consola</span>
        </div>
        
        <div className="p-4 min-h-[72px] font-mono text-xs text-stone-300 leading-relaxed select-none">
          {isRunning ? (
            <div className="flex items-center gap-2 text-stone-400">
              <span className="size-2 rounded-full bg-amber-500 animate-ping" />
              <span>Ejecutando script de Python...</span>
            </div>
          ) : hasRun ? (
            <div className="space-y-1">
              <div className="text-stone-500">$ python {filename}</div>
              <pre className="text-emerald-400 whitespace-pre-wrap font-semibold">{output.trim()}</pre>
              <div className="text-[10px] text-stone-500 mt-2 border-t border-stone-800/40 pt-1">
                Process finished with exit code 0
              </div>
            </div>
          ) : (
            <div className="text-stone-500 italic flex items-center justify-between">
              <span>Haz clic en "Ejecutar" para ver la salida en consola.</span>
              <span className="text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded border border-stone-800 text-stone-600 bg-stone-950/20">
                Solo Lectura
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
