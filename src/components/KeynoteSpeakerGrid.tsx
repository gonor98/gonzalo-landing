import { motion } from "framer-motion";
import propTech from "@/assets/gonzalo-proptech-latam.webp";
import iaFin from "@/assets/gonzalo-fintech-2025.webp";
import latam from "@/assets/gonzalo-talentland-presenting.jpg";
import lider from "@/assets/gonzalo-talentland-panel.jpg";

const cards = [
  { img: propTech, title: "PropTech & Web3", desc: "Tokenización del futuro inmobiliario." },
  { img: iaFin, title: "IA en Finanzas", desc: "Cómo la IA redefine el dinero en LATAM." },
  { img: latam, title: "Emprendimiento LATAM", desc: "De 95 rechazos al escenario global." },
  { img: lider, title: "Liderazgo en Startups", desc: "El método Cine-Empresa." },
];

export const KeynoteSpeakerGrid = () => {
  return (
    <section id="keynotes" className="relative bg-background py-[120px] md:px-20 px-6">
      <div className="mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 max-w-3xl"
        >
          <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold">Speaker</p>
          <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-white">
            Keynotes que Mueven <span className="italic text-gold">Audiencias</span>
          </h2>
          <p className="mt-5 text-white/55 text-lg">200+ talks · 2.8M personas · 15+ países</p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((c, i) => (
            <motion.article
              key={c.title}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: i * 0.08, ease: "easeOut" }}
              className="group relative aspect-[3/4] overflow-hidden rounded-[16px] border border-white/5 transition-transform duration-500 hover:scale-[1.03]"
            >
              <img
                src={c.img}
                alt={c.title}
                loading="lazy"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-background/10" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <h3 className="font-display text-xl text-white">{c.title}</h3>
                <p className="mt-2 text-sm text-white/60">{c.desc}</p>
              </div>
              <div className="absolute inset-x-0 bottom-0 h-[3px] origin-left scale-x-0 bg-gold transition-transform duration-500 group-hover:scale-x-100" />
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};