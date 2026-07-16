import { Component, type ErrorInfo, type ReactNode } from "react";
import i18n from "../i18n";

type Props = {
  children: ReactNode;
  /**
   * Custom fallback UI to render when an error is caught.
   * When omitted, a full-page fallback with a "Reload" button is shown.
   */
  fallback?: ReactNode;
  /** Optional callback invoked after an error is caught, e.g. for telemetry. */
  onError?: (error: Error, info: ErrorInfo) => void;
};

type State = {
  hasError: boolean;
  error?: Error;
};

/**
 * React Error Boundary that prevents uncaught render-time exceptions from
 * producing a blank white screen in production.
 *
 * Usage – global (full-page fallback):
 *   <ErrorBoundary>
 *     <App />
 *   </ErrorBoundary>
 *
 * Usage – granular (inline fallback):
 *   <ErrorBoundary fallback={<p>Could not render this section.</p>}>
 *     <MarkdownRenderer content={md} />
 *   </ErrorBoundary>
 */
export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error("[ErrorBoundary] Uncaught render error:", error, info);
    this.props.onError?.(error, info);
  }

  private handleReload = (): void => {
    window.location.reload();
  };

  render(): ReactNode {
    if (!this.state.hasError) {
      return this.props.children;
    }

    if (this.props.fallback !== undefined) {
      return this.props.fallback;
    }

    // Default full-page fallback
    const t = i18n.t.bind(i18n);
    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-6 p-8 text-center">
        <div className="flex max-w-md flex-col items-center gap-4 rounded-xl border border-destructive/30 bg-destructive/5 p-8 shadow-lg">
          <div className="flex size-14 items-center justify-center rounded-full bg-destructive/10">
            {/* Warning icon rendered with SVG to avoid extra dependencies */}
            <svg
              aria-hidden="true"
              className="size-7 text-destructive"
              fill="none"
              stroke="currentColor"
              strokeWidth={1.5}
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="space-y-1">
            <h1 className="text-xl font-bold text-foreground">
              {t("error.title")}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("error.description")}
            </p>
          </div>

          {this.state.error?.message ? (
            <pre className="w-full overflow-x-auto rounded-lg bg-muted px-4 py-2 text-left font-mono text-xs text-muted-foreground">
              {this.state.error.message}
            </pre>
          ) : null}

          <button
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            onClick={this.handleReload}
            type="button"
          >
            {t("error.reload")}
          </button>
        </div>
      </div>
    );
  }
}
