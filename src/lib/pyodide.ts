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
  passed?: boolean;
};

export function normalizeOutput(text: string) {
  return text.trim().replace(/\r\n/g, "\n");
}

export function outputsMatch(actual: string, expected: string) {
  return normalizeOutput(actual) === normalizeOutput(expected);
}

export type PythonRunWithTestsResult = PythonRunResult & {
  passed?: boolean;
};

export async function runPython(
  code: string,
  timeoutMs = 5000,
): Promise<PythonRunResult> {
  const result = await runPythonWithTests(code, undefined, timeoutMs);
  return {
    stdout: result.stdout,
    stderr: result.stderr,
    error: result.error,
  };
}

export async function runPythonWithTests(
  userCode: string,
  testCode?: string,
  timeoutMs = 5000,
): Promise<PythonRunWithTestsResult> {
  const pyodide = await initPyodide();
  let stdout = "";
  let stderr = "";

  pyodide.setStdout({ batched: (msg) => { stdout += msg; } });
  pyodide.setStderr({ batched: (msg) => { stderr += msg; } });

  const localNamespace = pyodide.runPython("{}");

  const runWithTimeout = async (code: string) => {
    const runTask = pyodide.runPythonAsync(code, { globals: localNamespace });
    const timeout = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error(i18n.t("pyodide.timeout"))), timeoutMs);
    });
    const result = await Promise.race([runTask, timeout]);
    if (result && typeof result.destroy === "function") {
      result.destroy();
    }
  };

  try {
    await runWithTimeout(userCode);

    if (testCode) {
      try {
        await runWithTimeout(testCode);
        return { stdout, stderr, passed: true };
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        return { stdout, stderr, error: message, passed: false };
      }
    }

    return { stdout, stderr };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { stdout, stderr, error: message, passed: false };
  } finally {
    localNamespace.destroy();
  }
}
