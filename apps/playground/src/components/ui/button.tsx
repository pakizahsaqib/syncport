import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)] focus-visible:ring-offset-1 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[var(--ide-accent)] text-white hover:bg-[var(--ide-accent-hover)] border border-[var(--ide-accent)]",
        secondary:
          "bg-ide-panel text-ide-fg border border-ide-border hover:bg-[var(--ide-sidebar)]",
        ghost: "text-ide-muted hover:bg-[var(--ide-sidebar)] hover:text-ide-fg",
        outline:
          "border border-ide-border bg-ide-panel text-ide-fg hover:bg-[var(--ide-sidebar)]",
      },
      size: {
        default: "h-8 px-3 py-1.5 text-xs",
        sm: "h-7 px-2.5 text-xs",
        lg: "h-9 px-4",
        icon: "h-8 w-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => (
    <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  ),
);
Button.displayName = "Button";

export { Button, buttonVariants };
