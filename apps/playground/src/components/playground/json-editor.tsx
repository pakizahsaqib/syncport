"use client";

import Editor, { type OnMount } from "@monaco-editor/react";
import { forwardRef, useImperativeHandle, useRef } from "react";
import { cn } from "@/lib/utils";
import { useThemeStore } from "@/store/theme-store";

export interface JsonEditorHandle {
  /** Format document in-editor; returns false if editor unavailable */
  formatDocument: () => Promise<boolean>;
}

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  readOnly?: boolean;
  className?: string;
  height?: string;
}

export const JsonEditor = forwardRef<JsonEditorHandle, JsonEditorProps>(function JsonEditor(
  { value, onChange, readOnly = false, className, height = "100%" },
  ref,
) {
  const theme = useThemeStore((s) => s.theme);
  const monacoTheme = theme === "dark" ? "vs-dark" : "vs";
  const editorRef = useRef<Parameters<OnMount>[0] | null>(null);

  useImperativeHandle(ref, () => ({
    async formatDocument() {
      const ed = editorRef.current;
      if (!ed) return false;

      const action = ed.getAction("editor.action.formatDocument");
      if (!action) return false;

      await action.run();
      onChange(ed.getValue());
      return true;
    },
  }));

  const handleMount: OnMount = (ed) => {
    editorRef.current = ed;
  };

  return (
    <div className={cn("min-h-0 flex-1 overflow-hidden border-t border-ide-border", className)}>
      <Editor
        height={height}
        theme={monacoTheme}
        defaultLanguage="json"
        value={value}
        onChange={(v) => onChange(v ?? "")}
        onMount={handleMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 13,
          fontFamily: "var(--font-geist-mono), Consolas, 'Courier New', monospace",
          lineNumbers: "on",
          scrollBeyondLastLine: false,
          automaticLayout: true,
          padding: { top: 8, bottom: 8 },
          renderLineHighlight: "line",
          bracketPairColorization: { enabled: true },
          folding: true,
          glyphMargin: false,
          lineDecorationsWidth: 0,
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          formatOnPaste: true,
          scrollbar: {
            verticalScrollbarSize: 10,
            horizontalScrollbarSize: 10,
          },
        }}
      />
    </div>
  );
});
