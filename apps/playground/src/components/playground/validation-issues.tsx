"use client";

import type { ValidationResult } from "@syncport/core";
import { AlertTriangle } from "lucide-react";

interface ValidationIssuesProps {
  validation: ValidationResult;
  title?: string;
}

export function ValidationIssues({ validation, title = "Validation issues" }: ValidationIssuesProps) {
  if (validation.valid || validation.issues.length === 0) {
    return null;
  }

  return (
    <div className="shrink-0 border-b border-ide-border bg-[var(--ide-badge-warning-bg)] px-3 py-2">
      <div className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--ide-badge-warning-fg)]">
        <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
        {title} ({validation.issues.length})
      </div>
      <ul className="space-y-1.5">
        {validation.issues.map((issue, i) => (
          <li
            key={`${issue.path}-${issue.code ?? i}`}
            className="rounded border border-ide-border/60 bg-ide-panel px-2 py-1.5 text-xs"
          >
            <div className="font-mono text-[var(--ide-accent)]">
              {issue.path || "(root)"}
              {issue.code ? (
                <span className="ml-1.5 text-[10px] font-normal text-ide-muted">[{issue.code}]</span>
              ) : null}
            </div>
            <div className="mt-0.5 text-ide-fg">{issue.message}</div>
          </li>
        ))}
      </ul>
    </div>
  );
}
