"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import ProductShowcase from "@/components/gallery/product-showcase";
import DebugEditor from "@/components/debug/debug-editor";
import FlavorDetailOverlay from "@/components/detail/flavor-detail-overlay";
import { ALL_FLAVORS } from "@/data/flavor-configs";
import type { AllValues } from "@/components/debug/debug-editor";
import type { FlavorName } from "@/types/flavor";

export default function Home() {
  const [debugOpen, setDebugOpen] = useState(false);
  const [debugValues, setDebugValues] = useState<AllValues | null>(null);
  const [dragValues, setDragValues] = useState<AllValues | null>(null);
  const [selectedFlavor, setSelectedFlavor] = useState<FlavorName | null>(null);
  const dragValuesRef = useRef(debugValues);
  dragValuesRef.current = debugValues;

  const selectedConfig = selectedFlavor
    ? ALL_FLAVORS.find((f) => f.name === selectedFlavor) ?? null
    : null;

  const handleFlavorSelect = useCallback((flavorName: FlavorName) => {
    setSelectedFlavor(flavorName);
  }, []);

  const handleDetailClose = useCallback(() => {
    setSelectedFlavor(null);
  }, []);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "=") {
        setDebugOpen((prev) => !prev);
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleDebugChange = useCallback((values: AllValues) => {
    setDebugValues(values);
  }, []);

  const handleLayerDrag = useCallback(
    (layerId: string, offsetX: number, offsetY: number) => {
      const current = dragValuesRef.current;
      const existing = current?.[layerId];
      if (!existing || typeof existing !== "object" || !("scale" in existing))
        return;
      setDragValues({
        [layerId]: {
          scale: existing.scale,
          offsetX,
          offsetY,
        },
      } as AllValues);
    },
    [],
  );

  const handleLayerResize = useCallback(
    (layerId: string, scale: number) => {
      const current = dragValuesRef.current;
      const existing = current?.[layerId];
      if (!existing || typeof existing !== "object" || !("scale" in existing))
        return;
      setDragValues({
        [layerId]: {
          scale,
          offsetX: existing.offsetX,
          offsetY: existing.offsetY,
        },
      } as AllValues);
    },
    [],
  );

  return (
    <div className="min-h-screen bg-[#f5f5f3]">
      <header className="flex items-center justify-center px-6 pt-16 pb-20">
        <img
          src="/logo.png"
          alt="DateFix"
          className="h-10 w-auto md:h-14"
          draggable={false}
        />
      </header>
      <main
        className="flex w-full items-center justify-center px-6"
        style={{ paddingBottom: debugOpen ? "300px" : "96px" }}
      >
        <ProductShowcase
          debugOverrides={debugValues}
          onLayerDrag={debugOpen ? handleLayerDrag : undefined}
          onLayerResize={debugOpen ? handleLayerResize : undefined}
          onFlavorSelect={handleFlavorSelect}
        />
      </main>

      <div className={debugOpen ? undefined : "hidden"}>
        <DebugEditor
          onValuesChange={handleDebugChange}
          externalValues={dragValues}
        />
      </div>

      {selectedConfig && (
        <FlavorDetailOverlay
          config={selectedConfig}
          onClose={handleDetailClose}
        />
      )}
    </div>
  );
}
