"use client";

import Link from "next/link";
import { ArrowLeft, Github } from "lucide-react";
import { useEffect } from "react";
import { SyncportLogo } from "@/components/brand/syncport-logo";
import { ConfigPanel } from "@/components/playground/config-panel";
import { DebugPanel } from "@/components/playground/debug-panel";
import { InputPanel } from "@/components/playground/input-panel";
import { OutputPanel } from "@/components/playground/output-panel";
import { ThemeToggle } from "@/components/playground/theme-toggle";
import { GITHUB_REPO } from "@/lib/site";
import { usePlaygroundStore } from "@/store/playground-store";

export function PlaygroundShell() {
  const runPipeline = usePlaygroundStore((s) => s.runPipeline);

  useEffect(() => {
    runPipeline();
  }, [runPipeline]);

  return (
    <div className="flex h-screen flex-col bg-ide-bg">
      <header className="flex shrink-0 items-center justify-between border-b border-ide-border bg-ide-title-bar px-3 py-2">
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-xs text-ide-muted hover:text-[var(--ide-accent)]"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Home
          </Link>
          <span className="text-ide-border">|</span>
          <div className="flex items-center gap-2">
            <SyncportLogo height={22} variant="auto" />
            <span className="text-sm font-medium text-ide-muted">Playground</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <a
            href={GITHUB_REPO}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 rounded px-2 py-1 text-xs text-ide-muted hover:bg-ide-sidebar hover:text-[var(--ide-accent)]"
            title="View on GitHub"
          >
            <Github className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </header>

      <main className="grid min-h-0 flex-1 grid-cols-1 divide-x divide-ide-border lg:grid-cols-3">
        <div className="min-h-[300px] lg:min-h-0">
          <InputPanel />
        </div>
        <div className="min-h-[300px] lg:min-h-0">
          <ConfigPanel />
        </div>
        <div className="min-h-[300px] lg:min-h-0">
          <OutputPanel />
        </div>
      </main>

      <DebugPanel />
    </div>
  );
}
