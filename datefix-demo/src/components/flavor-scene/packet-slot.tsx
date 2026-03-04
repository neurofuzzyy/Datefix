"use client";

import { useCallback, useRef, useImperativeHandle, forwardRef } from "react";
import { animate } from "animejs";
import type { FlavorConfig } from "@/types/flavor";
import { shadowToCSS } from "@/components/debug/debug-editor";
import type { ShadowLayer } from "@/components/debug/debug-editor";

type PacketSlotProps = {
  config: FlavorConfig;
  packetScale?: number;
  shadows?: ShadowLayer[];
};

export type PacketSlotHandle = {
  rise: () => void;
  lower: () => void;
};

const HOVER_RISE_PX = -30;
const HOVER_DURATION = 600;

const PacketSlot = forwardRef<PacketSlotHandle, PacketSlotProps>(
  function PacketSlot({ config, packetScale, shadows }, ref) {
    const packetRef = useRef<HTMLDivElement>(null);

    useImperativeHandle(ref, () => ({
      rise() {
        if (!packetRef.current) return;
        animate(packetRef.current, {
          translateY: HOVER_RISE_PX,
          duration: HOVER_DURATION,
          ease: "outExpo",
        });
      },
      lower() {
        if (!packetRef.current) return;
        animate(packetRef.current, {
          translateY: 0,
          duration: HOVER_DURATION,
          ease: "outExpo",
        });
      },
    }));

    const packet = config.packetLayer;
    if (!packet) return null;

    const scale = packetScale ?? packet.scale;

    return (
      <div
        className="pointer-events-none relative"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: "top center",
        }}
      >
        {/* Color shadow clone — purely visual */}
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: config.colorHex,
            WebkitMaskImage: `url(${packet.imagePath})`,
            WebkitMaskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskImage: `url(${packet.imagePath})`,
            maskSize: "contain",
            maskRepeat: "no-repeat",
            maskPosition: "center",
          }}
        />

        {/* Packet + independent shadow layers */}
        <div
          ref={packetRef}
          className="pointer-events-none relative"
          style={{ willChange: "transform" }}
        >
          {shadows && shadows.map((shadow, idx) => (
            <img
              key={idx}
              src={packet.imagePath}
              alt=""
              aria-hidden
              className="absolute inset-0 block w-full"
              style={{ filter: shadowToCSS(shadow) }}
              draggable={false}
              decoding="async"
            />
          ))}
          <img
            src={packet.imagePath}
            alt={packet.alt}
            className="relative block w-full"
            draggable={false}
            decoding="async"
          />
        </div>
      </div>
    );
  },
);

export default PacketSlot;
