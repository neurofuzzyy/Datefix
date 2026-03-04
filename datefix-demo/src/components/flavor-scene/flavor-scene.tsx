"use client";

import { useCallback, useRef, useState } from "react";
import type { FlavorConfig, SceneLayer } from "@/types/flavor";
import SceneLayerComponent from "./scene-layer";
import FlavorLabel from "./flavor-label";
import { useIdleAnimation } from "@/hooks/use-idle-animation";
import { useMagneticFloat } from "@/hooks/use-magnetic-float";

type AnimatedLayerProps = {
  layer: SceneLayer;
  isPacket: boolean;
  isHovered: boolean;
  registerLayer: (
    element: HTMLDivElement | null,
    multiplier: number,
    index: number,
  ) => void;
  layerIndex: number;
};

function AnimatedLayer({
  layer,
  isPacket,
  isHovered,
  registerLayer,
  layerIndex,
}: AnimatedLayerProps) {
  const layerRef = useRef<HTMLDivElement>(null);

  useIdleAnimation(layerRef, layer.idleAnimation, isHovered);

  const setRef = useCallback(
    (element: HTMLDivElement | null) => {
      (layerRef as React.MutableRefObject<HTMLDivElement | null>).current =
        element;
      registerLayer(element, layer.parallaxMultiplier, layerIndex);
    },
    [registerLayer, layer.parallaxMultiplier, layerIndex],
  );

  return (
    <SceneLayerComponent ref={setRef} layer={layer} isPacket={isPacket} />
  );
}

type FlavorSceneProps = {
  config: FlavorConfig;
};

export default function FlavorScene({ config }: FlavorSceneProps) {
  const [isHovered, setIsHovered] = useState(false);
  const { registerLayer, handleMouseMove, handleMouseLeave } =
    useMagneticFloat();

  const allLayers = buildLayerStack(config);

  const onMouseLeave = useCallback(() => {
    setIsHovered(false);
    handleMouseLeave();
  }, [handleMouseLeave]);

  return (
    <div
      data-flavor-card
      className="group relative aspect-square cursor-pointer overflow-hidden rounded-2xl bg-white shadow-sm transition-shadow duration-300 hover:shadow-xl"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={onMouseLeave}
      style={{ opacity: 0 }}
    >
      {allLayers.map((entry, index) => (
        <AnimatedLayer
          key={entry.layer.id}
          layer={entry.layer}
          isPacket={entry.isPacket}
          isHovered={isHovered}
          registerLayer={registerLayer}
          layerIndex={index}
        />
      ))}
      <FlavorLabel
        name={config.displayName}
        colorToken={config.colorToken}
      />
    </div>
  );
}

type LayerEntry = {
  layer: SceneLayer;
  isPacket: boolean;
};

function buildLayerStack(config: FlavorConfig): LayerEntry[] {
  const entries: LayerEntry[] = config.ingredientLayers.map((layer) => ({
    layer,
    isPacket: false,
  }));

  if (config.packetLayer) {
    entries.push({ layer: config.packetLayer, isPacket: true });
  }

  return entries.sort((a, b) => a.layer.zIndex - b.layer.zIndex);
}
