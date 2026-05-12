import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { useRef } from "react";

const blocks = [
  { label: "Ecosistema", number: "3", desc: "startups simultáneas pre-seed" },
  { label: "Impacto", number: "$700K+", desc: "en SAFEs abiertos (3 rondas)" },
  { label: "Velocidad", number: "47s", desc: "ETH → SPEI transaction en vivo" },
];

export const MilestonesSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 80%", "end 20%"] });
  const smooth = useSpring(scrollYProgress, { stiffness: 70, damping: 22 });
  const lineScaleX = useTransform(smooth, [0, 1], [0, 1]);

  return (
    <section ref={ref} id="empresas" className="relative bg-background py-[120px] md:px-20 px-6">
      {/* Scroll-driven gold filament */}
      <div className="mx-auto mb-16 hidden max-w-content md:block">
        <div className="relative h-px w-full overflow-hidden bg-white/[0.06]">
          <motion.div
            style={{ scaleX: lineScaleX, transformOrigin: "0% 50%" }}
            className="absolute inset-0 bg-gradient-to-r from-transparent via-gold to-transparent shadow-[0_0_24px_rgba(201,168,76,0.5)]"
          />
        </div>
      </div>
      <div className="mx-auto max-w-content grid gap-10 md:grid-cols-3 md:gap-0">
        {blocks.map((b, i) => (
          <motion.div
            key={b.label}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, delay: i * 0.12, ease: "easeOut" }}
            className={`relative md:px-12 ${i > 0 ? "md:border-l md:border-gold/25" : ""}`}
          >
            <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold">{b.label}</p>
            <div className="font-display text-6xl md:text-7xl text-white tracking-tight">{b.number}</div>
            <p className="mt-4 text-white/55 text-base max-w-xs">{b.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};