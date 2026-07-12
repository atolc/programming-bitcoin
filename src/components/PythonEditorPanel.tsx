import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";
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
  // Use Monaco editor in readOnly mode instead of shiki + dangerouslySetInnerHTML.
  // This eliminates:
  //  1. The XSS risk from dangerouslySetInnerHTML (even though shiki escapes HTML,
  //     explicit sanitization was still required for safety).
  //  2. The race condition where rapid code changes caused stale async codeToHtml()
  //     promises to resolve out-of-order and overwrite the correct highlighted output.
  // By using a single Monaco instance with the readOnly option, we unify the rendering
  // path and rely on Monaco's built-in, synchronous syntax highlighting.
  const editorRef = useRef<Parameters<NonNullable<React.ComponentProps<typeof Editor>["onMount"]>>[0] | null>(null);

  // Keep track of the previous isEditing value so we can programmatically
  // update the editor's readOnly option when it changes at runtime.
  const prevIsEditingRef = useRef(isEditing);

  useEffect(() => {
    if (!editorRef.current) return;
    if (prevIsEditingRef.current !== isEditing) {
      editorRef.current.updateOptions({ readOnly: !isEditing });
      prevIsEditingRef.current = isEditing;
    }
  }, [isEditing]);

  const [isLoading, setIsLoading] = useState(true);

  return (
    <div className="h-full w-full bg-stone-950 pt-2 pb-1" style={{ minHeight: height }}>
      <Editor
        height={height}
        defaultLanguage="python"
        language="python"
        theme="vs-dark"
        value={code}
        onChange={(value) => {
          if (!isEditing) return; // guard: ignore onChange events in read-only mode
          onChange(value ?? "");
        }}
        onMount={(editor) => {
          editorRef.current = editor;
          setIsLoading(false);
        }}
        options={{
          minimap: { enabled: false },
          fontSize: 14,
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          readOnly: !isEditing || readOnly,
          padding: { top: 8, bottom: 8 },
          // Hide the cursor in read-only mode to make it feel like a static viewer
          cursorStyle: !isEditing ? "line-thin" : "line",
          renderLineHighlight: !isEditing ? "none" : "line",
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
