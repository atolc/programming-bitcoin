export const PROGRESS_UPDATED_EVENT = "pb-progress-updated";

export function notifyProgressUpdated() {
  window.dispatchEvent(new Event(PROGRESS_UPDATED_EVENT));
}

export function subscribeToProgressUpdates(listener: () => void) {
  window.addEventListener(PROGRESS_UPDATED_EVENT, listener);
  window.addEventListener("storage", listener);
  return () => {
    window.removeEventListener(PROGRESS_UPDATED_EVENT, listener);
    window.removeEventListener("storage", listener);
  };
}
