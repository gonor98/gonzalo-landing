import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import portrait from "@/assets/gonzalo-portrait.webp";

export const RisingLeaderSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <section id="journey" ref={ref} className="relative overflow-hidden bg-background py-[120px] md:px-20 px-6">
      <div className="mx-auto grid max-w-content gap-12 md:grid-cols-2 md:gap-20 items-start">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="md:sticky md:top-32 order-2 md:order-1"
        >
          <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-gold">El Origen</p>
          <h2 className="font-display text-4xl leading-[1.05] text-white md:text-6xl">
            El Emprendedor que <br />
            Empezó <span className="italic text-gold">Lavando Carros</span>
          </h2>
          <div className="mt-8 space-y-5 text-white/55 text-lg leading-relaxed max-w-xl">
            <p>
              Antes de los términos hojas, antes de los keynotes en Lisboa y Amsterdam,
              hubo una cubeta, una esponja y la convicción de que el oficio honesto era
              el primer escalón.
            </p>
            <p>
              Hoy lidera tres startups simultáneas — PropMatch, CALLII y Finple — con
              más de $700K en SAFEs abiertos y una tesis clara: tokenizar el futuro
              inmobiliario y financiero de Latinoamérica.
            </p>
            <p className="text-gold/80 italic font-display">
              "95 rechazos. 3 empresas. Una sola obsesión: construir."
            </p>
          </div>
        </motion.div>

        <div className="relative order-1 md:order-2 overflow-hidden rounded-[16px] aspect-[4/5] md:aspect-[3/4]">
          <motion.div style={{ y }} className="absolute -inset-y-12 inset-x-0 will-transform">
            <img
              src={portrait}
              alt="Gonzalo Acuña Nava — retrato"
              loading="lazy"
              className="h-full w-full object-cover"
            />
          </motion.div>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background via-background/10 to-transparent" />
          <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-gold/20 rounded-[16px]" />
        </div>
      </div>
    </section>
  );
};