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

/**
 * Resets the Pyodide global namespace between exercise executions.
 *
 * Even though `runPythonWithTests` creates a fresh `localNamespace` per run,
 * mutations to the real global scope (e.g. `import os; os.environ[...] = ...`)
 * persist in `pyodide.globals` across executions. This function:
 *  1. Clears all user-defined keys from `pyodide.globals`, keeping only `__builtins__`.
 *  2. Removes any user-imported module names from `sys.modules` so that
 *     re-importing in the next exercise starts fresh.
 *
 * It is a no-op when Pyodide has not been initialised yet.
 */
export function resetPyodideGlobals(): void {
  if (!pyodideInstance) return;

  const pyodide = pyodideInstance;

  // Remove user-imported modules from sys.modules, preserving stdlib + core
  // Pyodide packages that cannot be cleanly re-imported.
  pyodide.runPython(`
import sys as _sys
_keep = set(_sys.stdlib_module_names) | {'_pyodide', 'pyodide', 'micropip', 'packaging'}
_to_remove = [k for k in list(_sys.modules.keys()) if k.split('.')[0] not in _keep]
for _k in _to_remove:
    _sys.modules.pop(_k, None)
del _keep, _to_remove
`);

  // Clear the global namespace back to just __builtins__.
  const builtins = pyodide.globals.get("__builtins__");
  pyodide.globals.clear();
  pyodide.globals.set("__builtins__", builtins);
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
