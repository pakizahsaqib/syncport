"use client";

import { motion } from "framer-motion";
import { Package } from "lucide-react";
import { AdapterLogo } from "@/components/playground/adapter-logos";
import { SectionHeader } from "@/components/landing/section-header";
import { landingType } from "@/components/landing/typography";
import { ADAPTER_BRANDS } from "@/lib/adapter-brands";
import { ADAPTERS, type AdapterId } from "@/lib/presets";
import { syncportNpmPackageUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

/** Shared icon tile — consistent card padding and size for every adapter. */
const ADAPTER_TILE_CLASS =
  "flex h-[6.75rem] w-[6.75rem] items-center justify-center rounded-lg border border-ide-border bg-white p-5 shadow-sm transition-shadow group-hover:shadow-md group-focus-visible:shadow-md";

const ADAPTER_LOGO_SIZE = 56;

function AdapterTooltip({
  id,
  name,
  npmPackage,
  brand,
}: {
  id: AdapterId;
  name: string;
  npmPackage: string;
  brand: (typeof ADAPTER_BRANDS)[AdapterId];
}) {
  return (
    <div
      id={`adapter-tip-${id}`}
      role="tooltip"
      className={cn(
        "pointer-events-none absolute left-1/2 top-[calc(100%+0.5rem)] z-20 -translate-x-1/2 opacity-0 transition-all duration-200 invisible translate-y-0.5",
        "before:absolute before:-top-2 before:left-0 before:right-0 before:h-2 before:content-['']",
        "group-hover:opacity-100 group-hover:visible group-hover:translate-y-0",
        "group-focus-visible:opacity-100 group-focus-visible:visible group-focus-visible:translate-y-0",
      )}
    >
      <div
        className="relative min-w-[9.5rem] overflow-hidden rounded-md border border-ide-border/90 bg-[#2d2d2d] px-3.5 py-2 text-center shadow-[0_6px_20px_rgba(0,0,0,0.18)] ring-1 ring-black/10"
        style={{ borderTopColor: brand.primary, borderTopWidth: 2 }}
      >
        <p className={cn("font-medium text-[#f5f5f5]", landingType.tooltip)}>{name}</p>
        <p className={cn("mt-1 font-mono text-[#b0b0b0]", landingType.tooltip)}>{npmPackage}</p>
      </div>
      <span
        className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-full border-[6px] border-transparent border-b-[#2d2d2d]"
        aria-hidden
      />
    </div>
  );
}

export function SupportedAdaptersSection() {
  return (
    <section className="relative border-t border-ide-border bg-[#f8f9fb] px-6 py-16">
      <div
        className="pointer-events-none absolute inset-0 bg-ide-grid opacity-[0.35]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-0 h-px w-2/3 max-w-3xl -translate-x-1/2 bg-gradient-to-r from-transparent via-ide-border to-transparent"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl">
        <SectionHeader
          title="Supported Adapters"
          description="Production-ready export targets for CRMs, spreadsheets, and flat files — install individually from the @syncport scope on npm."
          eyebrow={
            <span
              className={cn(
                "inline-flex items-center gap-2 rounded border border-ide-border bg-white px-3 py-1.5 shadow-sm",
                landingType.eyebrow,
              )}
            >
              <Package className="h-4 w-4 text-[var(--ide-accent)]" aria-hidden />
              npm packages
            </span>
          }
        />

        <div className="flex flex-wrap items-start justify-center gap-3 pb-2 sm:gap-4">
          {ADAPTERS.map((adapter, index) => {
            const brand = ADAPTER_BRANDS[adapter.id];
            const npmPackage = `@syncport/${adapter.id}`;
            const npmUrl = syncportNpmPackageUrl(adapter.id);

            return (
              <motion.div
                key={adapter.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-48px" }}
                transition={{ duration: 0.45, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
                className="group relative shrink-0"
              >
                <a
                  href={npmUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`View ${npmPackage} on npm`}
                  aria-describedby={`adapter-tip-${adapter.id}`}
                  className="block rounded-lg transition-transform duration-200 hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--ide-accent)] focus-visible:ring-offset-4"
                >
                  <span className={ADAPTER_TILE_CLASS}>
                    <AdapterLogo
                      id={adapter.id as AdapterId}
                      size={ADAPTER_LOGO_SIZE}
                      framed={false}
                      className="h-full w-full"
                    />
                  </span>
                </a>

                <AdapterTooltip
                  id={adapter.id}
                  name={adapter.name}
                  npmPackage={npmPackage}
                  brand={brand}
                />
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
