export type PyodideWorkerRequest =
  | { id: number; type: "init" }
  | { id: number; type: "reset" }
  | { id: number; type: "run"; userCode: string; testCode?: string };

export type PyodideWorkerResponse =
  | { id: number; type: "status"; status: "downloading" | "preparing" }
  | { id: number; type: "phase"; phase: "user" | "tests" }
  | { id: number; type: "stdout"; message: string }
  | { id: number; type: "stderr"; message: string }
  | { id: number; type: "response"; error?: string; passed?: boolean }
  | { id: number; type: "error"; error: string };
