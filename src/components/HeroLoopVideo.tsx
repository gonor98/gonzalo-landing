import { useHeroLoopVideo } from "@/lib/bonusMaterials";

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
  if (!source) return null;

  const ytSrc =
    provider === "youtube"
      ? `https://www.youtube-nocookie.com/embed/${source}?autoplay=1&mute=1&loop=1&playlist=${source}&controls=0&modestbranding=1&playsinline=1&rel=0`
      : provider === "vimeo"
        ? `https://player.vimeo.com/video/${source}?autoplay=1&loop=1&muted=1&controls=0&background=1`
        : null;

  const Inner = () =>
    provider === "file" ? (
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
    <>
      {/* Desktop: bottom-left vertical card. Sits in the dark gradient
          area to NOT overlap with the portrait on the right. */}
      <div className="pointer-events-none absolute bottom-28 left-6 z-20 hidden lg:block">
        <div className="group pointer-events-auto relative aspect-[9/16] w-[180px] overflow-hidden rounded-2xl border border-gold/30 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur xl:w-[210px]">
          <Inner />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-2.5">
            <p className="text-[9px] uppercase tracking-[0.28em] text-gold">En vivo · keynote</p>
          </div>
        </div>
      </div>

      {/* Mobile: compact 16:9 strip pinned bottom-right above badge bar.
          Small enough to leave the portrait fully visible. */}
      <div className="pointer-events-none absolute bottom-20 right-4 z-20 lg:hidden">
        <div className="pointer-events-auto relative aspect-video w-[140px] overflow-hidden rounded-xl border border-gold/30 bg-black shadow-[0_20px_60px_-20px_rgba(0,0,0,0.9)] sm:w-[180px]">
          <Inner />
        </div>
      </div>
    </>
  );
};