import { AlertCircle, Info, Lightbulb, TriangleAlert } from "lucide-react";
import { useTranslation } from "react-i18next";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { cn } from "../lib/utils";

type CalloutVariant = "important" | "tip" | "warning" | "note";

const variantConfig: Record<
  CalloutVariant,
  {
    labelKey: `callout.${CalloutVariant}`;
    icon: typeof Info;
    alertVariant: "default" | "warning" | "success" | "error";
  }
> = {
  important: {
    labelKey: "callout.important",
    icon: AlertCircle,
    alertVariant: "warning",
  },
  tip: {
    labelKey: "callout.tip",
    icon: Lightbulb,
    alertVariant: "success",
  },
  warning: {
    labelKey: "callout.warning",
    icon: TriangleAlert,
    alertVariant: "error",
  },
  note: {
    labelKey: "callout.note",
    icon: Info,
    alertVariant: "default",
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
  const { t } = useTranslation();
  const config = variantConfig[variant];
  const Icon = config.icon;

  return (
    <Alert
      className={cn("my-6 not-prose shadow-sm", variant === "note" && "bg-muted/40")}
      variant={config.alertVariant}
    >
      <Icon className="size-4 shrink-0 opacity-80" />
      <AlertTitle className="text-xs font-bold uppercase tracking-wider opacity-80">
        {t(config.labelKey)}
      </AlertTitle>
      <AlertDescription className="text-sm leading-relaxed text-foreground [&>p]:m-0">
        {children}
      </AlertDescription>
    </Alert>
  );
}
