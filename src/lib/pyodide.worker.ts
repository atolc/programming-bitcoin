import { loadPyodide, type PyodideInterface } from "pyodide";
import type {
  PyodideWorkerRequest,
  PyodideWorkerResponse,
} from "./pyodide-worker-protocol";

const PYODIDE_INDEX_URL = "https://cdn.jsdelivr.net/pyodide/v0.29.4/full/";
const workerScope = self as unknown as {
  onmessage: ((event: MessageEvent<PyodideWorkerRequest>) => void) | null;
  postMessage: (message: PyodideWorkerResponse) => void;
};

let pyodideInstance: PyodideInterface | null = null;
let pyodideLoadPromise: Promise<PyodideInterface> | null = null;
let requestQueue = Promise.resolve();

async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;
  if (!pyodideLoadPromise) {
    workerScope.postMessage({ id: 0, type: "status", status: "downloading" });
    pyodideLoadPromise = loadPyodide({ indexURL: PYODIDE_INDEX_URL }).then(
      (pyodide) => {
        workerScope.postMessage({ id: 0, type: "status", status: "preparing" });
        pyodideInstance = pyodide;
        return pyodide;
      },
    );
  }
  return pyodideLoadPromise;
}

function resetGlobals(pyodide: PyodideInterface) {
  pyodide.runPython(`
import sys as _sys
_keep = set(_sys.stdlib_module_names) | {'_pyodide', 'pyodide', 'micropip', 'packaging'}
_to_remove = [k for k in list(_sys.modules.keys()) if k.split('.')[0] not in _keep]
for _k in _to_remove:
    _sys.modules.pop(_k, None)
del _keep, _to_remove
`);

  const builtins = pyodide.globals.get("__builtins__");
  pyodide.globals.clear();
  pyodide.globals.set("__builtins__", builtins);
}

async function runCode(
  pyodide: PyodideInterface,
  request: Extract<PyodideWorkerRequest, { type: "run" }>,
) {
  resetGlobals(pyodide);
  const localNamespace = pyodide.runPython("{}");
  pyodide.setStdout({
    batched: (message) =>
      workerScope.postMessage({ id: request.id, type: "stdout", message }),
  });
  pyodide.setStderr({
    batched: (message) =>
      workerScope.postMessage({ id: request.id, type: "stderr", message }),
  });

  const runPhase = async (code: string, phase: "user" | "tests") => {
    workerScope.postMessage({ id: request.id, type: "phase", phase });
    const result = await pyodide.runPythonAsync(code, { globals: localNamespace });
    if (result && typeof result.destroy === "function") result.destroy();
  };

  try {
    try {
      await runPhase(request.userCode, "user");
    } catch (error) {
      workerScope.postMessage({
        id: request.id,
        type: "response",
        error: error instanceof Error ? error.message : String(error),
        passed: false,
      });
      return;
    }

    if (request.testCode) {
      try {
        await runPhase(request.testCode, "tests");
      } catch (error) {
        workerScope.postMessage({
          id: request.id,
          type: "response",
          error: error instanceof Error ? error.message : String(error),
          passed: false,
        });
        return;
      }
      workerScope.postMessage({ id: request.id, type: "response", passed: true });
      return;
    }

    workerScope.postMessage({ id: request.id, type: "response" });
  } finally {
    localNamespace.destroy();
  }
}

async function handleRequest(request: PyodideWorkerRequest) {
  if (request.type === "init") {
    await getPyodide();
    workerScope.postMessage({ id: request.id, type: "response" });
    return;
  }

  if (request.type === "reset") {
    if (pyodideInstance) resetGlobals(pyodideInstance);
    workerScope.postMessage({ id: request.id, type: "response" });
    return;
  }

  await runCode(await getPyodide(), request);
}

workerScope.onmessage = (event) => {
  const request = event.data;
  requestQueue = requestQueue
    .then(() => handleRequest(request))
    .catch((error: unknown) => {
      workerScope.postMessage({
        id: request.id,
        type: "error",
        error: error instanceof Error ? error.message : String(error),
      });
    });
};
