import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import { ArrowDown, Play } from "lucide-react";
import { useRef } from "react";
import gonzaloHero from "@/assets/gonzalo-hero-portrait.png";
import stageImg from "@/assets/gonzalo-talentland-stage.jpg";
import speakingImg from "@/assets/gonzalo-talentland-speaking.jpg";
import panelImg from "@/assets/gonzalo-talentland-panel.jpg";
import presentingImg from "@/assets/gonzalo-talentland-presenting.jpg";
import interviewImg from "@/assets/gonzalo-talentland-interview.jpg";
import bbvaImg from "@/assets/gonzalo-bbva-spark.webp";
import americaDigital from "@/assets/gonzalo-america-digital.webp";
import { useVideo } from "./VideoContext";
import { heroVideo } from "@/lib/videos";

const stats = [
  { value: "$200M+", label: "en LOIs" },
  { value: "2.8M+", label: "Audiencia Global" },
  { value: "95 / 3", label: "Rechazos · Empresas" },
];

const reel = [
  { img: stageImg, label: "Talent Land · Estadio principal", videoId: "cmGTwjjw-kw" },
  { img: speakingImg, label: "Keynote PropTech LATAM", videoId: "ogxPivoX_78" },
  { img: americaDigital, label: "America Digital · CDMX", videoId: "dRUZS2rTe8Q" },
  { img: panelImg, label: "Panel · El futuro del Real Estate", videoId: "IxpNirVNaeA" },
  { img: presentingImg, label: "Cine-Empresa en escena", videoId: "3j9FIxzT__A" },
  { img: interviewImg, label: "Entrevista · Forbes 30U30", videoId: "cmGTwjjw-kw" },
  { img: bbvaImg, label: "BBVA Spark · Founders LATAM", videoId: "ogxPivoX_78" },
];

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: "easeOut" as const },
});

const useParallax = (mv: MotionValue<number>, distance: number) =>
  useSpring(useTransform(mv, [0, 1], [0, distance]), { stiffness: 80, damping: 20, mass: 0.6 });

export const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { open } = useVideo();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const yBack = useParallax(scrollYProgress, 220);
  const yMid = useParallax(scrollYProgress, 120);
  const yFront = useParallax(scrollYProgress, -60);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.08]);

  return (
    <section
      ref={ref}
      className="relative grain grain-overlay min-h-[120vh] overflow-hidden bg-background"
    >
      {/* LAYER 1 — Gonzalo portrait, anchored right, slowest */}
      <motion.div
        style={{ y: yBack, scale }}
        className="pointer-events-none absolute inset-y-0 right-[-8%] hidden md:block w-[55vw] max-w-[760px] will-transform"
      >
        <img
          src={gonzaloHero}
          alt="Retrato de Gonzalo Acuña Nava"
          className="h-full w-full object-cover object-top opacity-90"
          style={{
            maskImage:
              "linear-gradient(90deg, transparent 0%, black 35%, black 75%, transparent 100%), radial-gradient(ellipse 80% 90% at 60% 45%, black 55%, transparent 95%)",
            WebkitMaskImage:
              "linear-gradient(90deg, transparent 0%, black 35%, black 75%, transparent 100%), radial-gradient(ellipse 80% 90% at 60% 45%, black 55%, transparent 95%)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        />
      </motion.div>

      {/* Mobile portrait */}
      <motion.div
        style={{ y: yBack, scale }}
        className="pointer-events-none absolute inset-x-0 top-[8vh] md:hidden flex justify-center will-transform"
      >
        <img
          src={gonzaloHero}
          alt="Retrato de Gonzalo Acuña Nava"
          className="h-[58vh] w-auto object-cover opacity-50"
          style={{
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 80%)",
          }}
        />
      </motion.div>

      {/* Background gradients */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(201,168,76,0.18),transparent_70%)]" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />

      {/* LAYER 2 — gold orbital ring */}
      <motion.div
        style={{ y: yMid }}
        className="pointer-events-none absolute right-[8vw] top-[12vh] hidden lg:block will-transform"
      >
        <div className="h-[640px] w-[640px] rounded-full border border-gold/15" />
        <div className="absolute inset-12 rounded-full border border-gold/10" />
      </motion.div>

      {/* LAYER 3 — floating polaroid (left bottom) */}
      <motion.div
        style={{ y: yFront, opacity }}
        className="pointer-events-none absolute bottom-[28vh] left-[5%] hidden lg:block will-transform"
      >
        <div className="-rotate-[8deg] rounded-[12px] border border-gold/20 bg-card/40 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
          <img src={speakingImg} alt="" className="h-36 w-56 rounded-md object-cover" />
          <p className="mt-2 px-2 pb-1 text-[10px] uppercase tracking-[0.22em] text-gold/80">
            Talent Land · 2026
          </p>
        </div>
      </motion.div>

      {/* CENTER CONTENT */}
      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-content flex-col justify-center px-6 pt-32 md:px-20"
      >
        <motion.div {...fadeUp(0)} className="mb-7 flex items-center gap-3">
          <div className="h-px w-10 bg-gold" />
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
            Guadalajara · México
          </p>
        </motion.div>

        <motion.h1
          {...fadeUp(0.15)}
          className="font-display text-[15vw] leading-[0.95] tracking-tight text-white sm:text-7xl md:text-[112px]"
        >
          Visionario
          <br />
          <span className="italic text-gold">del</span> PropTech
        </motion.h1>

        <motion.p
          {...fadeUp(0.3)}
          className="mt-8 max-w-xl text-base leading-relaxed text-white/65 md:text-xl"
        >
          CEO & co-fundador de <span className="text-white">PropMatch</span>,{" "}
          <span className="text-white">CALLII</span> y{" "}
          <span className="text-white">Finple</span> — tokenizando el real estate y las
          finanzas de Latinoamérica desde el escenario.
        </motion.p>

        {/* Stats */}
        <motion.div
          {...fadeUp(0.45)}
          className="mt-14 grid max-w-3xl grid-cols-1 gap-8 sm:grid-cols-3"
        >
          {stats.map((s) => (
            <div key={s.label} className="border-l border-gold/40 pl-5">
              <div className="font-display text-3xl text-gold md:text-4xl">{s.value}</div>
              <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/55">
                {s.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.6)} className="mt-14 flex flex-wrap items-center gap-4">
          <a
            href="#journey"
            className="group inline-flex items-center gap-3 rounded-full border border-gold px-7 py-3.5 text-sm uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-background"
          >
            Conoce el Journey
            <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
          </a>

          <button
            onClick={() => open(heroVideo.id, heroVideo.title)}
            className="group inline-flex items-center gap-3 text-sm uppercase tracking-[0.22em] text-white/80 transition-colors hover:text-gold"
            aria-label={`Reproducir reel: ${heroVideo.title}`}
          >
            <span className="relative inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 transition-all group-hover:border-gold group-hover:bg-gold group-hover:text-background">
              <Play size={16} className="ml-0.5" fill="currentColor" />
              <span className="absolute inset-0 animate-ping rounded-full border border-gold/40 [animation-duration:2.4s]" />
            </span>
            Ver el reel · 2:14
          </button>
        </motion.div>

        {/* SCROLL-SNAP REEL STRIP */}
        <motion.div {...fadeUp(0.8)} className="mt-16 md:mt-20">
          <div className="mb-4 flex items-end justify-between">
            <p className="text-[10px] uppercase tracking-[0.32em] text-gold/80">
              Momentos clave · Desliza →
            </p>
            <p className="hidden text-[10px] uppercase tracking-[0.28em] text-white/40 sm:block">
              {reel.length} clips
            </p>
          </div>
          <div
            className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 md:-mx-20 md:px-20 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="list"
            aria-label="Reel de momentos destacados"
          >
            {reel.map((r, i) => (
              <button
                key={`${r.videoId}-${i}`}
                onClick={() => open(r.videoId)}
                role="listitem"
                aria-label={`Reproducir clip: ${r.label}`}
                className="group relative aspect-[3/4] w-[58vw] sm:w-[280px] shrink-0 snap-start overflow-hidden rounded-[14px] border border-gold/15 bg-card/40 text-left transition-all hover:border-gold/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
              >
                <img
                  src={r.img}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background via-background/30 to-transparent" />
                <span className="absolute right-3 top-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-gold/50 bg-background/40 text-gold backdrop-blur transition-all group-hover:bg-gold group-hover:text-background">
                  <Play size={12} className="ml-0.5" fill="currentColor" />
                </span>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <p className="text-[10px] uppercase tracking-[0.22em] text-gold/80">
                    Clip 0{i + 1}
                  </p>
                  <p className="mt-1 line-clamp-2 text-sm text-white/90">{r.label}</p>
                </div>
              </button>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        style={{ opacity }}
        className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-gold/40 p-1.5">
          <div className="h-2 w-1 animate-scroll-down rounded-full bg-gold" />
        </div>
      </motion.div>

      {/* Bottom marquee strip */}
      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-gold/15 bg-background/60 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 text-[10px] uppercase tracking-[0.32em] text-white/50 md:px-20">
          <span>Forbes 30U30</span>
          <span className="text-gold/40">·</span>
          <span>Web Summit Lisboa</span>
          <span className="text-gold/40">·</span>
          <span>TNW Amsterdam</span>
          <span className="text-gold/40">·</span>
          <span>Talent Land Winner</span>
          <span className="text-gold/40">·</span>
          <span>BBVA Spark</span>
        </div>
      </div>
    </section>
  );
};
