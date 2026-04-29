import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { useVideo } from "./VideoContext";
import a from "@/assets/gonzalo-talentland-speaking.jpg";
import b from "@/assets/gonzalo-talentland-interview.jpg";
import c from "@/assets/gonzalo-bbva-spark.webp";

const cards = [
  { img: a, title: "Tech Trends 2026", desc: "Tendencias tecnológicas y su impacto futuro en LATAM.", videoId: "ogxPivoX_78" },
  { img: b, title: "Skills de Liderazgo", desc: "Lo que diferencia a los líderes en tech y en startups en hipercrecimiento.", videoId: "cmGTwjjw-kw" },
  { img: c, title: "Revolución IA", desc: "Cómo la IA redefine industrias globalmente y a quién toma por sorpresa.", videoId: "dRUZS2rTe8Q" },
];

export const KeynotesDetail = () => {
  const { open } = useVideo();
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
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold">Próximas charlas</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-white">
            Tres conversaciones <span className="italic text-gold">que importan</span>
          </h2>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-3">
          {cards.map((card, i) => (
            <motion.button
              key={card.title}
              onClick={() => open(card.videoId, card.title)}
              aria-label={`Reproducir: ${card.title}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.1 }}
              className="group overflow-hidden rounded-[16px] border border-white/5 bg-white/[0.02] text-left transition-colors hover:border-gold/30"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <img src={card.img} alt={card.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                <span className="absolute left-4 top-4 rounded-full bg-gold/95 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.22em] text-background">
                  Keynote
                </span>
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-full border border-gold/60 bg-background/50 text-gold backdrop-blur transition-all group-hover:scale-110 group-hover:bg-gold group-hover:text-background">
                    <Play size={18} className="ml-0.5" fill="currentColor" />
                  </span>
                </span>
              </div>
              <div className="p-7">
                <h3 className="font-display text-2xl text-white">{card.title}</h3>
                <p className="mt-3 text-sm text-white/55 leading-relaxed">{card.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
};