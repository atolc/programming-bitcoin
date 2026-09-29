import { useEffect, useState } from "react";
import { subscribeToProgressUpdates } from "../lib/progressEvents";

export function useProgressRevision() {
  const [revision, setRevision] = useState(0);

  useEffect(
    () => subscribeToProgressUpdates(() => setRevision((current) => current + 1)),
    [],
  );

  return revision;
}
