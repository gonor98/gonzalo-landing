import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent } from "framer-motion";
import { Play } from "lucide-react";
import { useVideo } from "./VideoContext";
import { usePerfMode } from "@/hooks/usePerfMode";
import forbes from "@/assets/gonzalo-acuna-real.webp";
import propmatch from "@/assets/propmatch-app-mockup.webp";
import keynote from "@/assets/gonzalo-talentland-stage.jpg";

const states = [
  {
    label: "01 · Reconocimiento",
    title: "Forbes lo Notó",
    body: "Nominado a Forbes 30 Under 30 por construir el primer marketplace que tokeniza propiedades reales sobre Ethereum, con $195M en LOIs firmados antes del lanzamiento público.",
    img: forbes,
    alt: "Gonzalo en sesión profesional",
    videoId: "cmGTwjjw-kw",
  },
  {
    label: "02 · Liderazgo",
    title: "PropMatch · $195M en LOIs",
    body: "Cuatro propiedades tokenizadas, una tesis: convertir el real estate latinoamericano en un activo programable, líquido y accesible desde cualquier wallet.",
    img: propmatch,
    alt: "PropMatch app mockup",
    videoId: "IxpNirVNaeA",
  },
  {
    label: "03 · Escenario",
    title: "Hablando con el Mundo",
    body: "200+ keynotes en 15+ países, 2.8M personas alcanzadas. Web Summit Lisboa, TNW Amsterdam, Talent Land — el método Cine-Empresa llevado a cada escenario relevante.",
    img: keynote,
    alt: "Gonzalo dando keynote",
    videoId: "dRUZS2rTe8Q",
  },
];

export const StickyScrollSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);
  const { open } = useVideo();
  const { reduced } = usePerfMode();

  // Drive `active` from scroll progress on desktop (sticky behavior).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Three exact thresholds, regardless of card height.
    const next = p < 1 / 3 ? 0 : p < 2 / 3 ? 1 : 2;
    setActive((prev) => (prev === next ? prev : next));
  });

  // Mobile fallback (no sticky): IntersectionObserver per block.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (isDesktop) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = Number((entry.target as HTMLElement).dataset.index);
            setActive(idx);
          }
        });
      },
      { threshold: 0.6, rootMargin: "-20% 0px -20% 0px" }
    );
    blockRefs.current.forEach((b) => b && observer.observe(b));
    return () => observer.disconnect();
  }, []);

  const current = states[active];

  return (
    <section ref={ref} className="relative bg-background">
      <div className="mx-auto grid max-w-content md:grid-cols-[40%_60%] grid-cols-1">
        {/* Sticky Left */}
        <div className="relative md:sticky md:top-0 md:h-screen flex items-center md:px-20 px-6 py-16 md:py-0 order-2 md:order-1">
          <div className="w-full max-w-md">
            <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-gold">Capítulo</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.label}
                initial={{ opacity: 0, y: reduced ? 0 : 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: reduced ? 0 : -24 }}
                transition={{ duration: reduced ? 0.25 : 0.55, ease: "easeOut" as const }}
              >
                <p className="mb-4 font-display italic text-gold/80">{current.label}</p>
                <h3 className="font-display text-4xl md:text-5xl leading-[1.05] text-white">
                  {current.title}
                </h3>
                <p className="mt-6 text-white/55 text-lg leading-relaxed">{current.body}</p>
                <button
                  onClick={() => open(current.videoId, current.title)}
                  className="group mt-8 inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-gold transition-colors hover:text-white"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-gold/50 transition-all group-hover:bg-gold group-hover:text-background">
                    <Play size={14} className="ml-0.5" fill="currentColor" />
                  </span>
                  Ver video
                </button>
              </motion.div>
            </AnimatePresence>

            <div className="mt-10 flex gap-2">
              {states.map((_, i) => (
                <div
                  key={i}
                  className={`h-[2px] flex-1 rounded-full transition-all duration-500 ${
                    i === active ? "bg-gold" : "bg-white/15"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right scrolling images */}
        <div className="order-1 md:order-2">
          {states.map((s, i) => (
            <div
              key={s.title}
              ref={(el) => (blockRefs.current[i] = el)}
              data-index={i}
              className="group relative h-[70vh] md:h-screen w-full cursor-pointer overflow-hidden"
              onClick={() => open(s.videoId, s.title)}
              role="button"
              aria-label={`Reproducir: ${s.title}`}
            >
              <img
                src={s.img}
                alt={s.alt}
                loading={i === 0 ? "eager" : "lazy"}
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/40" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-gold/50 bg-background/40 text-gold opacity-0 backdrop-blur transition-all duration-500 group-hover:scale-110 group-hover:opacity-100">
                  <Play size={22} className="ml-1" fill="currentColor" />
                </span>
              </div>
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};