"use client";

import { useCallback, useRef } from "react";
import { animate } from "animejs";

const MAX_SHIFT_PX = 20;
const RETURN_DURATION = 800;

type LayerRef = {
  element: HTMLDivElement;
  multiplier: number;
};

export function useMagneticFloat() {
  const layerRefs = useRef<LayerRef[]>([]);
  const frameRequested = useRef(false);

  const registerLayer = useCallback(
    (element: HTMLDivElement | null, multiplier: number, index: number) => {
      if (element) {
        layerRefs.current[index] = { element, multiplier };
      }
    },
    [],
  );

  const handleMouseMove = useCallback(
    (event: React.MouseEvent<HTMLDivElement>) => {
      if (frameRequested.current) return;
      frameRequested.current = true;

      const rect = event.currentTarget.getBoundingClientRect();
      const normalizedX =
        ((event.clientX - rect.left) / rect.width) * 2 - 1;
      const normalizedY =
        ((event.clientY - rect.top) / rect.height) * 2 - 1;

      requestAnimationFrame(() => {
        layerRefs.current.forEach(({ element, multiplier }) => {
          const shiftX = normalizedX * multiplier * MAX_SHIFT_PX;
          const shiftY = normalizedY * multiplier * MAX_SHIFT_PX;
          element.style.transform = `translate3d(${shiftX}px, ${shiftY}px, 0)`;
        });
        frameRequested.current = false;
      });
    },
    [],
  );

  const handleMouseLeave = useCallback(() => {
    layerRefs.current.forEach(({ element }) => {
      animate(element, {
        translateX: 0,
        translateY: 0,
        duration: RETURN_DURATION,
        ease: "outExpo",
      });
    });
  }, []);

  return { registerLayer, handleMouseMove, handleMouseLeave };
}
