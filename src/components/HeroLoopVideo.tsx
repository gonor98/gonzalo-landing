import { useEffect, useRef, useState } from "react";
import { useHeroLoopVideo } from "@/lib/bonusMaterials";

/** Animated gold/dark gradient placeholder shown until the video loads. */
const GradientPoster = () => (
  <div
    aria-hidden
    className="absolute inset-0 animate-pulse bg-[linear-gradient(135deg,#1a1408_0%,#08090F_45%,#3a2a0a_100%)]"
    style={{
      backgroundSize: "200% 200%",
      animation: "heroLoopShimmer 3.2s ease-in-out infinite",
    }}
  />
);

/**
 * Muted, looping conference clip shown floating in the hero.
 * Designed to be visible on both desktop and mobile WITHOUT covering
 * Gonzalo's face in the background portrait.
 *
 *  - Desktop: anchored bottom-left, vertical 9:16 card
 *  - Mobile:  centered above the bottom badge strip, compact 16:9
 */
export const HeroLoopVideo = () => {
  const { provider, source, title } = useHeroLoopVideo();
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    if (!containerRef.current || typeof IntersectionObserver === "undefined") {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setInView(true)),
      { rootMargin: "200px" },
    );
    io.observe(containerRef.current);
    return () => io.disconnect();
  }, []);

  if (!source) return null;

  const ytSrc =
    provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${source}?autoplay=1&mute=1&loop=1&playlist=${source}&controls=0&modestbranding=1&playsinline=1&rel=0`
      : provider === "vimeo"
        ? `https://player.vimeo.com/video/${source}?autoplay=1&loop=1&muted=1&controls=0&background=1`
        : null;

  const Inner = () =>
    !inView ? (
      <GradientPoster />
    ) : provider === "file" ? (
      <video
        src={source}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        className="h-full w-full object-cover"
        aria-label={title}
      />
    ) : ytSrc ? (
      <iframe
        src={ytSrc}
        title={title}
        loading="lazy"
        allow="autoplay; encrypted-media; picture-in-picture"
        className="h-full w-full border-0"
      />
    ) : null;

  return (
    <div ref={containerRef} className="contents">
      <style>{`@keyframes heroLoopShimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>
      {/* Desktop: floating vertical card pinned to bottom-right of the hero,
          inside the soft right-edge fade of the portrait so it does NOT
          cover Gonzalo's face (face sits in the upper portion of portrait). */}
      <div className="pointer-events-none absolute bottom-32 right-8 z-20 hidden lg:block xl:right-12">
        <div className="group pointer-events-auto relative aspect-[9/16] w-[170px] overflow-hidden rounded-2xl border border-gold/40 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur xl:w-[200px]">
          <Inner />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5">
            <p className="text-[9px] uppercase tracking-[0.28em] text-gold">En vivo · keynote</p>
          </div>
        </div>
      </div>

      {/* Mobile: vertical card pinned top-right under nav, in the transparent
          edge of the centered portrait so the face stays clean. */}
      <div className="pointer-events-none absolute right-3 top-24 z-20 lg:hidden">
        <div className="pointer-events-auto relative aspect-[9/16] w-[96px] overflow-hidden rounded-xl border border-gold/40 bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] sm:w-[120px]">
          <Inner />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent px-1.5 py-1">
            <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Keynote</p>
          </div>
        </div>
      </div>
    </div>
  );
};