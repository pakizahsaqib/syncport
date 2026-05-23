import { cn } from "@/lib/utils";

interface PanelChromeProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  actions?: React.ReactNode;
  badge?: React.ReactNode;
  toolbar?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

/** VS Code–style panel: tab strip + toolbar + content */
export function PanelChrome({
  title,
  subtitle,
  icon,
  actions,
  badge,
  toolbar,
  children,
  className,
}: PanelChromeProps) {
  return (
    <div
      className={cn(
        "flex h-full flex-col overflow-hidden border border-ide-border bg-ide-panel shadow-sm",
        className,
      )}
    >
      <div className="flex shrink-0 items-center gap-2 border-b border-ide-border bg-ide-tab-bar px-2 py-0 min-h-[36px]">
        <div
          className={cn(
            "flex items-center gap-2 border-r border-ide-border bg-ide-editor px-3 py-1.5 -mb-px",
            "border-t-2 border-t-ide-accent",
          )}
        >
          {icon}
          <span className="text-xs font-medium text-ide-fg">{title}</span>
          {badge}
        </div>
        {subtitle ? (
          <span className="hidden text-[11px] text-ide-muted sm:inline truncate">{subtitle}</span>
        ) : null}
        <div className="ml-auto flex items-center gap-1">{actions}</div>
      </div>
      {toolbar ? (
        <div className="shrink-0 flex flex-wrap items-center gap-2 border-b border-ide-border bg-ide-sidebar px-3 py-2">
          {toolbar}
        </div>
      ) : null}
      <div className="flex min-h-0 flex-1 flex-col bg-ide-editor">{children}</div>
    </div>
  );
}
