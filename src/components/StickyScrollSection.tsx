import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
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
  },
  {
    label: "02 · Liderazgo",
    title: "PropMatch · $195M en LOIs",
    body: "Cuatro propiedades tokenizadas, una tesis: convertir el real estate latinoamericano en un activo programable, líquido y accesible desde cualquier wallet.",
    img: propmatch,
    alt: "PropMatch app mockup",
  },
  {
    label: "03 · Escenario",
    title: "Hablando con el Mundo",
    body: "200+ keynotes en 15+ países, 2.8M personas alcanzadas. Web Summit Lisboa, TNW Amsterdam, Talent Land — el método Cine-Empresa llevado a cada escenario relevante.",
    img: keynote,
    alt: "Gonzalo dando keynote",
  },
];

export const StickyScrollSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const blockRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [active, setActive] = useState(0);

  useEffect(() => {
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
            <AnimatePresence mode="wait">
              <motion.div
                key={current.label}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -24 }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              >
                <p className="mb-4 font-display italic text-gold/80">{current.label}</p>
                <h3 className="font-display text-4xl md:text-5xl leading-[1.05] text-white">
                  {current.title}
                </h3>
                <p className="mt-6 text-white/55 text-lg leading-relaxed">{current.body}</p>
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
              className="relative h-screen w-full overflow-hidden"
            >
              <img
                src={s.img}
                alt={s.alt}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-background/20 to-background/40" />
              <div className="absolute inset-0 ring-1 ring-inset ring-gold/10" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};