import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, type MotionValue } from "framer-motion";
import { Crosshair, Eye, Target } from "lucide-react";
import { usePerfMode } from "@/hooks/usePerfMode";

/**
 * "El Framework de las 1,000 Flechas" — scrollytelling de 3 estados que
 * sustituye al StickyScrollSection. Cada estado se ata al progreso de scroll
 * (useScroll) y el lado derecho muestra una visualización limpia y abstracta
 * (puntos esparcidos → puntos convergiendo → bull's-eye dorado).
 */

const STEPS = [
  {
    key: "dispara",
    label: "01 · Dispara",
    title: "Ejecución imperfecta, ahora.",
    body:
      "El perfeccionismo es la parálisis de los perdedores. La primera flecha existe para fallar — su única función es darte datos reales del viento, no del manual.",
    Icon: Crosshair,
  },
  {
    key: "observa",
    label: "02 · Observa",
    title: "El rechazo es feedback gratuito.",
    body:
      "Cuento las flechas, mido la dispersión, etiqueto el patrón. El mercado no miente: la primera versión te dice exactamente cuál variable mover.",
    Icon: Eye,
  },
  {
    key: "calibra",
    label: "03 · Calibra",
    title: "Rechazo #96. El blanco es inevitable.",
    body:
      "Cambias UNA variable, vuelves a disparar, repites. La distancia entre los 95 rechazos y el primer 'sí' no es talento. Es número de intentos calibrados.",
    Icon: Target,
  },
];

/** Single dot — isolated so hooks aren't called inside a map of the parent. */
const ArrowDot = ({ progress, index, total }: { progress: MotionValue<number>; index: number; total: number }) => {
  const angle = (index / total) * Math.PI * 2;
  const startR = 46;
  const endR = 6;
  const x = useTransform(progress, [0, 1], [Math.cos(angle) * startR, Math.cos(angle) * endR]);
  const y = useTransform(progress, [0, 1], [Math.sin(angle) * startR, Math.sin(angle) * endR]);
  const op = useTransform(progress, [0, 0.4, 1], [0.6, 1, 0.95]);
  return (
    <motion.div
      aria-hidden
      style={{ x, y, opacity: op, translateX: "-50%", translateY: "-50%", left: "50%", top: "50%" }}
      className="absolute h-2 w-2 rounded-full bg-gold"
    />
  );
};

/** Right-side abstract visualization: 24 arrow ticks that converge as
 *  the user scrolls. Uses transforms only — pure GPU. */
const ConvergingArrows = ({ progress }: { progress: MotionValue<number> }) => {
  const total = 24;
  const centerOpacity = useTransform(progress, [0, 0.6, 1], [0.15, 0.6, 1]);
  const centerScale = useTransform(progress, [0, 1], [0.6, 1.1]);
  return (
    <div className="relative h-full w-full">
      {/* Faint ring grid */}
      {[0.35, 0.55, 0.75].map((r) => (
        <div
          key={r}
          aria-hidden
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-gold/15"
          style={{ width: `${r * 100}%`, paddingTop: `${r * 100}%` }}
        />
      ))}
      {/* Center bull's-eye that brightens with progress */}
      <motion.div
        aria-hidden
        style={{ opacity: centerOpacity, scale: centerScale }}
        className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_60px_rgba(201,168,76,0.7)]"
      />
      {Array.from({ length: total }).map((_, i) => (
        <ArrowDot key={i} progress={progress} index={i} total={total} />
      ))}
    </div>
  );
};

/** Single step row — isolated so useTransform isn't called in a parent loop. */
const StepRow = ({
  step,
  index,
  total,
  smooth,
}: {
  step: (typeof STEPS)[number];
  index: number;
  total: number;
  smooth: MotionValue<number>;
}) => {
  const lo = index / total;
  const hi = (index + 1) / total;
  const opacity = useTransform(
    smooth,
    [lo - 0.08, lo + 0.05, hi - 0.05, hi + 0.08],
    [0.18, 1, 1, 0.18]
  );
  const Icon = step.Icon;
  return (
    <motion.div style={{ opacity }} className="flex gap-5">
      <span className="mt-1 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
        <Icon size={16} />
      </span>
      <div>
        <p className="font-display italic text-gold/85">{step.label}</p>
        <h3 className="mt-1 font-display text-3xl leading-tight text-white md:text-4xl">
          {step.title}
        </h3>
        <p className="mt-3 max-w-md text-white/65 leading-relaxed">{step.body}</p>
      </div>
    </motion.div>
  );
};

export const FrameworkFlechas = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { reduced } = usePerfMode();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  });
  // Progress 0..1 maps to "the visualization completing".
  // Always call useTransform unconditionally; pick which value to use after.
  const reducedProgress = useTransform(smooth, [0, 1], [1, 1]);
  const vizProgress = reduced ? reducedProgress : smooth;

  return (
    <section
      ref={ref}
      aria-label="Framework de las 1,000 flechas"
      className="relative bg-background md:h-[300vh]"
    >
      <div className="hidden md:block md:sticky md:top-0 md:h-screen md:overflow-hidden">
        <div className="mx-auto grid h-full max-w-content grid-cols-[1fr_1fr] gap-16 px-16">
          {/* Left — text steps, each fades in as it becomes the active band */}
          <div className="flex h-full flex-col justify-center gap-12">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">
              Framework · Las 1,000 flechas
            </p>
            {STEPS.map((step, i) => (
              <StepRow key={step.key} step={step} index={i} total={STEPS.length} smooth={smooth} />
            ))}
          </div>
          {/* Right — converging arrows visualization */}
          <div className="relative flex h-full items-center justify-center">
            <div className="relative aspect-square w-full max-w-[520px]">
              <ConvergingArrows progress={vizProgress} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: stacked, no sticky */}
      <div className="md:hidden px-6 py-12 space-y-12">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold">
          Framework · Las 1,000 flechas
        </p>
        {STEPS.map((step) => {
          const Icon = step.Icon;
          return (
            <motion.div
              key={step.key}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="flex gap-4"
            >
              <span className="mt-1 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 text-gold">
                <Icon size={14} />
              </span>
              <div>
                <p className="font-display italic text-gold/85 text-sm">{step.label}</p>
                <h3 className="mt-1 font-display text-2xl leading-tight text-white">{step.title}</h3>
                <p className="mt-2 text-white/65 leading-relaxed">{step.body}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default FrameworkFlechas;