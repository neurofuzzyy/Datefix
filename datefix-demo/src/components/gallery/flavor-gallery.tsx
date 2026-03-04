"use client";

import { useRef } from "react";
import { ALL_FLAVORS } from "@/data/flavor-configs";
import FlavorScene from "@/components/flavor-scene/flavor-scene";
import { useEntranceAnimation } from "@/hooks/use-entrance-animation";

export default function FlavorGallery() {
  const containerRef = useRef<HTMLDivElement>(null);
  useEntranceAnimation(containerRef);

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:gap-8"
    >
      {ALL_FLAVORS.map((config) => (
        <FlavorScene key={config.name} config={config} />
      ))}
    </div>
  );
}
