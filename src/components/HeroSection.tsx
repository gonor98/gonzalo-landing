import { motion, useScroll, useTransform, useSpring, useMotionValue, MotionValue } from "framer-motion";
import { ArrowDown, Play, Sparkles } from "lucide-react";
import { useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePerfMode } from "@/hooks/usePerfMode";
import gonzaloHero from "@/assets/gonzalo-hero.jpg";
import stageImg from "@/assets/gonzalo-talentland-stage.jpg";
import speakingImg from "@/assets/gonzalo-talentland-speaking.jpg";
import panelImg from "@/assets/gonzalo-talentland-panel.jpg";
import presentingImg from "@/assets/gonzalo-talentland-presenting.jpg";
import interviewImg from "@/assets/gonzalo-talentland-interview.jpg";
import bbvaImg from "@/assets/gonzalo-bbva-spark.webp";
import americaDigital from "@/assets/gonzalo-america-digital.webp";
import { useVideo } from "./VideoContext";
import { heroVideo } from "@/lib/videos";
import { HeroLoopVideo } from "./HeroLoopVideo";

const stats = [
  { value: 2.8, suffix: "M+", label: "Audiencia global", sub: "Keynotes en vivo" },
  { value: 200, suffix: "+", label: "Conferencias", sub: "15+ países" },
  { value: 195, suffix: "M", prefix: "$", label: "LOIs firmados", sub: "PropMatch" },
  { value: 47, suffix: "s", label: "ETH → SPEI", sub: "Demo CALLII" },
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

const useParallax = (mv: MotionValue<number>, distance: number) =>
  useSpring(useTransform(mv, [0, 1], [0, distance]), { stiffness: 80, damping: 22, mass: 0.6 });

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 36 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: "easeOut" as const },
});

// Animated number that pops in once
const Stat = ({ s, i }: { s: typeof stats[number]; i: number }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.8, delay: 0.1 * i, ease: "easeOut" }}
    className="border-l border-gold/40 pl-5"
  >
    <div className="font-display text-4xl text-gold md:text-5xl">
      {s.prefix ?? ""}
      {s.value}
      {s.suffix}
    </div>
    <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/55">{s.label}</div>
    <div className="mt-0.5 text-[10px] text-white/35">{s.sub}</div>
  </motion.div>
);

export const HeroSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { open } = useVideo();
  const { reduced } = usePerfMode();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  // Mouse-tracked spotlight (premium feel) — disabled on reduced motion / touch
  const mx = useMotionValue(50);
  const my = useMotionValue(30);
  const mxs = useSpring(mx, { stiffness: 60, damping: 18, mass: 0.4 });
  const mys = useSpring(my, { stiffness: 60, damping: 18, mass: 0.4 });
  useEffect(() => {
    if (reduced) return;
    const el = ref.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const r = el.getBoundingClientRect();
      mx.set(((e.clientX - r.left) / r.width) * 100);
      my.set(((e.clientY - r.top) / r.height) * 100);
    };
    el.addEventListener("mousemove", onMove);
    return () => el.removeEventListener("mousemove", onMove);
  }, [reduced, mx, my]);
  const spotlight = useTransform(
    [mxs, mys] as any,
    ([x, y]: number[]) =>
      `radial-gradient(600px circle at ${x}% ${y}%, rgba(201,168,76,0.18), transparent 60%)`
  );

  // Lighter parallax distances on reduced devices, then we also "freeze" the
  // motion values via inline style overrides below.
  const yBack = useParallax(scrollYProgress, reduced ? 0 : 220);
  const yMid = useParallax(scrollYProgress, reduced ? 0 : 120);
  const yFront = useParallax(scrollYProgress, reduced ? 0 : -60);
  const yText = useTransform(scrollYProgress, [0, 1], ["0%", reduced ? "0%" : "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.7], [1, reduced ? 0.4 : 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, reduced ? 1 : 1.08]);

  return (
    <section
      ref={ref}
      className="relative grain grain-overlay min-h-[120vh] overflow-hidden bg-background"
      aria-label="Hero principal"
    >
      {/* Aurora gradient — animated luminous backdrop */}
      <div className="aurora pointer-events-none absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_120%,rgba(201,168,76,0.22),transparent_70%)]" />

      {/* Mouse-tracked spotlight */}
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden md:block mix-blend-screen"
        style={{ background: spotlight as any }}
      />

      {/* Portrait — desktop */}
      <motion.div
        style={{ y: yBack, scale }}
        className="pointer-events-none absolute inset-y-0 right-[-8%] hidden md:block w-[55vw] max-w-[760px] will-transform"
      >
        <img
          src={gonzaloHero}
          alt="Retrato de Gonzalo Acuña Nava, CEO de PropMatch"
          decoding="async"
          fetchPriority="high"
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

      {/* Portrait — mobile */}
      <motion.div
        style={{ y: yBack, scale }}
        className="pointer-events-none absolute inset-x-0 top-[8vh] md:hidden flex justify-center will-transform"
      >
        <img
          src={gonzaloHero}
          alt=""
          aria-hidden
          loading="lazy"
          decoding="async"
          className="h-[58vh] w-auto object-cover opacity-50"
          style={{
            maskImage: "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 80%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 70% 70% at 50% 40%, black 40%, transparent 80%)",
          }}
        />
      </motion.div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-background via-background/70 to-background/20" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-background/0 via-background/30 to-background" />

      {/* Floating looping conference clip — visible web + mobile, never covers portrait */}
      <HeroLoopVideo />

      {/* Orbital ring */}
      <motion.div
        style={{ y: yMid }}
        className="pointer-events-none absolute right-[8vw] top-[12vh] hidden lg:block will-transform"
      >
        <div className="h-[640px] w-[640px] rounded-full border border-gold/15" />
        <div className="absolute inset-12 rounded-full border border-gold/10" />
      </motion.div>

      {/* Floating polaroid */}
      <motion.div
        style={{ y: yFront, opacity }}
        className="pointer-events-none absolute bottom-[28vh] left-[5%] hidden lg:block will-transform"
      >
        <div className="-rotate-[8deg] rounded-[12px] border border-gold/20 bg-card/40 p-2 shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)] backdrop-blur">
          <img src={speakingImg} alt="" loading="lazy" decoding="async" className="h-36 w-56 rounded-md object-cover" />
          <p className="mt-2 px-2 pb-1 text-[10px] uppercase tracking-[0.22em] text-gold/80">
            Talent Land · 2026
          </p>
        </div>
      </motion.div>

      {/* CONTENT */}
      <motion.div
        style={{ y: yText, opacity }}
        className="relative z-10 mx-auto flex min-h-screen w-full max-w-content flex-col justify-center px-6 pt-32 md:px-20"
      >
        <motion.div {...fadeUp(0)} className="mb-7 flex items-center gap-3">
          <div className="h-px w-10 bg-gold" />
          <p className="text-[11px] uppercase tracking-[0.4em] text-gold">
            Guadalajara · México · 2026
          </p>
        </motion.div>

        <motion.h1
          {...fadeUp(0.15)}
          className="font-display text-[15vw] leading-[0.95] tracking-tight text-white sm:text-7xl md:text-[112px]"
        >
          Gonzalo
          <br />
          <span className="italic text-gold">Acuña</span> Nava
        </motion.h1>

        <motion.p
          {...fadeUp(0.28)}
          className="mt-6 max-w-2xl text-base leading-relaxed text-white/75 md:text-xl"
        >
          <span className="text-white">Business Transformation Voice</span> para la era de la IA · CEO de un
          ecosistema de <span className="text-gold">$200M</span> que une emprendimiento, PropTech y
          finanzas tokenizadas en LATAM.
        </motion.p>

        <motion.p
          {...fadeUp(0.4)}
          className="mt-3 max-w-2xl text-sm text-white/45 md:text-base"
        >
          Forbes 30U30 Nominee · Talent Land 2026 Winner · Web Summit & TNW Finalist
        </motion.p>

        {/* Stats Bento */}
        <div className="mt-14 grid max-w-4xl grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
          {stats.map((s, i) => (
            <Stat key={s.label} s={s} i={i} />
          ))}
        </div>

        {/* CTAs */}
        <motion.div {...fadeUp(0.6)} className="mt-14 flex flex-wrap items-center gap-4">
          <Link
            to="/booking"
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-sm uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.45)]"
          >
            <Sparkles size={14} />
            Reservar Keynote
          </Link>

          <a
            href="#journey"
            className="group inline-flex items-center gap-3 rounded-full border border-gold/60 px-7 py-3.5 text-sm uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-background"
          >
            Conoce el Journey
            <ArrowDown size={14} className="transition-transform group-hover:translate-y-0.5" />
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

        {/* REEL STRIP */}
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

      <div className="absolute bottom-0 left-0 right-0 z-10 border-t border-gold/15 bg-background/60 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 text-[10px] uppercase tracking-[0.32em] text-white/50 md:px-20">
          <span>Forbes 30U30</span>
          <span className="text-gold/40">·</span>
          <span>Talent Land 2026</span>
          <span className="text-gold/40">·</span>
          <span>Web Summit Lisboa</span>
          <span className="text-gold/40">·</span>
          <span>TNW Amsterdam</span>
          <span className="text-gold/40">·</span>
          <span>BBVA Spark</span>
          <span className="text-gold/40">·</span>
          <span>El Economista</span>
        </div>
      </div>
    </section>
  );
};
