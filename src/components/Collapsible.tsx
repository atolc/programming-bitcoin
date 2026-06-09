import { ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";

export function Collapsible({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <details className="my-6 group rounded-lg border border-stone-200 dark:border-stone-800 bg-stone-50/50 dark:bg-stone-900/40 overflow-hidden not-prose">
      <summary
        className={cn(
          "flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3.5",
          "text-sm font-semibold text-stone-800 dark:text-stone-200",
          "hover:bg-stone-100/60 dark:hover:bg-stone-800/40 transition-colors",
          "[&::-webkit-details-marker]:hidden",
        )}
      >
        <span>{title}</span>
        <ChevronDown className="size-4 shrink-0 text-stone-400 transition-transform group-open:rotate-180" />
      </summary>
      <div className="px-4 pb-4 pt-1 text-sm leading-relaxed text-stone-700 dark:text-stone-300 border-t border-stone-200/60 dark:border-stone-800/60 prose prose-stone dark:prose-invert prose-sm max-w-none">
        {children}
      </div>
    </details>
  );
}
