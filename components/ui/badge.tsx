import { cn } from "@/lib/utils";
export function Badge({
  className,
  variant = "secondary",
  ...props
}: React.ComponentProps<"span"> & {
  variant?: "default" | "secondary" | "outline";
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-medium leading-5",
        variant === "default"
          ? "bg-primary/10 text-primary"
          : variant === "outline"
            ? "border border-border text-muted-foreground"
            : "bg-secondary text-muted-foreground",
        className,
      )}
      {...props}
    />
  );
}
