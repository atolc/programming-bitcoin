import { useEffect, useState } from "react";
import { getPracticeProgress } from "../lib/practiceProgress";
import { subscribeToProgressUpdates } from "../lib/progressEvents";

export function usePracticeProgress() {
  const [progress, setProgress] = useState(getPracticeProgress);

  useEffect(() => {
    const refresh = () => setProgress(getPracticeProgress());
    window.addEventListener("focus", refresh);
    const unsubscribe = subscribeToProgressUpdates(refresh);

    return () => {
      window.removeEventListener("focus", refresh);
      unsubscribe();
    };
  }, []);

  return progress;
}
