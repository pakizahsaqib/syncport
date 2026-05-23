"use client";

import type { MappingConfig } from "@syncport/core";
import { create } from "zustand";
import { STRUCTURE_PRESETS, type AdapterId, type StructurePresetId } from "@/lib/presets";
import { SAMPLE_DATA, type SampleId } from "@/lib/samples";
import { parseJsonInput, runTransform, type TransformOutput } from "@/lib/transform-engine";

interface PlaygroundState {
  inputJson: string;
  fileName: string | null;
  adapterId: AdapterId;
  mapping: MappingConfig;
  validateEnabled: boolean;
  sanitizeEnabled: boolean;
  strict: boolean;
  debugOpen: boolean;
  parseError: string | null;
  result: TransformOutput | null;

  setInputJson: (value: string) => void;
  setFileName: (name: string | null) => void;
  setAdapter: (id: AdapterId) => void;
  loadSample: (id: SampleId) => void;
  applyStructurePreset: (id: StructurePresetId) => void;
  setValidateEnabled: (v: boolean) => void;
  setSanitizeEnabled: (v: boolean) => void;
  setStrict: (v: boolean) => void;
  setDebugOpen: (v: boolean) => void;
  updateMappingField: (source: string, target: string) => void;
  formatInput: () => boolean;
  runPipeline: () => void;
}

const DEFAULT_INPUT = JSON.stringify(SAMPLE_DATA["crm-leads"], null, 2);

function recompute(get: () => PlaygroundState, set: (partial: Partial<PlaygroundState>) => void) {
  const state = get();
  const { data, error } = parseJsonInput(state.inputJson);
  set({ parseError: error });

  if (error || data === null) {
    set({ result: null });
    return;
  }

  const result = runTransform({
    data,
    adapterId: state.adapterId,
    mapping: state.mapping,
    validateEnabled: state.validateEnabled,
    sanitizeEnabled: state.sanitizeEnabled,
    strict: state.strict,
  });

  set({ result });
}

export const usePlaygroundStore = create<PlaygroundState>((set, get) => ({
  inputJson: DEFAULT_INPUT,
  fileName: null,
  adapterId: "hubspot",
  mapping: STRUCTURE_PRESETS.contacts.mapping,
  validateEnabled: true,
  sanitizeEnabled: true,
  strict: false,
  debugOpen: false,
  parseError: null,
  result: null,

  setInputJson: (value) => {
    set({ inputJson: value });
    recompute(get, set);
  },

  setFileName: (name) => set({ fileName: name }),

  setAdapter: (id) => {
    set({ adapterId: id });
    recompute(get, set);
  },

  loadSample: (id) => {
    set({
      inputJson: JSON.stringify(SAMPLE_DATA[id], null, 2),
      fileName: `${id}.json`,
    });
    recompute(get, set);
  },

  applyStructurePreset: (id) => {
    set({ mapping: STRUCTURE_PRESETS[id].mapping });
    recompute(get, set);
  },

  setValidateEnabled: (v) => {
    set({ validateEnabled: v });
    recompute(get, set);
  },

  setSanitizeEnabled: (v) => {
    set({ sanitizeEnabled: v });
    recompute(get, set);
  },

  setStrict: (v) => {
    set({ strict: v });
    recompute(get, set);
  },

  setDebugOpen: (v) => set({ debugOpen: v }),

  updateMappingField: (source, target) => {
    const fields = { ...get().mapping.fields, [source]: target };
    set({ mapping: { ...get().mapping, fields } });
    recompute(get, set);
  },

  formatInput: () => {
    const { data, error } = parseJsonInput(get().inputJson);
    if (error || data === null) {
      return false;
    }
    get().setInputJson(JSON.stringify(data, null, 2));
    return true;
  },

  runPipeline: () => recompute(get, set),
}));

// Initial transform on client
if (typeof window !== "undefined") {
  queueMicrotask(() => usePlaygroundStore.getState().runPipeline());
}
