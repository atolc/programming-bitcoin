import { AlertCircle, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { cn } from "../lib/utils";

type CalloutVariant = "important" | "tip" | "warning" | "note";

const variantConfig: Record<
  CalloutVariant,
  { label: string; icon: typeof Info; className: string }
> = {
  important: {
    label: "Importante",
    icon: AlertCircle,
    className:
      "border-amber-300/70 bg-amber-50/80 text-amber-950 dark:border-amber-800/60 dark:bg-amber-950/30 dark:text-amber-100",
  },
  tip: {
    label: "Consejo",
    icon: Lightbulb,
    className:
      "border-emerald-300/70 bg-emerald-50/80 text-emerald-950 dark:border-emerald-800/60 dark:bg-emerald-950/30 dark:text-emerald-100",
  },
  warning: {
    label: "Advertencia",
    icon: TriangleAlert,
    className:
      "border-rose-300/70 bg-rose-50/80 text-rose-950 dark:border-rose-800/60 dark:bg-rose-950/30 dark:text-rose-100",
  },
  note: {
    label: "Nota",
    icon: Info,
    className:
      "border-stone-300/70 bg-stone-50/80 text-stone-950 dark:border-stone-700/60 dark:bg-stone-900/60 dark:text-stone-100",
  },
};

export function parseCallout(text: string): { variant: CalloutVariant; body: string } | null {
  const match = text.match(/^\[!(\w+)\]\s*([\s\S]*)$/i);
  if (!match) return null;
  const variant = match[1].toLowerCase() as CalloutVariant;
  if (!(variant in variantConfig)) return null;
  return { variant, body: match[2].trim() };
}

export function Callout({
  variant,
  children,
}: {
  variant: CalloutVariant;
  children: React.ReactNode;
}) {
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <div
      className={cn(
        "my-6 rounded-lg border px-4 py-3.5 not-prose shadow-sm",
        config.className,
      )}
    >
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 shrink-0 opacity-80" />
        <span className="text-xs font-bold uppercase tracking-wider opacity-80">
          {config.label}
        </span>
      </div>
      <div className="text-sm leading-relaxed [&>p]:m-0">{children}</div>
    </div>
  );
}
