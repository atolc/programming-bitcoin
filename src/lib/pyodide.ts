import type { PyodideInterface } from "pyodide";
import i18n from "../i18n";

export type PyodideStatus = "idle" | "loading" | "ready" | "error";

let pyodideInstance: PyodideInterface | null = null;
let loadPromise: Promise<PyodideInterface> | null = null;
let loadError: Error | null = null;

export async function initPyodide(
  onStatus?: (message: string) => void,
): Promise<PyodideInterface> {
  if (pyodideInstance) return pyodideInstance;
  if (loadError) throw loadError;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    onStatus?.(i18n.t("pyodide.downloading"));
    const { loadPyodide } = await import("pyodide");
    const pyodide = await loadPyodide({
      indexURL: "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/",
    });
    onStatus?.(i18n.t("pyodide.preparing"));
    pyodideInstance = pyodide;
    return pyodide;
  })().catch((err: unknown) => {
    loadError = err instanceof Error ? err : new Error(String(err));
    loadPromise = null;
    throw loadError;
  });

  return loadPromise;
}

export function getPyodideInstance(): PyodideInterface | null {
  return pyodideInstance;
}

export type PythonRunResult = {
  stdout: string;
  stderr: string;
  error?: string;
};

export async function runPython(
  code: string,
  timeoutMs = 5000,
): Promise<PythonRunResult> {
  const pyodide = await initPyodide();
  let stdout = "";
  let stderr = "";

  pyodide.setStdout({ batched: (msg) => { stdout += msg; } });
  pyodide.setStderr({ batched: (msg) => { stderr += msg; } });

  const runTask = pyodide.runPythonAsync(code);

  const timeout = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(i18n.t("pyodide.timeout"))), timeoutMs);
  });

  try {
    await Promise.race([runTask, timeout]);
    return { stdout, stderr };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { stdout, stderr, error: message };
  }
}
