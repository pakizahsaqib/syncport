"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code2,
  Github,
  Layers,
  Package,
  Zap,
  Shield,
  GitBranch,
} from "lucide-react";
import { SyncportLogo } from "@/components/brand/syncport-logo";
import { LandingCodeSnippet } from "@/components/landing/landing-code-snippet";
import { SupportedAdaptersSection } from "@/components/landing/supported-adapters-section";
import { SectionHeader } from "@/components/landing/section-header";
import { landingType } from "@/components/landing/typography";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GITHUB_REPO, NPM_ORG } from "@/lib/site";
import { cn } from "@/lib/utils";

const FEATURES = [
  {
    icon: Zap,
    title: "Instant transforms",
    description: "See CRM-ready payloads in milliseconds with client-side Syncport packages.",
  },
  {
    icon: Layers,
    title: "Adapter architecture",
    description: "HubSpot, Airtable, CSV, Google Sheets, and XLSX — swap targets with one click.",
  },
  {
    icon: Shield,
    title: "Live validation",
    description: "Catch schema issues before export with built-in validation and debug logs.",
  },
  {
    icon: Code2,
    title: "IDE experience",
    description: "Monaco editor, split panes, and a debug console — familiar developer workflow.",
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--ide-bg)]">
      <nav className="fixed top-0 z-50 w-full border-b border-ide-border bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link href="/" className="flex items-center" aria-label="syncport home">
            <SyncportLogo height={26} priority />
          </Link>
          <Link
            href="/playground"
            className={cn(
              "inline-flex h-9 items-center rounded bg-[var(--ide-accent)] px-4 text-white hover:bg-[var(--ide-accent-hover)]",
              landingType.button,
            )}
          >
            Open Playground
          </Link>
        </div>
      </nav>

      <section className="relative pt-28 pb-20 px-6">
        <div className="absolute inset-0 bg-ide-grid bg-ide-grid opacity-60 pointer-events-none" />
        <div className="relative mx-auto max-w-4xl text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <span
              className={cn(
                "mb-6 inline-flex items-center gap-2 rounded border border-ide-border bg-white px-3 py-1.5 shadow-sm",
                landingType.eyebrow,
              )}
            >
              Open source · TypeScript monorepo
            </span>
            <h1 className={landingType.display}>
              Transform Any JSON Into CRM-Ready Data
            </h1>
            <p className={cn("mx-auto mt-6 max-w-2xl", landingType.lead)}>
              Syncport Playground lets developers instantly transform, validate, and export structured
              CRM payloads in a familiar IDE-style interface.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/playground"
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded bg-[var(--ide-accent)] px-6 text-white shadow-sm hover:bg-[var(--ide-accent-hover)]",
                  landingType.button,
                )}
              >
                Open Playground
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-md border border-[var(--github-border)] bg-[var(--github-bg)] px-6 text-[var(--github-fg)] shadow-sm transition-colors hover:bg-[var(--github-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--github-bg)] focus-visible:ring-offset-2",
                  landingType.button,
                )}
              >
                <Github className="h-4 w-4" aria-hidden />
                GitHub
              </a>
              <a
                href={NPM_ORG}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(
                  "inline-flex h-11 items-center gap-2 rounded-md border border-[var(--npm-border)] bg-[var(--npm-bg)] px-6 text-[var(--npm-fg)] shadow-sm transition-colors hover:bg-[var(--npm-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--npm-bg)] focus-visible:ring-offset-2",
                  landingType.button,
                )}
              >
                <Package className="h-4 w-4" aria-hidden />
                npm
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-ide-border bg-white">
        <div className="mx-auto max-w-6xl">
          <SectionHeader title="Features" className="mb-12" />
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <f.icon className="h-7 w-7 text-[var(--ide-accent)] mb-2" />
                  <CardTitle className={landingType.cardTitle}>{f.title}</CardTitle>
                  <CardDescription className={landingType.body}>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <SupportedAdaptersSection />

      <section className="px-6 py-16 border-t border-ide-border">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className={cn("mb-6", landingType.sectionTitle)}>Developer Experience</h2>
            <ul className={cn("space-y-4", landingType.body)}>
              <li className="flex gap-2">
                <GitBranch className="h-4 w-4 text-[var(--ide-accent)] shrink-0 mt-0.5" />
                Fluent pipeline API: map → validate → sanitize → transform → export
              </li>
              <li className="flex gap-2">
                <Code2 className="h-4 w-4 text-[var(--ide-accent)] shrink-0 mt-0.5" />
                IDE-style UI with light/dark mode and Monaco JSON editors
              </li>
              <li className="flex gap-2">
                <Layers className="h-4 w-4 text-[var(--ide-accent)] shrink-0 mt-0.5" />
                pnpm workspaces + TurboRepo monorepo
              </li>
            </ul>
          </div>
          <Card className="overflow-hidden">
            <div className={cn("border-b border-ide-border bg-ide-tab-bar px-3 py-2", landingType.eyebrow)}>
              example.ts
            </div>
            <div className="overflow-hidden bg-[#fffffe]">
              <LandingCodeSnippet />
            </div>
          </Card>
        </div>
      </section>

      <footer className={cn("border-t border-ide-border bg-white py-8 text-center", landingType.caption)}>
        © {new Date().getFullYear()} Syncport — MIT License
      </footer>
    </div>
  );
}
