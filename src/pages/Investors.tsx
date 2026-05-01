import { Nav } from "@/components/Nav";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { SEO, personJsonLd } from "@/components/SEO";
import { SocialRail } from "@/components/SocialRail";
import { SiteFooter } from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { Lock, ArrowUpRight, TrendingUp } from "lucide-react";

const safes = [
  {
    name: "PropMatch",
    color: "#C9A84C",
    raise: "$1.5M",
    cap: "$10M",
    progress: 62,
    metric: "$195M LOIs firmados",
    stage: "Pre-seed extension",
  },
  {
    name: "CALLII",
    color: "#00E5CC",
    raise: "$500K",
    cap: "$4.5M",
    progress: 48,
    metric: "47s ETH→SPEI live",
    stage: "Pre-seed",
  },
  {
    name: "Finple",
    color: "#7C3AED",
    raise: "$500K",
    cap: "$5M",
    progress: 22,
    metric: "Producto en build",
    stage: "Pre-seed",
  },
];

const Investors = () => {
  return (
    <main className="relative bg-background text-foreground">
      <SEO
        title="Investor Hub — PropMatch · CALLII · Finple SAFEs"
        description="Stack de inversión PropTech + FinTech + EdTech para LATAM. Rondas SAFE activas: PropMatch ($1.5M / $10M cap), CALLII ($500K / $4.5M), Finple ($500K / $5M)."
        path="/investors"
        jsonLd={personJsonLd}
      />
      <ScrollProgressBar />
      <Nav />
      <SocialRail />

      <section className="relative overflow-hidden pt-40 pb-12 md:pt-52 md:pb-20">
        <div className="absolute inset-0 radial-gold opacity-60" />
        <div className="relative mx-auto max-w-content px-6 md:px-20">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
            <Lock size={11} /> Investor Hub · Acceso restringido
          </div>
          <h1 className="font-display text-5xl leading-[0.98] text-white md:text-7xl">
            El stack <span className="italic text-gold">de inversión</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/65 md:text-lg">
            Tres SAFEs activos cubriendo PropTech, FinTech infrastructure y EdTech. Para VCs LATAM, fondos de US PropTech y ángeles inversionistas con tesis en mercados emergentes.
          </p>
        </div>
      </section>

      {/* SAFE dashboard */}
      <section className="bg-background pb-20">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {safes.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 * i }}
                className="rounded-[18px] border bg-card/40 p-7 backdrop-blur"
                style={{ borderColor: `${s.color}40`, boxShadow: `0 0 60px -30px ${s.color}80` }}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-3xl text-white">{s.name}</h3>
                  <span className="rounded-full px-3 py-1 text-[10px] uppercase tracking-[0.22em]" style={{ background: `${s.color}22`, color: s.color }}>
                    {s.stage}
                  </span>
                </div>

                <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Raise</p>
                    <p className="mt-1 font-display text-2xl" style={{ color: s.color }}>{s.raise}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Cap</p>
                    <p className="mt-1 font-display text-2xl text-white">{s.cap}</p>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.22em] text-white/55">
                    <span>Progreso ronda</span>
                    <span style={{ color: s.color }}>{s.progress}%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-white/8">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.progress}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.4, delay: 0.4 + i * 0.1, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ background: s.color }}
                    />
                  </div>
                </div>

                <div className="mt-6 flex items-center gap-2 text-[12px] text-white/70">
                  <TrendingUp size={14} style={{ color: s.color }} />
                  {s.metric}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-16 flex flex-col items-start gap-4 rounded-[18px] border border-gold/30 bg-gold/[0.05] p-8 md:flex-row md:items-center md:justify-between md:p-10">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Notion Data Room</p>
              <h3 className="mt-2 font-display text-2xl text-white md:text-3xl">
                Solicita acceso al data room completo
              </h3>
              <p className="mt-2 max-w-xl text-sm text-white/60">
                Modelo financiero, deck, cap table, contratos LOI verificados, demos técnicas y roadmap a 36 meses.
              </p>
            </div>
            <a
              href="https://www.notion.so/"
              target="_blank"
              rel="noreferrer noopener"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.5)]"
            >
              Acceder Data Room <ArrowUpRight size={14} />
            </a>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
};

export default Investors;
