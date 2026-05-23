"use client";

import {
  Building2,
  Handshake,
  Headphones,
  Settings2,
  ShoppingCart,
  Users,
} from "lucide-react";
import { AdapterLogo } from "@/components/playground/adapter-logos";
import { PanelChrome } from "@/components/playground/panel-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { ADAPTER_BRANDS } from "@/lib/adapter-brands";
import { ADAPTERS, STRUCTURE_PRESETS, type AdapterId, type StructurePresetId } from "@/lib/presets";
import { cn } from "@/lib/utils";
import { usePlaygroundStore } from "@/store/playground-store";

const STRUCTURE_ICONS: Record<StructurePresetId, React.ReactNode> = {
  contacts: <Users className="h-3.5 w-3.5" />,
  companies: <Building2 className="h-3.5 w-3.5" />,
  deals: <Handshake className="h-3.5 w-3.5" />,
  orders: <ShoppingCart className="h-3.5 w-3.5" />,
  tickets: <Headphones className="h-3.5 w-3.5" />,
};

export function ConfigPanel() {
  const {
    adapterId,
    mapping,
    validateEnabled,
    sanitizeEnabled,
    strict,
    setAdapter,
    applyStructurePreset,
    setValidateEnabled,
    setSanitizeEnabled,
    setStrict,
    updateMappingField,
  } = usePlaygroundStore();

  const mappingEntries = Object.entries(mapping.fields);

  return (
    <PanelChrome
      title="transform.config"
      icon={<Settings2 className="h-3.5 w-3.5 text-ide-muted" />}
      className="border-l-0 lg:border-l"
    >
      <div className="min-h-0 flex-1 overflow-y-auto p-3 space-y-5 bg-ide-sidebar">
        <section>
          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ide-muted">
            Target Adapter
          </h4>
          <div className="grid gap-2">
            {ADAPTERS.map((adapter) => {
              const brand = ADAPTER_BRANDS[adapter.id];
              const selected = adapterId === adapter.id;
              return (
                <button
                  key={adapter.id}
                  type="button"
                  onClick={() => setAdapter(adapter.id)}
                  className={cn(
                    "flex items-center gap-3 rounded border p-2.5 text-left transition-all",
                    selected
                      ? "bg-ide-editor shadow-sm"
                      : "border-ide-border bg-ide-panel hover:bg-ide-editor",
                  )}
                  style={
                    selected
                      ? {
                          borderColor: brand.ring,
                          boxShadow: `0 0 0 1px ${brand.ring}33`,
                        }
                      : undefined
                  }
                >
                  <AdapterLogo id={adapter.id as AdapterId} size={36} />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="font-semibold text-sm"
                        style={{ color: selected ? brand.primary : undefined }}
                      >
                        {adapter.name}
                      </span>
                      <Badge
                        variant="secondary"
                        className="shrink-0 text-[10px]"
                        style={
                          selected
                            ? {
                                borderColor: `${brand.primary}55`,
                                color: brand.primary,
                              }
                            : undefined
                        }
                      >
                        {adapter.outputType}
                      </Badge>
                    </div>
                    <p className="mt-0.5 text-[11px] text-ide-muted leading-snug">{adapter.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section>
          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ide-muted">
            Structure Presets
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {(Object.entries(STRUCTURE_PRESETS) as [StructurePresetId, { label: string }][]).map(
              ([id, preset]) => (
                <Button key={id} variant="outline" size="sm" className="gap-1" onClick={() => applyStructurePreset(id)}>
                  {STRUCTURE_ICONS[id]}
                  {preset.label}
                </Button>
              ),
            )}
          </div>
        </section>

        <section>
          <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-ide-muted">
            Field Mapping
          </h4>
          <div className="space-y-1.5 rounded border border-ide-border bg-ide-panel p-2">
            {mappingEntries.map(([source, target]) => (
              <div key={source} className="grid grid-cols-[1fr_auto_1fr] items-center gap-2 text-xs font-mono">
                <code className="rounded bg-[var(--ide-sidebar)] px-2 py-1 truncate text-ide-fg border border-ide-border">
                  {source}
                </code>
                <span className="text-ide-muted">→</span>
                <input
                  className="rounded border border-ide-border bg-ide-input px-2 py-1 text-[var(--ide-accent)] focus:border-[var(--ide-accent)] focus:outline-none focus:ring-1 focus:ring-[var(--ide-accent)]"
                  value={typeof target === "string" ? target : target.target}
                  onChange={(e) => updateMappingField(source, e.target.value)}
                />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-2.5 rounded border border-ide-border bg-ide-panel p-3">
          <h4 className="text-[10px] font-semibold uppercase tracking-wider text-ide-muted">Options</h4>
          <label className="flex items-center justify-between gap-4 text-xs">
            <span>Validation</span>
            <Switch checked={validateEnabled} onCheckedChange={setValidateEnabled} />
          </label>
          <label className="flex items-center justify-between gap-4 text-xs">
            <span>Sanitize</span>
            <Switch checked={sanitizeEnabled} onCheckedChange={setSanitizeEnabled} />
          </label>
          <label className="flex items-center justify-between gap-4 text-xs">
            <span>Strict mode</span>
            <Switch checked={strict} onCheckedChange={setStrict} />
          </label>
        </section>
      </div>
    </PanelChrome>
  );
}
