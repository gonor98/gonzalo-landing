import { useEffect, useState } from "react";

/**
 * Returns `reduced: true` when the device is likely struggling
 * (small viewport, prefers-reduced-motion, low devicemem, or measured low FPS).
 * Components should fall back to static layouts / disabled parallax.
 */
export function usePerfMode() {
  const [reduced, setReduced] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const prefersReduced =
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
    const isMobile = window.matchMedia?.("(max-width: 767px)").matches ?? false;
    // Safari/Chrome expose deviceMemory in GB on some devices
    const lowMem =
      // @ts-expect-error - non-standard
      typeof navigator !== "undefined" && (navigator.deviceMemory ?? 8) <= 4;
    return prefersReduced || (isMobile && lowMem);
  });

  useEffect(() => {
    if (typeof window === "undefined") return;

    const mqMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mqMobile = window.matchMedia("(max-width: 767px)");
    const sync = () => {
      if (mqMotion.matches) setReduced(true);
    };
    mqMotion.addEventListener?.("change", sync);
    mqMobile.addEventListener?.("change", sync);

    // Lightweight FPS sampler — only runs for ~1.2s after mount.
    let raf = 0;
    let frames = 0;
    const start = performance.now();
    const tick = (t: number) => {
      frames++;
      if (t - start < 1200) {
        raf = requestAnimationFrame(tick);
      } else {
        const fps = (frames * 1000) / (t - start);
        if (fps < 40) setReduced(true);
      }
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      mqMotion.removeEventListener?.("change", sync);
      mqMobile.removeEventListener?.("change", sync);
    };
  }, []);

  return { reduced };
}