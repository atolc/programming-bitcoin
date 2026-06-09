import { useEffect, useState } from "react";
import { Check, Copy } from "lucide-react";
import { codeToHtml } from "shiki";

interface CodeBlockProps {
  code: string;
  lang?: string;
}

export function CodeBlock({ code, lang = "python" }: CodeBlockProps) {
  const [html, setHtml] = useState<string>("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let isMounted = true;
    async function highlight() {
      try {
        const highlighted = await codeToHtml(code, {
          lang: lang || "python",
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
  }, [code, lang]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="relative group my-6 rounded-lg overflow-hidden border border-stone-800 shadow-lg bg-stone-950">
      <div className="absolute right-3 top-3 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleCopy}
          className="flex size-8 items-center justify-center rounded border border-stone-700 bg-stone-800/80 backdrop-blur-sm text-stone-300 hover:bg-stone-700 hover:text-white transition-all active:scale-95 cursor-pointer"
          title="Copiar código"
        >
          {copied ? <Check className="size-4 text-emerald-400" /> : <Copy className="size-4" />}
        </button>
      </div>
      <div className="flex items-center justify-between px-4 py-1.5 bg-stone-900 border-b border-stone-800 text-xs font-mono text-stone-400">
        <span>{lang}</span>
      </div>
      {html ? (
        <div 
          className="p-4 font-mono text-sm overflow-x-auto [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0 text-stone-100"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="p-4 font-mono text-sm overflow-x-auto text-stone-100">
          <pre className="!bg-transparent !m-0 !p-0"><code>{code}</code></pre>
        </div>
      )}
    </div>
  );
}
