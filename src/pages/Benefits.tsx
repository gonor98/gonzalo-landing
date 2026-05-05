import { motion } from "framer-motion";
import { ArrowRight, Download, Sparkles, GraduationCap, Calendar, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO, personJsonLd } from "@/components/SEO";
import { BENEFITS } from "@/lib/benefits";
import { trackCTAClick } from "@/lib/track";

const Benefits = () => {
  const events = BENEFITS.filter((b) => b.kind === "event");

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title="Benefits — Conferencias, Material Gratuito y Acceso Premium · Gonzalo Acuña Nava"
        description="Hub de beneficios: material de conferencias (CETI, eventos LATAM), acceso gratis a plataformas premium, guías y descargas directas para estudiantes y founders."
        path="/benefits"
        ogImage="https://gonzaloacuna.com/og-gonzalo.jpg"
        jsonLd={personJsonLd}
      />
      <Nav />

      {/* HERO */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="aurora absolute inset-0 -z-10 opacity-60" />
        <div className="radial-gold absolute inset-0 -z-10" />
        <div className="mx-auto max-w-content px-6 md:px-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
            <Sparkles size={12} /> Hub de Benefits
          </span>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="mt-6 font-display text-4xl leading-[1.05] text-white sm:text-6xl md:text-7xl"
          >
            Material gratis, plataformas premium <br />
            y <span className="text-gold italic">beneficios reales</span>
          </motion.h1>
          <p className="mt-6 max-w-2xl text-base text-white/65 sm:text-lg">
            Aquí encuentras todo lo que comparto con la comunidad: material de cada
            conferencia que doy, acceso gratuito a plataformas premium (PropMatch, Finple,
            CALLII), guías exclusivas y descargas directas. Cada vez que doy un evento, su
            material aparece aquí automáticamente.
          </p>
        </div>
      </section>

      {/* EVENTS / CONFERENCES */}
      <section className="relative pb-16">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="mb-8 flex items-end justify-between">
            <h2 className="font-display text-2xl text-white sm:text-4xl">
              Conferencias <span className="text-gold">activas</span>
            </h2>
            <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">
              {events.length} {events.length === 1 ? "evento" : "eventos"}
            </p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {events.map((e, i) => {
              const Icon = e.icon;
              return (
                <motion.article
                  key={e.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-60px" }}
                  transition={{ duration: 0.55, delay: i * 0.06, ease: "easeOut" }}
                  className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-6 transition-all hover:border-gold/40 hover:shadow-[0_30px_80px_-30px_rgba(201,168,76,0.4)] sm:p-8"
                >
                  <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-gold/10 blur-3xl opacity-60 transition-opacity group-hover:opacity-100" />

                  <div className="relative flex flex-col gap-5">
                    <div className="flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
                        <Icon size={22} />
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">{e.badge}</p>
                        <p className="mt-1 flex items-center gap-3 text-[11px] text-white/45">
                          {e.date && (
                            <span className="inline-flex items-center gap-1"><Calendar size={11} /> {e.date}</span>
                          )}
                          {e.location && (
                            <span className="inline-flex items-center gap-1"><MapPin size={11} /> {e.location}</span>
                          )}
                        </p>
                      </div>
                    </div>

                    <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">
                      {e.title}
                    </h3>
                    <p className="text-sm leading-relaxed text-white/65">{e.description}</p>

                    {e.highlights && (
                      <ul className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                        {e.highlights.map((h) => (
                          <li
                            key={h}
                            className="flex items-start gap-2 rounded-xl border border-white/5 bg-white/[0.02] px-3 py-2 text-xs text-white/70"
                          >
                            <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                            {h}
                          </li>
                        ))}
                      </ul>
                    )}

                    <div className="mt-2 flex flex-wrap gap-3">
                      {e.landingPath && (
                        <Link
                          to={e.landingPath}
                          onClick={() => trackCTAClick(`benefits_landing_${e.id}`, "benefits_hub")}
                          className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
                        >
                          Ver experiencia <ArrowRight size={13} />
                        </Link>
                      )}
                      {e.downloadsPath && (
                        <Link
                          to={e.downloadsPath}
                          onClick={() => trackCTAClick(`benefits_downloads_${e.id}`, "benefits_hub")}
                          className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
                        >
                          <Download size={13} /> Descargas directas
                        </Link>
                      )}
                      {e.externalUrl && (
                        <a
                          href={e.externalUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => trackCTAClick(`benefits_external_${e.id}`, "benefits_hub")}
                          className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition-colors hover:border-gold/40 hover:text-gold"
                        >
                          Visitar
                        </a>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="relative pb-24">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">¿Cómo funciona?</p>
            <h2 className="mt-3 font-display text-2xl text-white sm:text-3xl">
              Cada vez que doy un evento, <span className="text-gold">su material vive aquí</span>
            </h2>
            <p className="mt-3 max-w-2xl text-sm text-white/60">
              Conferencias, talleres y eventos especiales se publican en este hub con su
              propia página y descargas. Si asististe a un evento, busca su material aquí —
              el enlace es siempre el mismo.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { t: "1 · Asistes", d: "A una conferencia, taller o keynote." },
                { t: "2 · Material aparece", d: "PDF, video y guías quedan en su página dentro de Benefits." },
                { t: "3 · Descargas y plataformas", d: "Acceso libre a las plataformas premium asociadas." },
              ].map((x) => (
                <div key={x.t} className="rounded-2xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">{x.t}</p>
                  <p className="mt-2 text-sm text-white/75">{x.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Benefits;