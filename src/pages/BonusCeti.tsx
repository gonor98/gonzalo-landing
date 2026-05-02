import { motion } from "framer-motion";
import { Download, Map, Presentation, Sparkles, ArrowRight, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { trackCTAClick } from "@/lib/track";

const PDF_GUIDE = "/bonus-guia-estudiante-ceti.pdf";
const PDF_TALK = "/conferencia-ceti-gonzalo.pdf";
const FINPLE_URL = "https://gonzaloacuna.com/ceti";

type CardProps = {
  icon: React.ElementType;
  tag: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  filename: string;
  trackId: string;
};

const DownloadCard = ({ icon: Icon, tag, title, description, cta, href, filename, trackId }: CardProps) => (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-7 backdrop-blur-xl transition-all hover:border-gold/40 hover:shadow-[0_20px_60px_-20px_rgba(201,168,76,0.35)] sm:p-9"
  >
    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl transition-opacity group-hover:opacity-100 opacity-50" />
    <div className="relative">
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
          <Icon size={22} />
        </div>
        <span className="text-[10px] uppercase tracking-[0.28em] text-gold/80">{tag}</span>
      </div>
      <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">{title}</h3>
      <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">{description}</p>
      <a
        href={href}
        download={filename}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackCTAClick(trackId, "bonus_ceti")}
        className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3.5 text-[12px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.55)] sm:w-auto"
      >
        <Download size={14} /> {cta}
      </a>
    </div>
  </motion.div>
);

const BonusCeti = () => {
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title="Bonus CETI — Gonzalo Acuña Nava"
        description="Regalo exclusivo para estudiantes CETI: guía de inicio (finanzas, IA, mentalidad founder) + slides de la conferencia 95 Rechazos + 1 año GRATIS de Finple Pro."
        path="/bonus-ceti"
      />
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="aurora absolute inset-0 -z-10 opacity-70" />
        <div className="radial-gold absolute inset-0 -z-10" />
        <div className="mx-auto max-w-content px-6 md:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
              <GraduationCap size={12} /> Exclusivo CETI
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] text-white sm:text-6xl md:text-7xl">
              Bonus Exclusivo para <span className="text-gold">Asistentes CETI</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              El mapa de inicio que nadie te enseña en la escuela y que puedes implementar esta semana.
              Un regalo de <span className="text-white">Gonzalo Acuña Nava</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Downloads */}
      <section className="relative pb-20 sm:pb-28">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="mb-10 flex items-end justify-between gap-6">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">Tus descargas</p>
              <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Llévate todo el material</h2>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <DownloadCard
              icon={Map}
              tag="Bonus Guía"
              title="Tu Mapa de Inicio (Bonus Guía)"
              description="Finanzas personales, IA práctica, mentalidad founder y red de contactos. Sin teoría vacía, solo herramientas reales para estudiantes de 17 a 29 años."
              cta="Descargar Guía (PDF)"
              href={PDF_GUIDE}
              filename="bonus-guia-estudiante-ceti.pdf"
              trackId="descarga_guia_ceti"
            />
            <DownloadCard
              icon={Presentation}
              tag="Slides Conferencia"
              title="95 Rechazos (Slides de Conferencia)"
              description="Cómo pasar de lavar autos a liderar PropMatch, CALLII y Finple. El mapa de acción y las notas completas de la conferencia."
              cta="Descargar Presentación (PDF)"
              href={PDF_TALK}
              filename="conferencia-ceti-gonzalo.pdf"
              trackId="descarga_slides_ceti"
            />
          </div>
        </div>
      </section>

      {/* Finple Pro CTA */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] border border-gold/40 bg-gradient-to-br from-gold/20 via-gold/[0.08] to-background p-8 sm:p-14"
          >
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-background/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
                  <Sparkles size={12} /> Tu regalo especial
                </span>
                <h2 className="mt-5 font-display text-3xl leading-tight text-white sm:text-5xl">
                  Acceso a <span className="text-gold">Finple Pro GRATIS</span> por un año
                </h2>
                <p className="mt-4 text-sm text-white/75 sm:text-base">
                  Valor: <span className="text-white">$4,000 MXN</span>. El Duolingo de las inversiones —
                  aprende a invertir jugando, en minutos al día.
                </p>
              </div>
              <a
                href={FINPLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTAClick("reclamar_finple_pro", "bonus_ceti")}
                className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[12px] uppercase tracking-[0.24em] text-background transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.6)]"
              >
                Reclamar Finple Pro <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>

          <p className="mt-10 text-center text-xs text-white/40">
            ¿Dudas? Escríbeme y te respondo personalmente.{" "}
            <Link to="/booking" className="text-gold hover:underline">Agenda una keynote</Link>.
          </p>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default BonusCeti;