import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion, useScroll, useMotionValueEvent, useTransform, useSpring } from "framer-motion";
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

  // Preload all stage images on mount so AnimatePresence transitions never
  // flicker or "pop in" while the user scrolls between chapters.
  useEffect(() => {
    states.forEach((s) => {
      const img = new Image();
      img.decoding = "async";
      img.src = s.img;
    });
  }, []);

  // Drive `active` from scroll progress on desktop (sticky behavior).
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // Smooth parallax for the right column.
  const smooth = useSpring(scrollYProgress, { stiffness: 80, damping: 26, restDelta: 0.001 });
  const parallaxY = useTransform(smooth, [0, 1], reduced ? ["0%", "0%"] : ["-3%", "3%"]);
  const imageScale = useTransform(smooth, [0, 0.5, 1], reduced ? [1, 1, 1] : [1.04, 1, 1.04]);

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    // Three thresholds with a small bias so the last state stays visible
    // until the section has fully finished its scroll travel.
    const next = p < 0.34 ? 0 : p < 0.67 ? 1 : 2;
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
    <section
      ref={ref}
      className="relative bg-background md:h-[300vh]"
      aria-label="Recorrido cinemático"
    >
      {/* Desktop: a single sticky stage that pins for the entire section. */}
      <div className="hidden md:block md:sticky md:top-0 md:h-screen md:overflow-hidden">
        <div className="mx-auto grid h-full max-w-content grid-cols-[40%_60%]">
          <div className="flex h-full items-center px-20">
            <div className="w-full max-w-md">
            <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-gold">Capítulo</p>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={current.label}
                  initial={{ opacity: 0, y: reduced ? 0 : 28 }}
                animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: reduced ? 0 : -28 }}
                  transition={{ duration: reduced ? 0.2 : 0.6, ease: [0.22, 1, 0.36, 1] as any }}
                  style={{ willChange: "transform, opacity" }}
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
          <div className="relative h-full overflow-hidden">
            <AnimatePresence mode="sync" initial={false}>
              <motion.div
                key={current.title}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] as any }}
                className="absolute inset-0 cursor-pointer group"
                onClick={() => open(current.videoId, current.title)}
                role="button"
                aria-label={`Reproducir: ${current.title}`}
                style={{ willChange: "opacity" }}
              >
                <motion.img
                  src={current.img}
                  alt={current.alt}
                  style={{ y: parallaxY, scale: imageScale }}
                  className="absolute inset-0 h-[110%] w-full object-cover -top-[5%]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/10 to-background/30" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 bg-background/40 text-gold backdrop-blur transition-transform duration-500 group-hover:scale-110">
                    <Play size={22} className="ml-1" fill="currentColor" />
                  </span>
                </div>
                <div className="absolute inset-0 ring-1 ring-inset ring-gold/10" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Mobile: stacked blocks driven by IntersectionObserver. */}
      <div className="md:hidden">
        {states.map((s, i) => (
          <div key={s.title} className="px-6 py-10">
            <p className="mb-3 font-display italic text-gold/80 text-sm">{s.label}</p>
            <h3 className="font-display text-3xl leading-tight text-white">{s.title}</h3>
            <p className="mt-4 text-white/60 leading-relaxed">{s.body}</p>
            <div
              ref={(el) => (blockRefs.current[i] = el)}
              data-index={i}
              className="group relative mt-6 h-[60vh] w-full cursor-pointer overflow-hidden rounded-2xl"
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
                <span className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-gold/50 bg-background/40 text-gold backdrop-blur">
                  <Play size={20} className="ml-1" fill="currentColor" />
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};