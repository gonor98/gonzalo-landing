import { motion } from "framer-motion";

const blocks = [
  { label: "Ecosistema", number: "3", desc: "startups simultáneas pre-seed" },
  { label: "Impacto", number: "$700K+", desc: "en SAFEs abiertos (3 rondas)" },
  { label: "Velocidad", number: "47s", desc: "ETH → SPEI transaction en vivo" },
];

export const MilestonesSection = () => {
  return (
    <section id="empresas" className="relative bg-background py-[120px] md:px-20 px-6">
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