"use client";

import { useRef } from "react";
import type { SceneLayer } from "@/types/flavor";
import { useIdleAnimation } from "@/hooks/use-idle-animation";

type DetailIngredientLayerProps = {
  layer: SceneLayer;
};

export default function DetailIngredientLayer({ layer }: DetailIngredientLayerProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  useIdleAnimation(elementRef, layer.idleAnimation, false);

  return (
    <div
      ref={elementRef}
      className="pointer-events-none absolute left-1/2 top-0"
      style={{
        willChange: "transform",
        width: `${layer.scale * 100}%`,
        transform: `translateX(-50%) translate(${layer.offsetX}%, ${layer.offsetY}%)`,
      }}
    >
      <img
        src={layer.imagePath}
        alt={layer.alt}
        className="block w-full"
        draggable={false}
        decoding="async"
      />
    </div>
  );
}
