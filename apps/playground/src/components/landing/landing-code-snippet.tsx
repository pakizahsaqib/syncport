"use client";

import Editor from "@monaco-editor/react";

const EXAMPLE_TS = `import { transform } from "@syncport/core";
import { HubspotAdapter } from "@syncport/hubspot";

const result = transform({ name: "Ali", email: "ali@test.com" })
  .map({ fields: { name: "name", email: "email" } })
  .sanitize()
  .use(new HubspotAdapter())
  .export();`;

/** Read-only TypeScript snippet with VS Code Light (vs) token colors. */
export function LandingCodeSnippet() {
  return (
    <Editor
      height="228px"
      theme="vs"
      defaultLanguage="typescript"
      value={EXAMPLE_TS}
      loading={
        <div
          className="flex h-[228px] items-center justify-center bg-[#fffffe] font-mono text-sm text-ide-muted"
          aria-hidden
        >
          Loading editor…
        </div>
      }
      options={{
        readOnly: true,
        domReadOnly: true,
        minimap: { enabled: false },
        fontSize: 14,
        lineHeight: 21,
        fontFamily: "var(--font-geist-mono), Consolas, 'Courier New', monospace",
        lineNumbers: "on",
        scrollBeyondLastLine: false,
        automaticLayout: true,
        padding: { top: 12, bottom: 12 },
        renderLineHighlight: "none",
        folding: false,
        glyphMargin: false,
        lineDecorationsWidth: 8,
        lineNumbersMinChars: 3,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        overviewRulerBorder: false,
        scrollbar: {
          vertical: "hidden",
          horizontal: "auto",
          verticalScrollbarSize: 0,
          handleMouseWheel: false,
        },
        contextmenu: false,
        selectionHighlight: false,
        occurrencesHighlight: "off",
        links: false,
        hover: { enabled: false },
        quickSuggestions: false,
        bracketPairColorization: { enabled: true },
        guides: { indentation: true },
        tabSize: 2,
      }}
    />
  );
}
