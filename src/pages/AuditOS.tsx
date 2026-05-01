import { Nav } from "@/components/Nav";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { SEO, personJsonLd } from "@/components/SEO";
import { SocialRail } from "@/components/SocialRail";
import { SiteFooter } from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { Check, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const services = [
  {
    name: "Marketing 1:1 con el CEO",
    tagline: "Results Coaching para founders y CEOs.",
    description:
      "3 horas de sesión maestra con Gonzalo + 30 días de 'sombra' vía WhatsApp directo. Sesiones diseñadas para empresas que facturan $20M+ MXN o startups en etapa Pre-seed/Seed.",
    deliverables: [
      "Sesión maestra de 3 horas (in-person Guadalajara o remota)",
      "30 días de soporte vía WhatsApp 1:1",
      "Plan táctico de 90 días",
      "Garantía de lift medible o sesión extra sin costo",
    ],
    price: "Desde $80,000 MXN",
    cta: "Aplicar",
    highlight: true,
  },
  {
    name: "Business Mastery Offsite",
    tagline: "Día de Estrategia con Dirección.",
    description:
      "8 horas intensivas con tu equipo directivo + cena de integración. Salimos con plan estratégico a 3 años y roadmap de ejecución a 12 meses.",
    deliverables: [
      "Workshop intensivo de 8 horas",
      "Cena estratégica con tu equipo",
      "Plan estratégico 3 años + roadmap 12 meses",
      "Follow-up sesión de 90 minutos a los 30 días",
    ],
    price: "Desde $250,000 MXN",
    cta: "Reservar fecha",
  },
  {
    name: "Auditoría Marketing Digital",
    tagline: "Diagnóstico cinético de 3 semanas.",
    description:
      "30+ métricas analizadas. Para clínicas, despachos legales, agencias inmobiliarias y hoteles en Guadalajara con facturación $10M – $500M MXN.",
    deliverables: [
      "Auditoría de 3 semanas",
      "30+ métricas clave revisadas",
      "Plan de optimización 90 días",
      "Sesión de presentación con tu equipo",
    ],
    price: "$25,000 – $60,000 MXN",
    cta: "Solicitar auditoría",
  },
  {
    name: "Auditoría AI Readiness",
    tagline: "Tu empresa en 4 semanas hacia operación con IA.",
    description:
      "Diagnóstico de 4 semanas para identificar dónde tu empresa puede integrar agentes de IA hoy mismo, sin desestabilizar la operación.",
    deliverables: [
      "Auditoría de 4 semanas",
      "30 métricas de readiness",
      "Stack de IA recomendado por equipo (25/100/500 empleados)",
      "Workshop de implementación de 2 horas",
    ],
    price: "Desde $120,000 MXN",
    cta: "Aplicar",
  },
];

const AuditOS = () => {
  return (
    <main className="relative bg-background text-foreground">
      <SEO
        title="Audit OS — Consultoría 1:1 con Gonzalo Acuña Nava"
        description="Consultoría de alto ticket en marketing digital y AI readiness para medianas empresas. Marketing 1:1 con el CEO, Business Mastery offsites y auditorías cinéticas en Guadalajara."
        path="/audit-os"
        jsonLd={personJsonLd}
      />
      <ScrollProgressBar />
      <Nav />
      <SocialRail />

      <section className="relative overflow-hidden pt-40 pb-16 md:pt-52 md:pb-24">
        <div className="absolute inset-0 radial-gold opacity-60" />
        <div className="relative mx-auto max-w-content px-6 md:px-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Audit OS · Results Coaching</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.98] text-white md:text-7xl">
            Consultoría 1:1 <span className="italic text-gold">con Gonzalo</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/65 md:text-lg">
            Servicios de alto ticket diseñados para CEOs y equipos directivos que necesitan ejecución, no
            teoría. Garantía de ROI medible en 90 días o seguimos sin costo.
          </p>
        </div>
      </section>

      <section className="bg-background pb-32 pt-8">
        <div className="mx-auto grid max-w-content grid-cols-1 gap-6 px-6 md:grid-cols-2 md:px-20">
          {services.map((s, i) => (
            <motion.article
              key={s.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6, delay: 0.08 * i }}
              className={`relative flex flex-col rounded-[18px] border p-8 backdrop-blur transition-all md:p-10 ${
                s.highlight
                  ? "border-gold/60 bg-gold/[0.05] shadow-[0_0_60px_-20px_rgba(201,168,76,0.5)]"
                  : "border-white/10 bg-card/40 hover:border-gold/40"
              }`}
            >
              {s.highlight && (
                <span className="absolute -top-3 left-8 rounded-full bg-gold px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-background">
                  Más solicitado
                </span>
              )}
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{s.tagline}</p>
              <h3 className="mt-3 font-display text-3xl text-white">{s.name}</h3>
              <p className="mt-4 text-sm text-white/65">{s.description}</p>

              <ul className="mt-6 space-y-3">
                {s.deliverables.map((d) => (
                  <li key={d} className="flex gap-3 text-sm text-white/75">
                    <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                    <span>{d}</span>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex items-end justify-between border-t border-white/10 pt-6">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Inversión</p>
                  <p className="mt-1 font-display text-2xl text-gold">{s.price}</p>
                </div>
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-background"
                >
                  {s.cta} <ArrowRight size={12} />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
};

export default AuditOS;
