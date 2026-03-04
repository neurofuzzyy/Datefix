"use client";

import { useEffect, useRef, useCallback } from "react";
import { animate } from "animejs";
import { ArrowLeft } from "lucide-react";
import type { FlavorConfig } from "@/types/flavor";
import FlavorDetailScene from "./flavor-detail-scene";

type FlavorDetailOverlayProps = {
  config: FlavorConfig;
  onClose: () => void;
};

export default function FlavorDetailOverlay({ config, onClose }: FlavorDetailOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const closingRef = useRef(false);

  // Enter animation
  useEffect(() => {
    if (!overlayRef.current || !contentRef.current) return;

    animate(overlayRef.current, {
      opacity: [0, 1],
      duration: 400,
      ease: "outExpo",
    });

    animate(contentRef.current, {
      opacity: [0, 1],
      translateY: [60, 0],
      duration: 600,
      ease: "outExpo",
      delay: 100,
    });
  }, []);

  // Scroll lock
  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const handleClose = useCallback(() => {
    if (closingRef.current) return;
    closingRef.current = true;

    if (!overlayRef.current || !contentRef.current) {
      onClose();
      return;
    }

    animate(contentRef.current, {
      opacity: [1, 0],
      translateY: [0, 40],
      duration: 300,
      ease: "inExpo",
    });

    animate(overlayRef.current, {
      opacity: [1, 0],
      duration: 350,
      ease: "inExpo",
      delay: 50,
      onComplete: onClose,
    });
  }, [onClose]);

  // Escape key
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        handleClose();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[70] flex items-center justify-center"
      style={{ backgroundColor: "rgba(245, 245, 243, 0.97)", opacity: 0 }}
      onClick={handleClose}
    >
      <div
        ref={contentRef}
        className="relative flex max-h-[90vh] w-full max-w-4xl flex-col items-center gap-8 px-6 md:flex-row md:items-center md:gap-12"
        style={{ opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Back button */}
        <button
          onClick={handleClose}
          className="absolute left-6 top-0 flex cursor-pointer items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70 md:-left-2 md:-top-12"
          style={{ color: "#1d1644" }}
        >
          <ArrowLeft size={18} />
          Back
        </button>

        {/* Left: packet + ingredients scene */}
        <div className="relative w-full max-w-sm flex-shrink-0 md:w-1/2">
          <FlavorDetailScene config={config} />
        </div>

        {/* Right: text content */}
        <div className="flex flex-col gap-3 md:w-1/2">
          <h2
            className="text-4xl font-bold tracking-tight md:text-5xl"
            style={{ color: "#1d1644" }}
          >
            {config.displayName}
          </h2>
          <p
            className="text-sm font-medium uppercase tracking-widest"
            style={{ color: config.colorHex }}
          >
            {config.subtitle}
          </p>
          <p className="mt-2 text-base leading-relaxed text-gray-600">
            {config.description}
          </p>
        </div>
      </div>
    </div>
  );
}
