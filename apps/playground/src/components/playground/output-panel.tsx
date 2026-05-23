"use client";

import { Check, Copy, Download, Timer } from "lucide-react";
import { useMemo, useState } from "react";
import { AdapterLogo } from "@/components/playground/adapter-logos";
import { JsonEditor } from "@/components/playground/json-editor";
import { PanelChrome } from "@/components/playground/panel-chrome";
import { ValidationIssues } from "@/components/playground/validation-issues";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ADAPTER_BRANDS } from "@/lib/adapter-brands";
import type { AdapterId } from "@/lib/presets";
import { downloadBase64, downloadFile, formatBytes } from "@/lib/utils";
import { usePlaygroundStore } from "@/store/playground-store";

export function OutputPanel() {
  const { result, adapterId } = usePlaygroundStore();
  const [copied, setCopied] = useState(false);
  const brand = ADAPTER_BRANDS[adapterId];

  const outputText = useMemo(() => {
    if (!result?.output) return "// Transform output will appear here";
    if (adapterId === "csv" && result.output && typeof result.output === "object" && "content" in result.output) {
      return (result.output as { content: string }).content;
    }
    return JSON.stringify(result.output, null, 2);
  }, [result, adapterId]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    if (!result?.output) return;

    if (adapterId === "xlsx" && typeof result.output === "object" && "base64" in result.output) {
      const payload = result.output as { base64: string; mimeType: string };
      downloadBase64(payload.base64, "syncport-export.xlsx", payload.mimeType);
      return;
    }

    if (adapterId === "csv" && typeof result.output === "object" && "content" in result.output) {
      downloadFile(String((result.output as { content: string }).content), "syncport-export.csv", "text/csv");
      return;
    }

    downloadFile(outputText, "syncport-export.json", "application/json");
  };

  const validation = result?.validation;
  const statusBadge =
    result?.adapterStatus === "error" ? (
      <Badge variant="error">Error</Badge>
    ) : result?.adapterStatus === "success" ? (
      validation && !validation.valid ? (
        <Badge variant="warning">{validation.issues.length} issues</Badge>
      ) : (
        <Badge variant="success">Ready</Badge>
      )
    ) : null;

  return (
    <PanelChrome
      title="output.json"
      icon={<AdapterLogo id={adapterId as AdapterId} size={18} framed={false} />}
      badge={statusBadge}
      toolbar={
        <>
          {result ? (
            <>
              <span className="flex items-center gap-1 text-[11px] text-ide-muted">
                <Timer className="h-3 w-3" style={{ color: brand.primary }} />
                {result.durationMs.toFixed(2)} ms
              </span>
              <span className="text-[11px] text-ide-muted">
                {formatBytes(result.inputSizeBytes)} → {formatBytes(result.outputSizeBytes)}
              </span>
              <span className="mx-1 h-4 w-px bg-ide-border" />
            </>
          ) : null}
          <Button variant="secondary" size="sm" onClick={handleCopy} disabled={!result?.output}>
            {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
            Copy
          </Button>
          <Button variant="ghost" size="sm" onClick={handleDownload} disabled={!result?.output}>
            <Download className="h-3.5 w-3.5" />
            Download
          </Button>
        </>
      }
      className="border-l-0 lg:border-l"
    >
      {result?.error ? (
        <div className="shrink-0 border-b border-ide-border bg-ide-error px-3 py-1.5 text-xs text-ide-error">
          {result.error}
        </div>
      ) : null}
      {validation && !validation.valid ? <ValidationIssues validation={validation} /> : null}
      <JsonEditor value={outputText} onChange={() => {}} readOnly height="100%" />
    </PanelChrome>
  );
}
