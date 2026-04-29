import { motion } from "framer-motion";

const items = [
  { title: "Forbes 30U30 Nominee", body: "Reconocimiento global al liderazgo joven en PropTech y Fintech.", size: "lg" },
  { title: "Talent Land 2026", body: "Startup Revelación Winner.", size: "sm" },
  { title: "Web Summit Lisboa Finalist", body: "Seleccionado entre miles globalmente.", size: "md" },
  { title: "TNW Amsterdam Finalist", body: "Presencia en escena europea de VC.", size: "sm" },
  { title: "PropTech LATAM Award 2025", body: "Innovador del año en la región.", size: "md" },
  { title: "CALLII: 47s ETH→SPEI", body: "Transacción en vivo verificada en escenario.", size: "lg" },
  { title: "PropMatch · $195M LOIs", body: "4 propiedades tokenizadas en Ethereum.", size: "md" },
  { title: "200+ Keynotes", body: "2.8M personas en 15+ países.", size: "sm" },
  { title: "COPARMEX · US Consulate", body: "Leadership Certification.", size: "md" },
];

const sizeMap: Record<string, string> = {
  sm: "min-h-[180px]",
  md: "min-h-[230px]",
  lg: "min-h-[300px]",
};

export const MasonryGrid = () => {
  return (
    <section className="relative bg-background py-[120px] md:px-20 px-6">
      <div className="mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
          className="mb-14 max-w-3xl"
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold">Trayectoria</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-white">
            La Trayectoria <span className="italic text-gold">en Números</span>
          </h2>
        </motion.div>

        <div className="columns-1 gap-5 md:columns-2 lg:columns-3 [column-fill:_balance]">
          {items.map((it, i) => (
            <motion.div
              key={it.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.55, delay: (i % 3) * 0.08, ease: "easeOut" }}
              className={`mb-5 break-inside-avoid rounded-[16px] border-l-2 border-gold bg-white/[0.02] p-7 ${sizeMap[it.size]} flex flex-col justify-between transition-colors hover:bg-white/[0.04]`}
            >
              <div>
                <h3 className="font-display text-2xl text-white leading-tight">{it.title}</h3>
                <p className="mt-3 text-sm text-white/55 leading-relaxed">{it.body}</p>
              </div>
              <div className="mt-6 h-[1px] w-10 bg-gold/40" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};