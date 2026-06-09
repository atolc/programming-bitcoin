import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initPyodide,
  runPython as runPythonCode,
  type PyodideStatus,
  type PythonRunResult,
} from "../lib/pyodide";

type PyodideContextValue = {
  status: PyodideStatus;
  statusMessage: string;
  ensureReady: () => Promise<void>;
  runPython: (code: string) => Promise<PythonRunResult>;
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
      setStatus("error");
      setStatusMessage(err instanceof Error ? err.message : String(err));
      throw err;
    }
  }, [status, statusMessage]);

  const runPython = useCallback(
    async (code: string) => {
      await ensureReady();
      return runPythonCode(code);
    },
    [ensureReady],
  );

  const value = useMemo(
    () => ({ status, statusMessage, ensureReady, runPython }),
    [status, statusMessage, ensureReady, runPython],
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
