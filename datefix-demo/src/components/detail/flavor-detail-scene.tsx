"use client";

import type { FlavorConfig } from "@/types/flavor";

type FlavorDetailSceneProps = {
  config: FlavorConfig;
};

export default function FlavorDetailScene({ config }: FlavorDetailSceneProps) {
  return (
    <div className="relative w-full">
      {/* Packet only — no ingredients */}
      {config.packetLayer && (
        <div className="relative">
          <div
            style={{
              transform: `scale(${config.packetLayer.scale})`,
              transformOrigin: "top center",
            }}
          >
            <img
              src={config.packetLayer.imagePath}
              alt={config.packetLayer.alt}
              className="block w-full drop-shadow-lg"
              draggable={false}
              decoding="async"
            />
          </div>
        </div>
      )}
    </div>
  );
}
