import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded px-1.5 py-0.5 text-[10px] font-medium border",
  {
    variants: {
      variant: {
        default: "border-[var(--ide-accent)]/30 bg-[#e8f4fc] text-[var(--ide-accent)]",
        secondary: "border-ide-border bg-[var(--ide-sidebar)] text-ide-muted",
        success: "border-transparent bg-[var(--ide-badge-success-bg)] text-[var(--ide-badge-success-fg)]",
        warning: "border-transparent bg-[var(--ide-badge-warning-bg)] text-[var(--ide-badge-warning-fg)]",
        error: "border-transparent bg-[var(--ide-badge-error-bg)] text-[var(--ide-badge-error-fg)]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}
