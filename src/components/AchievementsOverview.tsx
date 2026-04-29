import { motion } from "framer-motion";
import { Trophy, Building2, Globe2 } from "lucide-react";

const cards = [
  { icon: Trophy, title: "Forbes 30 Under 30", body: "Nominado al reconocimiento global de liderazgo joven." },
  { icon: Building2, title: "PropMatch", body: "$195M en LOIs firmados · 4 propiedades tokenizadas en Ethereum." },
  { icon: Globe2, title: "Speaker Global", body: "200+ keynotes en 15+ países · 2.8M de audiencia." },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const item = {
  hidden: { opacity: 0, y: 40 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
};

export const AchievementsOverview = () => {
  return (
    <section id="logros" className="relative bg-background py-[120px] md:px-20 px-6">
      <div className="mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex items-end justify-between gap-8 flex-wrap"
        >
          <div>
            <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold">Logros</p>
            <h2 className="font-display text-4xl text-white md:text-5xl max-w-2xl leading-tight">
              Reconocimiento, capital y escenario.
            </h2>
          </div>
        </motion.div>

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid gap-6 md:grid-cols-3"
        >
          {cards.map((c) => (
            <motion.div
              key={c.title}
              variants={item}
              className="glass-gold glass-gold-hover group rounded-[16px] p-8 transition-all duration-500 ease-out"
            >
              <div className="mb-8 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 text-gold transition-transform duration-500 group-hover:rotate-[12deg]">
                <c.icon size={20} />
              </div>
              <h3 className="font-display text-2xl text-white">{c.title}</h3>
              <p className="mt-3 text-sm text-white/55 leading-relaxed">{c.body}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};