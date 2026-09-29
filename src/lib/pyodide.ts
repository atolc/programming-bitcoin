import type { PyodideInterface } from "pyodide";
import i18n from "../i18n";
import type {
  PyodideWorkerRequest,
  PyodideWorkerResponse,
} from "./pyodide-worker-protocol";

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/";

export type PyodideStatus = "idle" | "loading" | "ready" | "error";

let pyodideInstance: PyodideInterface | null = null;
let loadPromise: Promise<PyodideInterface> | null = null;
let loadError: Error | null = null;
let pyodideWorker: Worker | null = null;
let workerReady = false;
let workerReadyPromise: Promise<void> | null = null;
let workerStatusCallback: ((message: string) => void) | null = null;
let nextWorkerRequestId = 1;

type WorkerReply = {
  response: Extract<PyodideWorkerResponse, { type: "response" }>;
  stdout: string;
  stderr: string;
};

type PendingWorkerRequest = {
  requestType: PyodideWorkerRequest["type"];
  resolve: (reply: WorkerReply) => void;
  reject: (error: Error) => void;
  stdout: string;
  stderr: string;
  timeoutMs?: number;
  timeoutHandle?: ReturnType<typeof setTimeout>;
};

type WorkerRequestPayload<Request> = Request extends { id: number }
  ? Omit<Request, "id">
  : never;

const pendingWorkerRequests = new Map<number, PendingWorkerRequest>();

function formatTimeoutSeconds(timeoutMs: number) {
  const seconds = timeoutMs / 1000;
  return Number.isInteger(seconds) ? seconds : Number(seconds.toFixed(2));
}

function getTimeoutMessage(timeoutMs: number) {
  return i18n.t("pyodide.timeout", {
    seconds: formatTimeoutSeconds(timeoutMs),
  });
}

function clearPendingTimeout(pending: PendingWorkerRequest) {
  if (pending.timeoutHandle !== undefined) {
    clearTimeout(pending.timeoutHandle);
    pending.timeoutHandle = undefined;
  }
}

function discardPyodideWorker(error: Error) {
  const worker = pyodideWorker;
  pyodideWorker = null;
  workerReady = false;
  workerReadyPromise = null;
  workerStatusCallback = null;

  if (worker) {
    worker.onmessage = null;
    worker.onerror = null;
    worker.terminate();
  }

  for (const [id, pending] of pendingWorkerRequests) {
    pendingWorkerRequests.delete(id);
    clearPendingTimeout(pending);
    if (pending.requestType === "run") {
      pending.resolve({
        response: { id, type: "response", error: error.message, passed: false },
        stdout: pending.stdout,
        stderr: pending.stderr,
      });
    } else {
      pending.reject(error);
    }
  }
}

function startWorkerTimeout(id: number, pending: PendingWorkerRequest) {
  if (pending.timeoutMs === undefined) return;
  clearPendingTimeout(pending);
  pending.timeoutHandle = setTimeout(() => {
    pendingWorkerRequests.delete(id);
    const message = getTimeoutMessage(pending.timeoutMs!);
    clearPendingTimeout(pending);
    pending.resolve({
      response: { id, type: "response", error: message, passed: false },
      stdout: pending.stdout,
      stderr: pending.stderr,
    });
    discardPyodideWorker(new Error(message));
  }, pending.timeoutMs);
}

function handleWorkerMessage(message: PyodideWorkerResponse) {
  if (message.type === "status") {
    workerStatusCallback?.(i18n.t(`pyodide.${message.status}`));
    return;
  }

  const pending = pendingWorkerRequests.get(message.id);
  if (!pending) return;

  if (message.type === "stdout") {
    pending.stdout += message.message;
  } else if (message.type === "stderr") {
    pending.stderr += message.message;
  } else if (message.type === "phase") {
    startWorkerTimeout(message.id, pending);
  } else if (message.type === "error") {
    pendingWorkerRequests.delete(message.id);
    clearPendingTimeout(pending);
    const error = new Error(message.error);
    pending.reject(error);
    discardPyodideWorker(error);
  } else {
    pendingWorkerRequests.delete(message.id);
    clearPendingTimeout(pending);
    pending.resolve({
      response: message,
      stdout: pending.stdout,
      stderr: pending.stderr,
    });
  }
}

function getPyodideWorker() {
  if (pyodideWorker) return pyodideWorker;

  const worker = new Worker(new URL("./pyodide.worker.ts", import.meta.url), {
    type: "module",
  });
  worker.onmessage = (event: MessageEvent<PyodideWorkerResponse>) => {
    handleWorkerMessage(event.data);
  };
  worker.onerror = (event) => {
    event.preventDefault();
    discardPyodideWorker(new Error(event.message || "Pyodide worker failed"));
  };
  pyodideWorker = worker;
  return worker;
}

function sendWorkerRequest(
  request: WorkerRequestPayload<PyodideWorkerRequest>,
  timeoutMs?: number,
): Promise<WorkerReply> {
  const worker = getPyodideWorker();
  const id = nextWorkerRequestId++;
  const message = { ...request, id } as PyodideWorkerRequest;

  return new Promise((resolve, reject) => {
    pendingWorkerRequests.set(id, {
      requestType: request.type,
      resolve,
      reject,
      stdout: "",
      stderr: "",
      timeoutMs,
    });
    try {
      worker.postMessage(message);
    } catch (error) {
      pendingWorkerRequests.delete(id);
      reject(error instanceof Error ? error : new Error(String(error)));
    }
  });
}

function ensureWorkerReady(onStatus?: (message: string) => void) {
  if (onStatus) workerStatusCallback = onStatus;
  if (workerReady) {
    workerStatusCallback = null;
    return Promise.resolve();
  }
  if (workerReadyPromise) return workerReadyPromise;

  workerReadyPromise = sendWorkerRequest({ type: "init" })
    .then(() => {
      workerReady = true;
      workerStatusCallback = null;
    })
    .catch((error: unknown) => {
      const failure = error instanceof Error ? error : new Error(String(error));
      discardPyodideWorker(failure);
      throw failure;
    })
    .finally(() => {
      workerReadyPromise = null;
    });

  return workerReadyPromise;
}

export async function initPyodide(
  onStatus?: (message: string) => void,
): Promise<PyodideInterface | null> {
  if (typeof Worker !== "undefined") {
    await ensureWorkerReady(onStatus);
    return null;
  }

  if (typeof window !== "undefined") {
    throw new Error("Pyodide requires Web Worker support in this browser");
  }

  // Keep the main-thread path for non-browser consumers such as unit tests.
  if (pyodideInstance) return pyodideInstance;
  if (loadError) throw loadError;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    onStatus?.(i18n.t("pyodide.downloading"));
    const { loadPyodide } = await import("pyodide");
    const pyodide = await loadPyodide({
      indexURL: PYODIDE_INDEX_URL,
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
  if (!pyodideInstance) {
    if (workerReady && pyodideWorker) {
      void sendWorkerRequest({ type: "reset" }).catch(() => {});
    }
    return;
  }

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

  if (!pyodide) {
    const reply = await sendWorkerRequest(
      { type: "run", userCode, testCode },
      timeoutMs,
    );
    return {
      stdout: reply.stdout,
      stderr: reply.stderr,
      error: reply.response.error,
      passed: reply.response.passed,
    };
  }

  resetPyodideGlobals();
  let stdout = "";
  let stderr = "";

  pyodide.setStdout({ batched: (msg) => { stdout += msg; } });
  pyodide.setStderr({ batched: (msg) => { stderr += msg; } });

  const localNamespace = pyodide.runPython("{}");

  const runWithTimeout = async (code: string) => {
    const runTask = pyodide.runPythonAsync(code, { globals: localNamespace });
    let timeoutHandle: ReturnType<typeof setTimeout> | undefined;

    try {
      const timeout = new Promise<never>((_, reject) => {
        timeoutHandle = setTimeout(
          () => reject(new Error(getTimeoutMessage(timeoutMs))),
          timeoutMs,
        );
      });
      const result = await Promise.race([runTask, timeout]);
      if (result && typeof result.destroy === "function") {
        result.destroy();
      }
    } finally {
      if (timeoutHandle !== undefined) clearTimeout(timeoutHandle);
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
