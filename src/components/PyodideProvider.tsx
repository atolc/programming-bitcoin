import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  cancelPyodideExecution,
  initPyodide,
  isPyodideExecutionCancelledError,
  resetPyodideGlobals,
  runPython as runPythonCode,
  runPythonWithTests as runPythonWithTestsCode,
  type PyodideStatus,
  type PythonRunResult,
  type PythonRunWithTestsResult,
} from "../lib/pyodide";


type PyodideContextValue = {
  status: PyodideStatus;
  statusMessage: string;
  ensureReady: () => Promise<void>;
  cancelExecution: () => boolean;
  resetGlobals: () => void;
  runPython: (code: string, timeoutMs?: number) => Promise<PythonRunResult>;
  runPythonWithTests: (
    code: string,
    testCode?: string,
    timeoutMs?: number,
  ) => Promise<PythonRunWithTestsResult>;
};


const PyodideContext = createContext<PyodideContextValue | null>(null);

export function PyodideProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<PyodideStatus>("idle");
  const [statusMessage, setStatusMessage] = useState("");

  const ensureReady = useCallback(async () => {
    if (status === "ready") return;
    if (status === "error") {
      throw new Error(statusMessage || "Pyodide failed to load");
    }
    setStatus("loading");
    try {
      await initPyodide((msg) => setStatusMessage(msg));
      setStatus("ready");
      setStatusMessage("");
    } catch (err) {
      if (isPyodideExecutionCancelledError(err)) {
        setStatus("idle");
        setStatusMessage("");
      } else {
        setStatus("error");
        setStatusMessage(err instanceof Error ? err.message : String(err));
      }
      throw err;
    }
  }, [status, statusMessage]);

  const cancelExecution = useCallback(() => {
    const cancelled = cancelPyodideExecution();
    if (!cancelled) return false;
    setStatus("idle");
    setStatusMessage("");
    return true;
  }, []);

  const runPython = useCallback(
    async (code: string, timeoutMs?: number) => {
      await ensureReady();
      return runPythonCode(code, timeoutMs);
    },
    [ensureReady],
  );

  const runPythonWithTests = useCallback(
    async (code: string, testCode?: string, timeoutMs?: number) => {
      await ensureReady();
      return runPythonWithTestsCode(code, testCode, timeoutMs);
    },
    [ensureReady],
  );

  const resetGlobals = useCallback(() => {
    resetPyodideGlobals();
  }, []);

  const value = useMemo(
    () => ({
      status,
      statusMessage,
      ensureReady,
      cancelExecution,
      resetGlobals,
      runPython,
      runPythonWithTests,
    }),
    [
      status,
      statusMessage,
      ensureReady,
      cancelExecution,
      resetGlobals,
      runPython,
      runPythonWithTests,
    ],
  );


  return (
    <PyodideContext.Provider value={value}>{children}</PyodideContext.Provider>
  );
}

export function usePyodide() {
  const ctx = useContext(PyodideContext);
  if (!ctx) {
    throw new Error("usePyodide must be used within PyodideProvider");
  }
  return ctx;
}

export function usePyodideOptional() {
  return useContext(PyodideContext);
}
