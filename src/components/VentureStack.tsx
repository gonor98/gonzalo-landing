import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { useRef } from "react";
import { useScroll, useTransform } from "framer-motion";

const ventures = [
  {
    name: "PropMatch",
    tagline: "El Nasdaq de los bienes raíces tokenizados",
    description:
      "Tokenización institucional sobre Ethereum (ERC-3643). Desbloquea inversión en real estate desde $10 USD con cumplimiento legal embebido en código.",
    metric: "$195M",
    metricLabel: "en LOIs firmados",
    color: "#C9A84C",
    glow: "rgba(201,168,76,0.45)",
    icon: "🏗️",
    safe: "SAFE $1.5M / Cap $10M",
    stage: "Pre-seed",
  },
  {
    name: "CALLII",
    tagline: "El puente Crypto-to-SPEI",
    description:
      "Gateway B2B de pago sobre Bridge.xyz. Liquidación ETH→SPEI en menos de 60 segundos. El desarrollador nunca toca cripto.",
    metric: "47s",
    metricLabel: "ETH → SPEI verificado",
    color: "#00E5CC",
    glow: "rgba(0,229,204,0.4)",
    icon: "⚡",
    safe: "SAFE $500K / Cap $4.5M",
    stage: "Live",
  },
  {
    name: "Finple",
    tagline: "El Duolingo de las inversiones",
    description:
      "Educación financiera gamificada para cerrar la brecha de conocimiento en LATAM y preparar a la próxima generación de inversionistas retail.",
    metric: "D14: 45%",
    metricLabel: "retención objetivo",
    color: "#7C3AED",
    glow: "rgba(124,58,237,0.45)",
    icon: "🎮",
    safe: "SAFE $500K / Cap $5M",
    stage: "Pre-seed",
  },
];

export const VentureStack = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  return (
    <section
      id="ventures"
      ref={ref}
      className="relative bg-background"
      style={{ height: `${ventures.length * 100}vh` }}
      aria-label="Venture Stack"
    >
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <div className="mx-auto w-full max-w-content px-6 md:px-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold"
          >
            The Venture Stack
          </motion.p>
          <h2 className="font-display text-4xl text-white md:text-6xl">
            Tres empresas. <span className="italic text-gold">Un ecosistema.</span>
          </h2>

          <div className="relative mt-12 h-[420px] md:h-[460px]">
            {ventures.map((v, i) => {
              const start = i / ventures.length;
              const end = (i + 1) / ventures.length;
              const opacity = useTransform(
                scrollYProgress,
                [Math.max(0, start - 0.05), start + 0.02, end - 0.05, end + 0.05],
                [0, 1, 1, i === ventures.length - 1 ? 1 : 0],
              );
              const y = useTransform(scrollYProgress, [start, end], [40, -40]);
              const scale = useTransform(scrollYProgress, [start, end], [1, 0.96]);
              return (
                <motion.article
                  key={v.name}
                  style={{ opacity, y, scale, borderColor: `${v.color}55` }}
                  className="absolute inset-0 grid grid-cols-1 gap-8 rounded-[20px] border bg-card/30 p-8 backdrop-blur md:grid-cols-[1.4fr_1fr] md:p-12"
                >
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-[0.32em]"
                      style={{ color: v.color }}
                    >
                      Venture {String(i + 1).padStart(2, "0")} · {v.stage}
                    </p>
                    <h3 className="mt-3 font-display text-5xl text-white md:text-6xl">{v.name}</h3>
                    <p className="mt-3 text-base text-white/80 md:text-lg">{v.tagline}</p>
                    <p className="mt-6 max-w-xl text-sm leading-relaxed text-white/55 md:text-base">
                      {v.description}
                    </p>
                    <div className="mt-8 flex flex-wrap items-center gap-4 text-[11px] uppercase tracking-[0.22em] text-white/50">
                      <span>{v.safe}</span>
                      <span style={{ color: v.color }}>·</span>
                      <a
                        href="/investors"
                        className="inline-flex items-center gap-2 transition-colors hover:text-white"
                        style={{ color: v.color }}
                      >
                        Data Room <ArrowUpRight size={12} />
                      </a>
                    </div>
                  </div>
                  <div
                    className="relative flex flex-col items-center justify-center rounded-[16px] border bg-background/60 p-8 text-center"
                    style={{
                      borderColor: `${v.color}33`,
                      boxShadow: `0 0 80px -20px ${v.glow}`,
                    }}
                  >
                    <div className="text-6xl">{v.icon}</div>
                    <div
                      className="mt-6 font-display text-5xl md:text-6xl"
                      style={{ color: v.color }}
                    >
                      {v.metric}
                    </div>
                    <div className="mt-2 text-[11px] uppercase tracking-[0.22em] text-white/55">
                      {v.metricLabel}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
