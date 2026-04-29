import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import heroImg from "@/assets/hero-gonzalo.jpg";

const stats = [
  { value: "$200M+", label: "en LOIs" },
  { value: "2.8M+", label: "Audiencia Global" },
  { value: "95 / 3", label: "Rechazos · Empresas" },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { duration: 0.8, delay: i * 0.15, ease: [0.22, 1, 0.36, 1] } }),
};

export const HeroSection = () => {
  return (
    <section className="relative grain grain-overlay flex min-h-screen items-center overflow-hidden bg-background pt-24">
      <div
        aria-hidden
        className="absolute inset-0 z-0 opacity-[0.18]"
        style={{
          backgroundImage: `url(${heroImg})`,
          backgroundSize: "cover",
          backgroundPosition: "center right",
          maskImage: "linear-gradient(90deg, transparent 0%, black 60%)",
          WebkitMaskImage: "linear-gradient(90deg, transparent 0%, black 60%)",
        }}
      />
      <div className="absolute inset-0 z-[1] bg-gradient-to-r from-background via-background/70 to-background/20" />
      <div className="absolute inset-0 z-[1] radial-gold opacity-60" />

      <div className="relative z-10 mx-auto w-full max-w-content px-6 md:px-20">
        <motion.p
          custom={0}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mb-6 text-[12px] uppercase tracking-[0.4em] text-gold"
        >
          Gonzalo Acuña Nava · Guadalajara, México
        </motion.p>

        <motion.h1
          custom={1}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="font-display text-5xl leading-[1.02] tracking-tight text-white md:text-[80px]"
        >
          Visionario <br className="md:hidden" />
          <span className="text-gold italic">del</span> PropTech
        </motion.h1>

        <motion.p
          custom={2}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-6 max-w-xl text-lg text-white/55 md:text-xl"
        >
          CEO · PropMatch · CALLII · Finple
        </motion.p>

        <motion.div
          custom={3}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-3 md:max-w-2xl"
        >
          {stats.map((s) => (
            <div key={s.label} className="border-l border-gold/40 pl-4">
              <div className="font-display text-3xl text-gold md:text-4xl">{s.value}</div>
              <div className="mt-1 text-[11px] uppercase tracking-[0.18em] text-white/55">{s.label}</div>
            </div>
          ))}
        </motion.div>

        <motion.div
          custom={4}
          initial="hidden"
          animate="show"
          variants={fadeUp}
          className="mt-12"
        >
          <a
            href="#journey"
            className="group inline-flex items-center gap-3 rounded-full border border-gold px-7 py-3.5 text-sm uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-background"
          >
            Conoce el Journey
            <ArrowDown size={16} className="transition-transform group-hover:translate-y-0.5" />
          </a>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex h-12 w-7 items-start justify-center rounded-full border border-gold/40 p-1.5">
          <div className="h-2 w-1 animate-scroll-down rounded-full bg-gold" />
        </div>
      </motion.div>
    </section>
  );
};