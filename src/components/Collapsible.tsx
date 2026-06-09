import { ChevronDown } from "lucide-react";
import {
  Collapsible as CollapsibleRoot,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "../lib/utils";

export function Collapsible({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <CollapsibleRoot className="group my-6 not-prose rounded-lg border border-border bg-muted/30 overflow-hidden">
      <CollapsibleTrigger
        className={cn(
          "flex w-full cursor-pointer items-center justify-between gap-3 px-4 py-3.5",
          "text-sm font-semibold text-foreground",
          "hover:bg-accent/50 transition-colors",
        )}
      >
        <span>{title}</span>
        <ChevronDown className="size-4 shrink-0 text-muted-foreground transition-transform group-data-[panel-open]:rotate-180" />
      </CollapsibleTrigger>
      <CollapsiblePanel>
        <div className="px-4 pb-4 pt-1 text-sm leading-relaxed text-muted-foreground border-t border-border prose prose-stone dark:prose-invert prose-sm max-w-none">
          {children}
        </div>
      </CollapsiblePanel>
    </CollapsibleRoot>
  );
}
