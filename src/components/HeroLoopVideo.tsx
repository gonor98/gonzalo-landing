import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useHeroLoopVideo } from "@/lib/bonusMaterials";
import { usePerfMode } from "@/hooks/usePerfMode";

/** Animated gold/dark gradient placeholder shown only while the embed boots. */
const GradientPoster = () => (
  <div
    aria-hidden
    className="absolute inset-0 bg-[linear-gradient(135deg,#1a1408_0%,#08090F_45%,#3a2a0a_100%)]"
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
  const [loaded, setLoaded] = useState(false);
  const { reduced } = usePerfMode();
  const { scrollYProgress } = useScroll();
  // Gentle parallax: the floating card drifts up as the user scrolls the hero.
  const y = useTransform(scrollYProgress, [0, 0.4], [0, reduced ? 0 : -40]);

  if (!source) return null;

  const ytSrc =
    provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${source}?autoplay=1&mute=1&loop=1&playlist=${source}&controls=0&modestbranding=1&playsinline=1&rel=0&iv_load_policy=3&disablekb=1`
      : provider === "vimeo"
        ? `https://player.vimeo.com/video/${source}?autoplay=1&loop=1&muted=1&controls=0&background=1&playsinline=1`
        : null;

  const Inner = () => (
    <>
      {!loaded && <GradientPoster />}
      {provider === "file" ? (
        <video
          src={source}
          autoPlay
          loop
          muted
          playsInline
          preload="auto"
          onLoadedData={() => setLoaded(true)}
          className="h-full w-full object-cover"
          aria-label={title}
        />
      ) : ytSrc ? (
        <iframe
          src={ytSrc}
          title={title}
          onLoad={() => setLoaded(true)}
          allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
          allowFullScreen
          // Slightly oversize + translate to crop YT chrome and keep loop seamless
          className="absolute inset-0 h-[140%] w-[140%] -translate-x-[14%] -translate-y-[14%] border-0"
        />
      ) : null}
    </>
  );

  return (
    <>
      <style>{`@keyframes heroLoopShimmer{0%,100%{background-position:0% 50%}50%{background-position:100% 50%}}`}</style>

      {/* Desktop: floating vertical card, lower-left of the hero so it sits
          on the dark side and never overlaps Gonzalo's portrait on the right. */}
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute left-8 top-1/2 z-20 hidden -translate-y-1/4 lg:block xl:left-16"
      >
        <div className="group pointer-events-auto relative aspect-[9/16] w-[180px] overflow-hidden rounded-2xl border border-gold/40 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur xl:w-[210px]">
          <Inner />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent p-2.5">
            <p className="text-[9px] uppercase tracking-[0.28em] text-gold">En vivo · keynote</p>
          </div>
        </div>
      </motion.div>

      {/* Mobile: small vertical card pinned bottom-left, above the marquee
          strip and clear of the centered portrait + headline. */}
      <motion.div
        style={{ y }}
        className="pointer-events-none absolute bottom-28 left-4 z-20 lg:hidden"
      >
        <div className="pointer-events-auto relative aspect-[9/16] w-[104px] overflow-hidden rounded-xl border border-gold/40 bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] sm:w-[124px]">
          <Inner />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 to-transparent px-1.5 py-1">
            <p className="text-[8px] uppercase tracking-[0.24em] text-gold">Keynote</p>
          </div>
        </div>
      </motion.div>
    </>
  );
};