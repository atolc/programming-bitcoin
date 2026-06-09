import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { codeToHtml } from "shiki";
import Editor from "@monaco-editor/react";

type PythonEditorPanelProps = {
  code: string;
  onChange: (code: string) => void;
  isEditing?: boolean;
  height?: string;
  readOnly?: boolean;
};

export function PythonEditorPanel({
  code,
  onChange,
  isEditing = true,
  height = "100%",
  readOnly = false,
}: PythonEditorPanelProps) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    if (isEditing) return;
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
  }, [code, isEditing]);

  if (isEditing) {
    return (
      <div className="h-full w-full bg-stone-950 pt-2 pb-1" style={{ minHeight: height }}>
        <Editor
          height={height}
          defaultLanguage="python"
          language="python"
          theme="vs-dark"
          value={code}
          onChange={(value) => onChange(value ?? "")}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            lineNumbers: "on",
            scrollBeyondLastLine: false,
            automaticLayout: true,
            readOnly,
            padding: { top: 8, bottom: 8 },
          }}
          loading={
            <div className="flex items-center justify-center h-full text-stone-400 font-mono text-xs gap-2">
              <Loader2 className="size-4 animate-spin" />
              <span>Loading Editor...</span>
            </div>
          }
        />
      </div>
    );
  }

  return (
    <div className="relative group h-full">
      {html ? (
        <div
          className="p-5 font-mono text-sm overflow-x-auto [&>pre]:!bg-transparent [&>pre]:!m-0 [&>pre]:!p-0 text-stone-100 max-h-full"
          dangerouslySetInnerHTML={{ __html: html }}
        />
      ) : (
        <div className="p-5 font-mono text-sm overflow-x-auto text-stone-100">
          <pre className="!bg-transparent !m-0 !p-0">
            <code>{code}</code>
          </pre>
        </div>
      )}
    </div>
  );
}
