"use client";

import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";

export function useEntranceAnimation(
  containerRef: React.RefObject<HTMLDivElement | null>,
) {
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const cards = containerRef.current.querySelectorAll("[data-flavor-card]");
    if (cards.length === 0) return;

    animationRef.current = animate(cards, {
      opacity: [0, 1],
      translateY: [40, 0],
      scale: [0.95, 1],
      duration: 800,
      ease: "outExpo",
      delay: stagger(120, { start: 200 }),
    });

    return () => {
      animationRef.current?.revert();
    };
  }, [containerRef]);
}
