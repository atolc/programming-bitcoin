import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./i18n";
import { App } from "./App";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import "./styles.css";
import "katex/dist/katex.min.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="isolate relative min-h-svh">
          <TooltipProvider>
            <App />
          </TooltipProvider>
        </div>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>,
);
