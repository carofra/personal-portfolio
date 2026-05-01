"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";

/** Grain: black micro-dots on light UI; white dots (α 0.05) on dark. Hidden on small screens. */
function NoiseOverlay() {
  const dotLight =
    "radial-gradient(circle at 22% 25%, #000 0.45px, transparent 0.95px), radial-gradient(circle at 78% 35%, #000 0.45px, transparent 0.95px), radial-gradient(circle at 50% 75%, #000 0.4px, transparent 0.9px)";
  const dotDark =
    "radial-gradient(circle at 22% 25%, rgba(255,255,255,0.05) 0.45px, transparent 0.95px), radial-gradient(circle at 78% 35%, rgba(255,255,255,0.05) 0.45px, transparent 0.95px), radial-gradient(circle at 50% 75%, rgba(255,255,255,0.05) 0.4px, transparent 0.9px)";

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] hidden opacity-[0.014] sm:block dark:hidden"
        style={{
          backgroundImage: dotLight,
          backgroundSize: "14px 14px, 16px 16px, 12px 12px",
        }}
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[60] hidden dark:sm:block"
        style={{
          backgroundImage: dotDark,
          backgroundSize: "14px 14px, 16px 16px, 12px 12px",
        }}
      />
    </>
  );
}

export function SmoothScroll({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    const isTouchDevice =
      "ontouchstart" in window || navigator.maxTouchPoints > 0;
    const isMobileViewport = window.innerWidth < 768;

    if (isTouchDevice || isMobileViewport) {
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      autoResize: true,
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };

    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      lenis.destroy();
    };
  }, []);

  return (
    <>
      {children}
      {/* After main so fixed grain sits above the page (main bg is opaque). */}
      <NoiseOverlay />
    </>
  );
}
