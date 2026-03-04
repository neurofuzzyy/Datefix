"use client";

import { useEffect, useRef } from "react";
import { animate } from "animejs";
import type { IdleAnimationParams } from "@/types/flavor";

export function useIdleAnimation(
  elementRef: React.RefObject<HTMLDivElement | null>,
  params: IdleAnimationParams,
  isHovered: boolean,
) {
  const animationRef = useRef<ReturnType<typeof animate> | null>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    animationRef.current = animate(elementRef.current, {
      translateX: [-params.floatAmplitudeX, params.floatAmplitudeX],
      translateY: [-params.floatAmplitudeY, params.floatAmplitudeY],
      rotate: [-params.rotateAmplitude, params.rotateAmplitude],
      duration: params.floatDuration,
      delay: params.floatDelay,
      ease: "inOutSine",
      loop: true,
      alternate: true,
      autoplay: true,
    });

    return () => {
      animationRef.current?.revert();
    };
  }, [elementRef, params]);

  useEffect(() => {
    if (!animationRef.current) return;

    if (isHovered) {
      animationRef.current.pause();
    } else {
      animationRef.current.play();
    }
  }, [isHovered]);
}
