"use client";

import { forwardRef } from "react";
import type { SceneLayer } from "@/types/flavor";

type SceneLayerProps = {
  layer: SceneLayer;
  isPacket?: boolean;
};

const SceneLayerComponent = forwardRef<HTMLDivElement, SceneLayerProps>(
  function SceneLayerComponent({ layer, isPacket = false }, ref) {
    const positionStyle: React.CSSProperties = {
      zIndex: layer.zIndex,
      willChange: "transform",
      ...(isPacket
        ? {
            width: `${layer.scale * 100}%`,
            left: `${50 + layer.offsetX}%`,
            top: `${50 + layer.offsetY}%`,
            transform: "translate(-50%, -50%)",
          }
        : {
            width: "100%",
            height: "100%",
            left: 0,
            top: 0,
          }),
    };

    return (
      <div
        ref={ref}
        className="pointer-events-none absolute"
        style={positionStyle}
      >
        <img
          src={layer.imagePath}
          alt={layer.alt}
          className="block h-auto w-full"
          draggable={false}
          loading="lazy"
          decoding="async"
        />
      </div>
    );
  },
);

export default SceneLayerComponent;
