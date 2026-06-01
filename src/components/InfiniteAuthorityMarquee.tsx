import { usePerfMode } from "@/hooks/usePerfMode";

/**
 * Infinite, monochromatic logo/text marquee that lives just below the Hero.
 * Renders authority signals (media outlets, universities, programs) in a
 * continuous horizontal scroll with fade-out gradients on both edges.
 *
 * - No external assets: typography-only, so it works the moment the page
 *   loads, never breaks, and stays on the dark/gold palette.
 * - Pure CSS animation. Respects prefers-reduced-motion via usePerfMode.
 * - Accessibility: list semantics + aria-label, content duplicated for the
 *   seamless loop is marked aria-hidden.
 */
const ENTITIES = [
  "El Economista",
  "El Universal",
  "El Financiero",
  "Forbes 30 Under 30",
  "Web Summit Lisboa",
  "TNW Amsterdam",
  "CodeLaunch",
  "Talent Land",
  "Talent Network",
  "POSIBLE",
  "REDi Guadalajara",
  "PLAi",
  "Gobierno de Guadalajara",
  "Gobierno de Zapopan",
  "Gobierno de Jalisco",
  "NotiPress",
  "PropTech LATAM",
  "Finnosummit",
  "Factor FinTech",
  "CETI",
  "IMEF",
  "IMEF Universitarios",
  "Fundación Televisa",
  "Jalisco TV",
  "Startupbootcamp Singapur",
  "Google Cloud",
  "Amazon Web Services",
  "BBVA Spark",
  "Real Estate Market",
];

export const InfiniteAuthorityMarquee = () => {
  const { reduced } = usePerfMode();
  // Duplicate the list once so the translate-x loop is seamless.
  const loop = [...ENTITIES, ...ENTITIES];

  return (
    <section
      aria-label="Apariciones en medios, escenarios y programas"
      className="relative isolate border-y border-gold/10 bg-background py-10"
    >
      <style>{`@keyframes authority-marquee{from{transform:translate3d(0,0,0)}to{transform:translate3d(-50%,0,0)}}`}</style>

      {/* Eyebrow label */}
      <div className="mx-auto mb-6 max-w-content px-6 md:px-20">
        <p className="text-center text-[10px] uppercase tracking-[0.4em] text-gold/80">
          Aparece en · escenarios · alianzas
        </p>
      </div>

      {/* Marquee with fade-out edges */}
      <div
        className="relative overflow-hidden"
        style={{
          WebkitMaskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
          maskImage:
            "linear-gradient(to right, transparent, black 8%, black 92%, transparent)",
        }}
      >
        <ul
          role="list"
          className="flex w-max items-center gap-12 whitespace-nowrap will-change-transform"
          style={
            reduced
              ? undefined
              : {
                  animation: "authority-marquee 60s linear infinite",
                }
          }
        >
          {loop.map((name, i) => (
            <li
              key={`${name}-${i}`}
              aria-hidden={i >= ENTITIES.length || undefined}
              className="flex items-center gap-12 text-[13px] sm:text-sm uppercase tracking-[0.28em] text-white/45 transition-colors hover:text-gold"
            >
              <span className="font-display italic">{name}</span>
              <span className="text-gold/40">◆</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default InfiniteAuthorityMarquee;