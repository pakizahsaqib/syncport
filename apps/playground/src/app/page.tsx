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
import { AdapterLogo } from "@/components/playground/adapter-logos";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ADAPTER_BRANDS } from "@/lib/adapter-brands";
import { ADAPTERS, type AdapterId } from "@/lib/presets";
import { GITHUB_REPO, NPM_ORG } from "@/lib/site";

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
            className="inline-flex h-8 items-center rounded bg-[var(--ide-accent)] px-3 text-sm font-medium text-white hover:bg-[var(--ide-accent-hover)]"
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
            <span className="inline-flex items-center gap-2 rounded border border-ide-border bg-white px-3 py-1 text-xs text-ide-muted mb-6 shadow-sm">
              Open source · TypeScript monorepo
            </span>
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-ide-fg">
              Transform Any JSON Into CRM-Ready Data
            </h1>
            <p className="mt-5 text-lg text-ide-muted max-w-2xl mx-auto">
              Syncport Playground lets developers instantly transform, validate, and export structured
              CRM payloads in a familiar IDE-style interface.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/playground"
                className="inline-flex h-10 items-center gap-2 rounded bg-[var(--ide-accent)] px-6 text-sm font-medium text-white hover:bg-[var(--ide-accent-hover)] shadow-sm"
              >
                Open Playground
                <ArrowRight className="h-4 w-4" />
              </Link>
              <a
                href={GITHUB_REPO}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--github-border)] bg-[var(--github-bg)] px-6 text-sm font-medium text-[var(--github-fg)] shadow-sm transition-colors hover:bg-[var(--github-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--github-bg)] focus-visible:ring-offset-2"
              >
                <Github className="h-4 w-4" aria-hidden />
                GitHub
              </a>
              <a
                href={NPM_ORG}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center gap-2 rounded-md border border-[var(--npm-border)] bg-[var(--npm-bg)] px-6 text-sm font-medium text-[var(--npm-fg)] shadow-sm transition-colors hover:bg-[var(--npm-bg-hover)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--npm-bg)] focus-visible:ring-offset-2"
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
          <h2 className="text-xl font-semibold text-center mb-10 text-ide-fg">Features</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f) => (
              <Card key={f.title} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <f.icon className="h-7 w-7 text-[var(--ide-accent)] mb-2" />
                  <CardTitle className="text-base">{f.title}</CardTitle>
                  <CardDescription>{f.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-ide-border">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-xl font-semibold text-center mb-3 text-ide-fg">Supported Adapters</h2>
          <p className="text-center text-ide-muted mb-10 text-sm">
            Official CRM & export targets with brand-accurate styling
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADAPTERS.map((a) => {
              const brand = ADAPTER_BRANDS[a.id];
              return (
                <div
                  key={a.id}
                  className="flex items-start gap-3 rounded border border-ide-border bg-white p-4 shadow-sm hover:shadow-md transition-shadow"
                  style={{ borderLeftWidth: 4, borderLeftColor: brand.primary }}
                >
                  <AdapterLogo id={a.id as AdapterId} size={40} />
                  <div>
                    <h3 className="font-semibold text-sm" style={{ color: brand.primary }}>
                      {a.name}
                    </h3>
                    <p className="text-xs text-ide-muted mt-1">{a.description}</p>
                    <p className="text-[10px] text-ide-muted mt-2 font-mono">{a.outputType}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-6 py-16 border-t border-ide-border">
        <div className="mx-auto max-w-6xl grid md:grid-cols-2 gap-8 items-center">
          <div>
            <h2 className="text-xl font-semibold mb-4 text-ide-fg">Developer Experience</h2>
            <ul className="space-y-3 text-sm text-ide-muted">
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
            <div className="border-b border-ide-border bg-ide-tab-bar px-3 py-1.5 text-[11px] text-ide-muted">
              example.ts
            </div>
            <CardContent className="p-4 font-mono text-xs text-ide-fg leading-relaxed bg-ide-editor">
              {`import { transform } from "@syncport/core";
import { HubspotAdapter } from "@syncport/hubspot";

const result = transform({ name: "Ali", email: "ali@test.com" })
  .map({ fields: { name: "name", email: "email" } })
  .sanitize()
  .use(new HubspotAdapter())
  .export();`}
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="border-t border-ide-border py-6 text-center text-xs text-ide-muted bg-white">
        © {new Date().getFullYear()} Syncport — MIT License
      </footer>
    </div>
  );
}
