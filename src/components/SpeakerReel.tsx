import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { videos, thumb } from "@/lib/videos";
import { useVideo } from "./VideoContext";

export const SpeakerReel = () => {
  const { open } = useVideo();
  const [feature, ...rest] = videos;

  return (
    <section className="relative bg-background py-[120px] md:px-20 px-6">
      <div className="mx-auto max-w-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 flex flex-wrap items-end justify-between gap-6"
        >
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold">Speaker Reel</p>
            <h2 className="font-display text-4xl md:text-6xl leading-[1.05] text-white">
              Mira a Gonzalo <span className="italic text-gold">en escena</span>
            </h2>
          </div>
          <p className="text-white/55 text-sm max-w-xs">
            Charlas, entrevistas y momentos clave. Click para abrir cada video en pantalla
            completa — sin autoplay.
          </p>
        </motion.div>

        <div className="grid gap-6 lg:grid-cols-[1.4fr_1fr]">
          {/* Feature */}
          <motion.button
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.7 }}
            onClick={() => open(feature.id, feature.title)}
            className="group relative aspect-video overflow-hidden rounded-[16px] border border-gold/15 text-left"
            aria-label={`Reproducir: ${feature.title}`}
          >
            <img
              src={thumb(feature)}
              alt={feature.title}
              loading="lazy"
              className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="relative inline-flex h-20 w-20 items-center justify-center rounded-full border border-gold/60 bg-background/40 text-gold backdrop-blur transition-all duration-500 group-hover:scale-110 group-hover:bg-gold group-hover:text-background">
                <Play size={26} className="ml-1" fill="currentColor" />
                <span className="absolute inset-0 animate-ping rounded-full border border-gold/40 [animation-duration:2.4s]" />
              </span>
            </div>

            <div className="absolute inset-x-0 bottom-0 p-7">
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{feature.context}</p>
              <h3 className="mt-2 font-display text-2xl text-white md:text-3xl">{feature.title}</h3>
            </div>
          </motion.button>

          {/* Side stack */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            {rest.map((v, i) => (
              <motion.button
                key={v.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                onClick={() => open(v.id, v.title)}
                className="group relative flex items-center gap-4 overflow-hidden rounded-[12px] border border-white/5 bg-white/[0.02] p-3 text-left transition-all hover:border-gold/40 hover:bg-white/[0.04]"
                aria-label={`Reproducir: ${v.title}`}
              >
                <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-md sm:h-16 sm:w-24 lg:h-20 lg:w-32">
                  <img src={thumb(v, "mq")} alt="" loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                    <Play size={14} className="text-gold" fill="currentColor" />
                  </div>
                </div>
                <div className="min-w-0">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gold/80">{v.context}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/85 group-hover:text-white">{v.title}</p>
                </div>
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};