import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import type { PyodideInterface } from "pyodide";
import {
  initPyodide,
  normalizeOutput,
  outputsMatch,
  runPython,
  runPythonWithTests,
} from "../pyodide";

const localNamespace = { destroy: vi.fn() };
const resultDestroy = vi.fn();
const runPythonAsyncMock = vi.fn();
const stdoutCallback = vi.fn();
const stderrCallback = vi.fn();

const pyodide = {
  globals: {
    get: vi.fn(() => ({ builtins: true })),
    clear: vi.fn(),
    set: vi.fn(),
  },
  runPython: vi.fn((code: string) =>
    code === "{}" ? localNamespace : undefined,
  ),
  runPythonAsync: runPythonAsyncMock,
  setStdout: vi.fn(({ batched }: { batched: (message: string) => void }) => {
    stdoutCallback.mockImplementation(batched);
  }),
  setStderr: vi.fn(({ batched }: { batched: (message: string) => void }) => {
    stderrCallback.mockImplementation(batched);
  }),
} as unknown as PyodideInterface;

const { loadPyodideMock } = vi.hoisted(() => ({ loadPyodideMock: vi.fn() }));
vi.mock("pyodide", () => ({ loadPyodide: loadPyodideMock }));

describe("Pyodide helpers", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.unstubAllGlobals();
  });

  beforeEach(async () => {
    vi.useRealTimers();
    vi.clearAllMocks();
    vi.stubGlobal("window", undefined);
    loadPyodideMock.mockResolvedValue(pyodide);
    runPythonAsyncMock.mockResolvedValue(undefined);
    await initPyodide();
  });

  it("normalizes line endings and surrounding whitespace before comparing output", () => {
    expect(normalizeOutput("  hello\r\nworld  ")).toBe("hello\nworld");
    expect(outputsMatch(" hello\r\n", "hello\n")).toBe(true);
    expect(outputsMatch("hello", "goodbye")).toBe(false);
  });

  it("captures output, destroys returned values, and releases its namespace", async () => {
    runPythonAsyncMock.mockImplementation(async () => {
      stdoutCallback("hello");
      stderrCallback("warning");
      return { destroy: resultDestroy };
    });

    await expect(runPython("print('hello')", 1000)).resolves.toEqual({
      stdout: "hello",
      stderr: "warning",
      error: undefined,
    });
    expect(resultDestroy).toHaveBeenCalledOnce();
    expect(localNamespace.destroy).toHaveBeenCalledOnce();
  });

  it("returns an error after the default five-second timeout", async () => {
    vi.useFakeTimers();
    runPythonAsyncMock.mockReturnValue(new Promise(() => {}));

    const pending = runPythonWithTests("while True: pass");
    await vi.advanceTimersByTimeAsync(4999);
    expect(vi.getTimerCount()).toBe(1);
    await vi.advanceTimersByTimeAsync(1);
    const result = await pending;

    expect(result.error).toBe("Tiempo de ejecución agotado (5s)");
    expect(result.passed).toBe(false);
    expect(localNamespace.destroy).toHaveBeenCalledOnce();
  });

  it("clears the timeout after a successful run", async () => {
    vi.useFakeTimers();
    runPythonAsyncMock.mockResolvedValue(undefined);

    await runPython("pass", 1000);

    expect(vi.getTimerCount()).toBe(0);
    vi.useRealTimers();
  });

  it("reports test failures as failed results", async () => {
    runPythonAsyncMock
      .mockResolvedValueOnce(undefined)
      .mockRejectedValueOnce(new Error("assertion failed"));

    await expect(
      runPythonWithTests("solution", "assert False", 1000),
    ).resolves.toMatchObject({
      error: "assertion failed",
      passed: false,
    });
  });
});
