"use client";

import { FileJson, Upload, Wand2 } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import { useDropzone } from "react-dropzone";
import { JsonEditor, type JsonEditorHandle } from "@/components/playground/json-editor";
import { PanelChrome } from "@/components/playground/panel-chrome";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { SAMPLE_LABELS, type SampleId } from "@/lib/samples";
import { usePlaygroundStore } from "@/store/playground-store";

const SAMPLES = Object.entries(SAMPLE_LABELS) as [SampleId, string][];

export function InputPanel() {
  const {
    inputJson,
    fileName,
    parseError,
    setInputJson,
    setFileName,
    loadSample,
    formatInput,
  } = usePlaygroundStore();

  const editorRef = useRef<JsonEditorHandle>(null);
  const [formatHint, setFormatHint] = useState<string | null>(null);

  const handleFormat = useCallback(async () => {
    setFormatHint(null);
    const viaEditor = await editorRef.current?.formatDocument();
    if (viaEditor) return;

    const ok = formatInput();
    if (!ok) {
      setFormatHint(parseError ?? "Fix JSON syntax before formatting");
    }
  }, [formatInput, parseError]);

  const onDrop = useCallback(
    (files: File[]) => {
      const file = files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () => {
        setInputJson(String(reader.result));
        setFileName(file.name);
      };
      reader.readAsText(file);
    },
    [setInputJson, setFileName],
  );

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { "application/json": [".json"] },
    noClick: true,
    multiple: false,
  });

  return (
    <PanelChrome
      title="input.json"
      icon={<FileJson className="h-3.5 w-3.5 text-[#d97706]" />}
      badge={fileName ? <Badge variant="secondary">{fileName}</Badge> : null}
      toolbar={
        <>
          <Button variant="secondary" size="sm" onClick={() => open()}>
            <Upload className="h-3.5 w-3.5" />
            Upload
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => void handleFormat()}
            title="Pretty-print JSON (2-space indent)"
          >
            <Wand2 className="h-3.5 w-3.5" />
            Format
          </Button>
          <select
            className="h-7 rounded border border-ide-border bg-ide-input px-2 text-xs text-ide-fg focus:border-[var(--ide-accent)] focus:outline-none"
            defaultValue=""
            onChange={(e) => {
              const id = e.target.value as SampleId;
              if (id) loadSample(id);
              e.target.value = "";
            }}
          >
            <option value="">Load sample…</option>
            {SAMPLES.map(([id, label]) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </select>
        </>
      }
    >
      <div
        {...getRootProps()}
        className={`relative flex min-h-0 flex-1 flex-col ${isDragActive ? "ring-2 ring-inset ring-[var(--ide-accent)]" : ""}`}
      >
        <input {...getInputProps()} />
        {isDragActive ? (
          <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-ide-drop-overlay">
            <p className="text-sm font-medium text-[var(--ide-accent)]">Drop JSON file here</p>
          </div>
        ) : null}
        <JsonEditor ref={editorRef} value={inputJson} onChange={setInputJson} height="100%" />
      </div>
      <div className="shrink-0 border-t border-ide-border bg-ide-sidebar px-3 py-1 text-[11px]">
        {formatHint ? (
          <span className="text-ide-error">{formatHint}</span>
        ) : parseError ? (
          <span className="text-ide-error">Parse error: {parseError}</span>
        ) : (
          <span className="text-ide-muted">Valid JSON — transforms live</span>
        )}
      </div>
    </PanelChrome>
  );
}
