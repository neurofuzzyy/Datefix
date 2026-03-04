"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { ALL_FLAVORS } from "@/data/flavor-configs";

type IngredientValues = {
  scale: number;
  offsetX: number;
  offsetY: number;
};

type ShadowLayer = {
  angle: number;
  distance: number;
  blur: number;
  opacity: number;
};

type GlobalValues = {
  gap: number;
  packetScale: number;
  showReference: boolean;
  referenceOpacity: number;
  referenceScale: number;
  referenceY: number;
  shadows: ShadowLayer[];
};

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
type AllValues = Record<string, IngredientValues> & {
  __global?: GlobalValues;
};

function getInitialValues(): AllValues {
  const values: AllValues = {};
  for (const flavor of ALL_FLAVORS) {
    for (const layer of flavor.ingredientLayers.filter((l) => l.zIndex < 5)) {
      values[layer.id] = {
        scale: layer.scale,
        offsetX: layer.offsetX,
        offsetY: layer.offsetY,
      };
    }
  }
  return values;
}

type DebugEditorProps = {
  onValuesChange: (values: AllValues) => void;
  externalValues?: AllValues | null;
};

const DEFAULT_SHADOW: ShadowLayer = { angle: 135, distance: 8, blur: 16, opacity: 0.15 };

const DEFAULT_GLOBAL: GlobalValues = {
  gap: -84,
  packetScale: 1.09,
  showReference: false,
  referenceOpacity: 0.3,
  referenceScale: 1.35,
  referenceY: -69,
  shadows: [
    { angle: 57, distance: 14, blur: 5, opacity: 0.28 },
    { angle: 60, distance: 0, blur: 2, opacity: 0 },
  ],
};

function shadowToCSS(shadow: ShadowLayer): string {
  const rad = (shadow.angle * Math.PI) / 180;
  const x = Math.round(Math.cos(rad) * shadow.distance * 10) / 10;
  const y = Math.round(Math.sin(rad) * shadow.distance * 10) / 10;
  return `drop-shadow(${x}px ${y}px ${shadow.blur}px rgba(0, 0, 0, ${shadow.opacity}))`;
}

function shadowsToFilter(shadows: ShadowLayer[]): string {
  return shadows.map(shadowToCSS).join(" ");
}

type Snapshot = { values: AllValues; globalValues: GlobalValues };
const MAX_HISTORY = 100;

type Tab = "layout" | "shadows";

export default function DebugEditor({
  onValuesChange,
  externalValues,
}: DebugEditorProps) {
  const [values, setValues] = useState<AllValues>(getInitialValues);
  const [globalValues, setGlobalValues] =
    useState<GlobalValues>(DEFAULT_GLOBAL);
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("layout");

  // Undo history
  const historyRef = useRef<Snapshot[]>([]);
  const snapshotTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Capture a snapshot for undo (debounced — only saves after 300ms of inactivity)
  const pushSnapshot = useCallback((vals: AllValues, globals: GlobalValues) => {
    if (snapshotTimerRef.current) clearTimeout(snapshotTimerRef.current);
    snapshotTimerRef.current = setTimeout(() => {
      const stack = historyRef.current;
      if (stack.length >= MAX_HISTORY) stack.shift();
      stack.push({ values: structuredClone(vals), globalValues: structuredClone(globals) });
    }, 300);
  }, []);

  // Capture initial state
  useEffect(() => {
    historyRef.current = [{ values: structuredClone(values), globalValues: structuredClone(globalValues) }];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Listen for Ctrl+Z / Cmd+Z
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        const stack = historyRef.current;
        if (stack.length <= 1) return;
        stack.pop(); // remove current
        const prev = stack[stack.length - 1];
        if (!prev) return;
        setValues(structuredClone(prev.values));
        setGlobalValues(structuredClone(prev.globalValues));
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Master offsets — these are relative deltas applied on top of individual values
  const [masterDelta, setMasterDelta] = useState({ scale: 0, offsetX: 0, offsetY: 0 });
  const prevMasterRef = useRef({ scale: 0, offsetX: 0, offsetY: 0 });

  // Sync from external drag/resize updates
  useEffect(() => {
    if (!externalValues) return;
    setValues((prev) => {
      const next = { ...prev };
      for (const [key, val] of Object.entries(externalValues)) {
        if (key !== "__global" && val && typeof val === "object" && "scale" in val) {
          next[key] = val as IngredientValues;
        }
      }
      return next;
    });
  }, [externalValues]);

  useEffect(() => {
    onValuesChange({ ...values, __global: globalValues } as AllValues);
    pushSnapshot(values, globalValues);
  }, [values, globalValues, onValuesChange, pushSnapshot]);

  const updateValue = useCallback(
    (layerId: string, field: keyof IngredientValues, value: number) => {
      setValues((prev) => ({
        ...prev,
        [layerId]: { ...prev[layerId], [field]: value },
      }));
    },
    [],
  );

  // Master slider handler — applies relative delta to all ingredients
  const handleMasterChange = useCallback(
    (field: keyof IngredientValues, newDelta: number) => {
      const prev = prevMasterRef.current[field];
      const diff = newDelta - prev;
      prevMasterRef.current = { ...prevMasterRef.current, [field]: newDelta };
      setMasterDelta((md) => ({ ...md, [field]: newDelta }));

      if (Math.abs(diff) < 0.001) return;

      setValues((prevValues) => {
        const next = { ...prevValues };
        for (const key of Object.keys(next)) {
          if (key === "__global") continue;
          const v = next[key];
          if (!v || typeof v !== "object" || !("scale" in v)) continue;
          if (field === "scale") {
            next[key] = { ...v, scale: Math.round(Math.max(0.5, v.scale + diff) * 20) / 20 };
          } else {
            next[key] = { ...v, [field]: Math.round((v[field] + diff) * 2) / 2 };
          }
        }
        return next;
      });
    },
    [],
  );

  const exportConfig = useCallback(() => {
    const globalLines = [
      `// Global`,
      `gap: ${globalValues.gap},`,
      `packetScale: ${globalValues.packetScale},`,
      `referenceScale: ${globalValues.referenceScale},`,
      `referenceY: ${globalValues.referenceY},`,
    ].join("\n");

    const shadowLines = globalValues.shadows
      .map((s, i) => `// Shadow ${i + 1}\nangle: ${s.angle}, distance: ${s.distance}, blur: ${s.blur}, opacity: ${s.opacity}`)
      .join("\n");
    const filterLine = `\n// CSS filter\nfilter: "${shadowsToFilter(globalValues.shadows)}"`;

    const ingredientLines = Object.entries(values)
      .filter(([key]) => key !== "__global")
      .map(
        ([id, v]) => {
          const iv = v as IngredientValues;
          return `// ${id}\noffsetX: ${iv.offsetX},\noffsetY: ${iv.offsetY},\nscale: ${iv.scale},`;
        },
      )
      .join("\n\n");

    const output = `${globalLines}\n\n${shadowLines}${filterLine}\n\n${ingredientLines}`;
    navigator.clipboard
      .writeText(output)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() => console.log(output));
  }, [values, globalValues]);

  return (
    <div className="fixed inset-x-0 bottom-0 z-[60] border-t border-gray-200 bg-white/95 shadow-2xl backdrop-blur-sm">
      <div className="mx-auto w-full max-w-5xl px-3 py-3 sm:px-4">
        {/* Header row with tabs */}
        <div className="mb-2.5 flex flex-wrap items-center gap-2">
          <div className="flex gap-1">
            {(["layout", "shadows"] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`rounded-md px-2.5 py-1 text-[10px] font-medium transition-colors ${
                  activeTab === tab
                    ? "bg-[#1d1644] text-white"
                    : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                }`}
              >
                {tab === "layout" ? "Layout" : "Shadows"}
              </button>
            ))}
          </div>
          <span className="text-[10px] font-medium text-gray-400">
            <kbd className="rounded bg-gray-100 px-1 py-0.5 font-mono text-[9px]">
              =
            </kbd>{" "}
            close
          </span>
          <button
            onClick={exportConfig}
            className="ml-auto rounded-md bg-[#1d1644] px-3 py-1 text-[10px] font-medium text-white transition-colors hover:bg-[#2a1f5e]"
          >
            {copied ? "Copied!" : "Copy Config"}
          </button>
        </div>

        {/* ──── Layout tab ──── */}
        {activeTab === "layout" && (
          <>
            {/* Global controls — responsive grid */}
            <div className="mb-2.5 grid grid-cols-2 items-center gap-x-3 gap-y-1.5 border-b border-gray-100 pb-2.5 sm:grid-cols-3 md:grid-cols-[auto_1fr_1fr_1fr_1fr_1fr]">
              <label className="flex cursor-pointer items-center gap-1.5">
                <input
                  type="checkbox"
                  checked={globalValues.showReference}
                  onChange={(e) =>
                    setGlobalValues((prev) => ({
                      ...prev,
                      showReference: e.target.checked,
                    }))
                  }
                  className="accent-[#1d1644]"
                />
                <span className="whitespace-nowrap text-[10px] font-medium text-gray-500">
                  Ref
                </span>
              </label>

              <Slider
                label="Opacity"
                value={globalValues.referenceOpacity}
                min={0.05}
                max={0.8}
                step={0.05}
                onChange={(val) =>
                  setGlobalValues((prev) => ({ ...prev, referenceOpacity: val }))
                }
              />

              <Slider
                label="Ref Size"
                value={globalValues.referenceScale}
                min={0.5}
                max={5}
                step={0.05}
                onChange={(val) =>
                  setGlobalValues((prev) => ({ ...prev, referenceScale: val }))
                }
              />

              <Slider
                label="Ref Y"
                value={globalValues.referenceY}
                min={-100}
                max={40}
                step={1}
                onChange={(val) =>
                  setGlobalValues((prev) => ({ ...prev, referenceY: val }))
                }
              />

              <Slider
                label="Gap"
                value={globalValues.gap}
                min={-100}
                max={60}
                step={1}
                onChange={(val) =>
                  setGlobalValues((prev) => ({ ...prev, gap: val }))
                }
              />

              <Slider
                label="Packet"
                value={globalValues.packetScale}
                min={0.2}
                max={3}
                step={0.01}
                onChange={(val) =>
                  setGlobalValues((prev) => ({ ...prev, packetScale: val }))
                }
              />
            </div>

            {/* Per-flavor ingredient controls — responsive */}
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
              {/* Master column */}
              <div>
                <div className="mb-1 flex items-center gap-1.5">
                  <div
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "#1d1644" }}
                  />
                  <span className="text-[10px] font-bold text-[#1d1644]">
                    Master
                  </span>
                </div>
                <Slider
                  label="Scale"
                  value={masterDelta.scale}
                  min={-2}
                  max={3}
                  step={0.05}
                  onChange={(val) => handleMasterChange("scale", val)}
                />
                <Slider
                  label="X"
                  value={masterDelta.offsetX}
                  min={-30}
                  max={30}
                  step={0.5}
                  onChange={(val) => handleMasterChange("offsetX", val)}
                />
                <Slider
                  label="Y"
                  value={masterDelta.offsetY}
                  min={-100}
                  max={40}
                  step={0.5}
                  onChange={(val) => handleMasterChange("offsetY", val)}
                />
              </div>

              {/* Per-flavor columns */}
              {ALL_FLAVORS.map((config) =>
                config.ingredientLayers
                  .filter((l) => l.zIndex < 5)
                  .map((layer) => {
                    const v = values[layer.id];
                    if (!v) return null;
                    return (
                      <div key={layer.id}>
                        <div className="mb-1 flex items-center gap-1.5">
                          <div
                            className="h-2 w-2 rounded-full"
                            style={{ backgroundColor: config.colorHex }}
                          />
                          <span className="text-[10px] font-semibold text-[#1d1644]">
                            {config.displayName}
                          </span>
                        </div>
                        <Slider
                          label="Scale"
                          value={v.scale}
                          min={0.5}
                          max={5}
                          step={0.05}
                          onChange={(val) => updateValue(layer.id, "scale", val)}
                        />
                        <Slider
                          label="X"
                          value={v.offsetX}
                          min={-50}
                          max={50}
                          step={0.5}
                          onChange={(val) => updateValue(layer.id, "offsetX", val)}
                        />
                        <Slider
                          label="Y"
                          value={v.offsetY}
                          min={-80}
                          max={30}
                          step={0.5}
                          onChange={(val) => updateValue(layer.id, "offsetY", val)}
                        />
                      </div>
                    );
                  }),
              )}
            </div>
          </>
        )}

        {/* ──── Shadows tab ──── */}
        {activeTab === "shadows" && (
          <div>
            <div className="mb-3 flex items-center justify-between">
              <span className="text-[10px] font-medium text-gray-500">
                {globalValues.shadows.length} shadow{globalValues.shadows.length !== 1 ? "s" : ""} active
              </span>
              <button
                onClick={() =>
                  setGlobalValues((prev) => ({
                    ...prev,
                    shadows: [...prev.shadows, { ...DEFAULT_SHADOW }],
                  }))
                }
                className="rounded-md bg-gray-100 px-2.5 py-1 text-[10px] font-medium text-gray-600 transition-colors hover:bg-gray-200"
              >
                + Add Shadow
              </button>
            </div>

            {/* Preview of current CSS */}
            <div className="mb-3 rounded-md bg-gray-50 px-3 py-2">
              <span className="text-[9px] font-medium text-gray-400">CSS Preview</span>
              <p className="mt-0.5 break-all font-mono text-[9px] text-gray-600">
                filter: {shadowsToFilter(globalValues.shadows) || "none"};
              </p>
            </div>

            <div className="grid gap-3">
              {globalValues.shadows.map((shadow, idx) => (
                <div
                  key={idx}
                  className="rounded-md border border-gray-100 bg-gray-50/50 p-2.5"
                >
                  <div className="mb-1.5 flex items-center justify-between">
                    <span className="text-[10px] font-semibold text-[#1d1644]">
                      Shadow {idx + 1}
                    </span>
                    <button
                      onClick={() =>
                        setGlobalValues((prev) => ({
                          ...prev,
                          shadows: prev.shadows.filter((_, i) => i !== idx),
                        }))
                      }
                      className="rounded px-1.5 py-0.5 text-[9px] text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
                    >
                      Remove
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-x-4 gap-y-1 sm:grid-cols-4">
                    <Slider
                      label="Angle"
                      value={shadow.angle}
                      min={0}
                      max={360}
                      step={1}
                      onChange={(val) =>
                        setGlobalValues((prev) => ({
                          ...prev,
                          shadows: prev.shadows.map((s, i) =>
                            i === idx ? { ...s, angle: val } : s,
                          ),
                        }))
                      }
                    />
                    <Slider
                      label="Dist"
                      value={shadow.distance}
                      min={0}
                      max={40}
                      step={1}
                      onChange={(val) =>
                        setGlobalValues((prev) => ({
                          ...prev,
                          shadows: prev.shadows.map((s, i) =>
                            i === idx ? { ...s, distance: val } : s,
                          ),
                        }))
                      }
                    />
                    <Slider
                      label="Blur"
                      value={shadow.blur}
                      min={0}
                      max={60}
                      step={1}
                      onChange={(val) =>
                        setGlobalValues((prev) => ({
                          ...prev,
                          shadows: prev.shadows.map((s, i) =>
                            i === idx ? { ...s, blur: val } : s,
                          ),
                        }))
                      }
                    />
                    <Slider
                      label="Opacity"
                      value={shadow.opacity}
                      min={0}
                      max={1}
                      step={0.01}
                      onChange={(val) =>
                        setGlobalValues((prev) => ({
                          ...prev,
                          shadows: prev.shadows.map((s, i) =>
                            i === idx ? { ...s, opacity: val } : s,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>
              ))}
            </div>

            {globalValues.shadows.length === 0 && (
              <p className="py-4 text-center text-[10px] text-gray-400">
                No shadows. Click &quot;+ Add Shadow&quot; to create one.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      <span className="w-9 shrink-0 text-[9px] text-gray-400">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="h-1 min-w-0 flex-1 accent-[#1d1644]"
      />
      <span className="w-9 shrink-0 text-right font-mono text-[9px] text-gray-600">
        {value}
      </span>
    </div>
  );
}

export { shadowToCSS, shadowsToFilter };
export type { AllValues, IngredientValues, GlobalValues, ShadowLayer };
