"use client";

import * as Collapsible from "@radix-ui/react-collapsible";
import type { ValidationResult } from "@syncport/core";
import { ChevronUp, Terminal } from "lucide-react";
import { useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { usePlaygroundStore } from "@/store/playground-store";

const LEVEL_COLORS: Record<string, string> = {
  info: "text-[var(--ide-accent)]",
  debug: "text-ide-muted",
  warn: "text-[var(--ide-badge-warning-fg)]",
  error: "text-ide-error",
};

function isValidationResult(data: unknown): data is ValidationResult {
  return (
    typeof data === "object" &&
    data !== null &&
    "valid" in data &&
    "issues" in data &&
    Array.isArray((data as ValidationResult).issues)
  );
}

export function DebugPanel() {
  const { debugOpen, setDebugOpen, result } = usePlaygroundStore();
  const logs = result?.logs ?? [];
  const issueCount = result?.validation?.issues.length ?? 0;

  useEffect(() => {
    if (issueCount > 0 && !debugOpen) {
      setDebugOpen(true);
    }
  }, [issueCount, debugOpen, setDebugOpen]);

  return (
    <Collapsible.Root open={debugOpen} onOpenChange={setDebugOpen}>
      <div className="shrink-0 border-t border-ide-border">
        <Collapsible.Trigger className="flex w-full items-center justify-between bg-ide-status-bar px-3 py-1 text-left text-ide-status-fg hover:brightness-105 transition-all">
          <div className="flex items-center gap-2 text-[11px] font-medium">
            <Terminal className="h-3.5 w-3.5" />
            OUTPUT / DEBUG CONSOLE
            <Badge variant="secondary" className="border-white/30 bg-white/20 text-white text-[10px]">
              {logs.length}
            </Badge>
            {issueCount > 0 ? (
              <Badge variant="warning" className="text-[10px]">
                {issueCount} validation
              </Badge>
            ) : null}
          </div>
          <ChevronUp
            className={cn("h-3.5 w-3.5 transition-transform", debugOpen && "rotate-180")}
          />
        </Collapsible.Trigger>

        <Collapsible.Content>
          <div className="max-h-52 overflow-y-auto border-t border-ide-border bg-ide-console font-mono text-[11px]">
            {logs.length === 0 ? (
              <p className="p-3 text-ide-muted">Pipeline logs will appear here…</p>
            ) : (
              <ul>
                {logs.map((log, i) => (
                  <li
                    key={`${log.timestamp}-${i}`}
                    className="border-b border-ide-border px-3 py-1.5 hover:bg-ide-panel"
                  >
                    <div className="flex gap-2">
                      <span className="shrink-0 text-ide-muted w-16">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </span>
                      <span className={cn("shrink-0 uppercase w-10 font-semibold", LEVEL_COLORS[log.level])}>
                        {log.level}
                      </span>
                      <span className="shrink-0 text-[var(--ide-accent)] w-20 truncate">[{log.stage}]</span>
                      <span className="text-ide-fg">{log.message}</span>
                    </div>
                    {isValidationResult(log.data) && !log.data.valid ? (
                      <ul className="mt-1.5 ml-[7.5rem] space-y-1 border-l-2 border-[var(--ide-badge-warning-fg)] pl-2">
                        {log.data.issues.map((issue, j) => (
                          <li key={j} className="text-ide-fg">
                            <span className="text-[var(--ide-accent)]">{issue.path || "(root)"}</span>
                            {": "}
                            {issue.message}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </Collapsible.Content>
      </div>
    </Collapsible.Root>
  );
}
