"use client";

import { useRef, useCallback } from "react";
import { ALL_FLAVORS } from "@/data/flavor-configs";
import PacketSlot from "@/components/flavor-scene/packet-slot";
import type { PacketSlotHandle } from "@/components/flavor-scene/packet-slot";
import { useEntranceAnimation } from "@/hooks/use-entrance-animation";
import type { AllValues, ShadowLayer } from "@/components/debug/debug-editor";
import type { FlavorName } from "@/types/flavor";

type ProductShowcaseProps = {
  debugOverrides?: AllValues | null;
  onLayerDrag?: (layerId: string, offsetX: number, offsetY: number) => void;
  onLayerResize?: (layerId: string, scale: number) => void;
  onFlavorSelect?: (flavorName: FlavorName) => void;
};

/* ────────────────────────────── Handle positions ────────────────────────────── */

const HANDLE_SIZE = 7;
const HANDLE_STYLE: React.CSSProperties = {
  position: "absolute",
  width: HANDLE_SIZE,
  height: HANDLE_SIZE,
  background: "#fff",
  border: "1.5px solid #1d1644",
  borderRadius: 1,
  pointerEvents: "auto",
};

type HandlePos = "tl" | "t" | "tr" | "r" | "br" | "b" | "bl" | "l";
const HANDLE_CURSORS: Record<HandlePos, string> = {
  tl: "nwse-resize",
  t: "ns-resize",
  tr: "nesw-resize",
  r: "ew-resize",
  br: "nwse-resize",
  b: "ns-resize",
  bl: "nesw-resize",
  l: "ew-resize",
};

function handlePosition(pos: HandlePos): React.CSSProperties {
  const half = -HANDLE_SIZE / 2;
  switch (pos) {
    case "tl": return { top: half, left: half };
    case "t": return { top: half, left: "50%", marginLeft: half };
    case "tr": return { top: half, right: half };
    case "r": return { top: "50%", right: half, marginTop: half };
    case "br": return { bottom: half, right: half };
    case "b": return { bottom: half, left: "50%", marginLeft: half };
    case "bl": return { bottom: half, left: half };
    case "l": return { top: "50%", left: half, marginTop: half };
  }
}

/* ────────────────────────────── DraggableLayer ────────────────────────────── */

function DraggableLayer({
  layer,
  debugOverrides,
  onDrag,
  onResize,
}: {
  layer: {
    id: string;
    imagePath: string;
    alt: string;
    scale: number;
    offsetX: number;
    offsetY: number;
  };
  debugOverrides?: AllValues | null;
  onDrag?: (layerId: string, offsetX: number, offsetY: number) => void;
  onResize?: (layerId: string, scale: number) => void;
}) {
  const overrides = debugOverrides?.[layer.id];
  const scale = overrides?.scale ?? layer.scale;
  const offsetX = overrides?.offsetX ?? layer.offsetX;
  const offsetY = overrides?.offsetY ?? layer.offsetY;

  const dragRef = useRef<{
    startMouseX: number;
    startMouseY: number;
    startOffsetX: number;
    startOffsetY: number;
    parentWidth: number;
  } | null>(null);

  const resizeRef = useRef<{
    startMouseX: number;
    startMouseY: number;
    startScale: number;
    parentWidth: number;
  } | null>(null);

  /* ── Move drag ── */
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!onDrag) return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.currentTarget as HTMLElement;
      const parent = el.closest("[data-flavor-card]") as HTMLElement | null;
      dragRef.current = {
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startOffsetX: offsetX,
        startOffsetY: offsetY,
        parentWidth: parent?.offsetWidth ?? 200,
      };
      el.setPointerCapture(e.pointerId);
    },
    [onDrag, offsetX, offsetY],
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragRef.current || !onDrag) return;
      const { startMouseX, startMouseY, startOffsetX, startOffsetY, parentWidth } =
        dragRef.current;
      const dx = e.clientX - startMouseX;
      const dy = e.clientY - startMouseY;
      const layerWidth = parentWidth * scale;
      const pctX = layerWidth > 0 ? (dx / layerWidth) * 100 : 0;
      const pctY = layerWidth > 0 ? (dy / layerWidth) * 100 : 0;
      onDrag(layer.id, Math.round((startOffsetX + pctX) * 2) / 2, Math.round((startOffsetY + pctY) * 2) / 2);
    },
    [onDrag, layer.id, scale],
  );

  const handlePointerUp = useCallback(() => {
    dragRef.current = null;
  }, []);

  /* ── Resize drag (from handles) ── */
  const handleResizeDown = useCallback(
    (e: React.PointerEvent) => {
      if (!onResize) return;
      e.preventDefault();
      e.stopPropagation();
      const el = e.currentTarget as HTMLElement;
      const parent = el.closest("[data-flavor-card]") as HTMLElement | null;
      resizeRef.current = {
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startScale: scale,
        parentWidth: parent?.offsetWidth ?? 200,
      };
      el.setPointerCapture(e.pointerId);
    },
    [onResize, scale],
  );

  const handleResizeMove = useCallback(
    (e: React.PointerEvent) => {
      if (!resizeRef.current || !onResize) return;
      const { startMouseX, startMouseY, startScale, parentWidth } = resizeRef.current;
      // Use diagonal distance for uniform scale
      const dx = e.clientX - startMouseX;
      const dy = e.clientY - startMouseY;
      const diag = (dx + dy) / 2;
      const scaleDelta = diag / (parentWidth * 0.5);
      const newScale = Math.round(Math.max(0.5, startScale + scaleDelta) * 20) / 20;
      onResize(layer.id, newScale);
    },
    [onResize, layer.id],
  );

  const handleResizeUp = useCallback(() => {
    resizeRef.current = null;
  }, []);

  const isDebug = !!onDrag;
  const handles: HandlePos[] = ["tl", "t", "tr", "r", "br", "b", "bl", "l"];

  return (
    <div
      className={`absolute left-1/2 top-0 ${isDebug ? "cursor-move" : "pointer-events-none"}`}
      style={{
        width: `${scale * 100}%`,
        transform: `translateX(-50%) translate(${offsetX}%, ${offsetY}%)`,
      }}
      onPointerDown={isDebug ? handlePointerDown : undefined}
      onPointerMove={isDebug ? handlePointerMove : undefined}
      onPointerUp={isDebug ? handlePointerUp : undefined}
    >
      {/* Transform box + handles */}
      {isDebug && (
        <div
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            border: "1.5px dashed rgba(29, 22, 68, 0.4)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.5)",
          }}
        >
          {/* Label */}
          <span
            className="absolute left-1 top-1 rounded bg-[#1d1644]/70 px-1 py-0.5 text-white"
            style={{ fontSize: "8px", lineHeight: 1 }}
          >
            {layer.id.split("-").pop()}
          </span>

          {/* Resize handles */}
          {handles.map((pos) => (
            <div
              key={pos}
              style={{
                ...HANDLE_STYLE,
                ...handlePosition(pos),
                cursor: HANDLE_CURSORS[pos],
              }}
              onPointerDown={handleResizeDown}
              onPointerMove={handleResizeMove}
              onPointerUp={handleResizeUp}
            />
          ))}
        </div>
      )}
      <img
        src={layer.imagePath}
        alt={layer.alt}
        className="block w-full"
        draggable={false}
      />
    </div>
  );
}

/* ────────────────────────────── FlavorColumn ────────────────────────────── */

function FlavorColumn({
  config,
  gap,
  packetScale,
  shadows,
  debugOverrides,
  onLayerDrag,
  onLayerResize,
  onFlavorSelect,
}: {
  config: (typeof ALL_FLAVORS)[number];
  gap: number;
  packetScale: number;
  shadows: ShadowLayer[];
  debugOverrides?: AllValues | null;
  onLayerDrag?: (layerId: string, offsetX: number, offsetY: number) => void;
  onLayerResize?: (layerId: string, scale: number) => void;
  onFlavorSelect?: (flavorName: FlavorName) => void;
}) {
  const packetSlotRef = useRef<PacketSlotHandle>(null);

  const behindLayers = config.ingredientLayers.filter(
    (layer) => layer.zIndex < 5,
  );
  const frontLayers = config.ingredientLayers.filter(
    (layer) => layer.zIndex >= 5,
  );

  const handleMouseEnter = useCallback(() => {
    packetSlotRef.current?.rise();
  }, []);

  const handleMouseLeave = useCallback(() => {
    packetSlotRef.current?.lower();
  }, []);

  const handleClick = useCallback(() => {
    if (onFlavorSelect) onFlavorSelect(config.name);
  }, [onFlavorSelect, config.name]);

  return (
    <div
      data-flavor-card
      className="relative overflow-visible"
      style={{
        opacity: 0,
        width: "25%",
        paddingBottom: "20px",
        marginLeft: gap !== 0 ? `${gap / 2}px` : undefined,
        marginRight: gap !== 0 ? `${gap / 2}px` : undefined,
      }}
    >
      {/* Behind-packet ingredients (zIndex < 5) */}
      <div
        className="pointer-events-none absolute inset-x-0 top-0"
        style={{ zIndex: 1 }}
      >
        {behindLayers.map((layer) => (
          <DraggableLayer
            key={layer.id}
            layer={layer}
            debugOverrides={debugOverrides}
            onDrag={onLayerDrag}
            onResize={onLayerResize}
          />
        ))}
      </div>

      {/* Packet (zIndex: 5) */}
      <div className="relative" style={{ zIndex: 5 }}>
        <PacketSlot
          ref={packetSlotRef}
          config={config}
          packetScale={packetScale}
          shadows={shadows}
        />
      </div>

      {/* Hover region — sits at column level (not scaled), can't overlap neighbors.
          Bottom extended by 20px to avoid clipping drop shadows. */}
      <div
        className="absolute inset-x-0 top-0 cursor-pointer"
        style={{ zIndex: 6, bottom: "-20px" }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={handleClick}
      />

      {/* Front-of-packet ingredients (zIndex >= 5) */}
      {frontLayers.length > 0 && (
        <div
          className="pointer-events-none absolute inset-x-0 top-0"
          style={{ zIndex: 10 }}
        >
          {frontLayers.map((layer) => {
            const parentLayer = behindLayers[0];
            const parentOverrides = parentLayer
              ? debugOverrides?.[parentLayer.id]
              : undefined;

            const linkedLayer = parentLayer
              ? {
                  ...layer,
                  scale:
                    parentOverrides?.scale ?? parentLayer.scale,
                  offsetX:
                    parentOverrides?.offsetX ?? parentLayer.offsetX,
                  offsetY:
                    parentOverrides?.offsetY ?? parentLayer.offsetY,
                }
              : layer;
            return (
              <DraggableLayer
                key={linkedLayer.id}
                layer={linkedLayer}
                debugOverrides={undefined}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ────────────────────────────── ProductShowcase ────────────────────────────── */

export default function ProductShowcase({
  debugOverrides,
  onLayerDrag,
  onLayerResize,
  onFlavorSelect,
}: ProductShowcaseProps & {
  onLayerResize?: (layerId: string, scale: number) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  useEntranceAnimation(containerRef);

  const globalOverrides = debugOverrides?.__global;
  const gap = globalOverrides?.gap ?? 0;
  const packetScale = globalOverrides?.packetScale ?? 1;
  const showReference = globalOverrides?.showReference ?? false;
  const referenceOpacity = globalOverrides?.referenceOpacity ?? 0.3;
  const referenceScale = globalOverrides?.referenceScale ?? 2.1;
  const referenceY = globalOverrides?.referenceY ?? -15;
  const shadows: ShadowLayer[] = globalOverrides?.shadows ?? [
    { angle: 57, distance: 14, blur: 5, opacity: 0.28 },
    { angle: 60, distance: 0, blur: 2, opacity: 0 },
  ];

  return (
    <div className="relative">
      {/* Reference image overlay */}
      {showReference && (
        <img
          src="/reference.png"
          alt="Reference"
          className="pointer-events-none absolute left-1/2 z-[55] block w-full"
          style={{
            opacity: referenceOpacity,
            transform: `translateX(-50%) scale(${referenceScale})`,
            transformOrigin: "top center",
            top: `${referenceY}%`,
          }}
          draggable={false}
        />
      )}

      <div
        ref={containerRef}
        className="relative mx-auto flex items-start justify-center"
        style={{ maxWidth: "900px" }}
      >
        {ALL_FLAVORS.map((config) => (
          <FlavorColumn
            key={config.name}
            config={config}
            gap={gap}
            packetScale={packetScale}
            shadows={shadows}
            debugOverrides={debugOverrides}
            onLayerDrag={onLayerDrag}
            onLayerResize={onLayerResize}
            onFlavorSelect={onFlavorSelect}
          />
        ))}
      </div>
    </div>
  );
}
