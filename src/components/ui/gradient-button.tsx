import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GradientButton({ className, ...props }: ButtonProps) {
  return (
    <Button
      className={cn(
        "border-transparent bg-gradient-to-r from-amber-500 to-orange-500 text-stone-950 shadow-lg shadow-amber-500/20",
        "hover:from-amber-500/90 hover:to-orange-500/90 hover:shadow-amber-500/30",
        "data-pressed:from-amber-500/90 data-pressed:to-orange-500/90",
        className,
      )}
      size="lg"
      {...props}
    />
  );
}
