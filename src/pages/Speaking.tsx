import { Nav } from "@/components/Nav";
import { ThemesGrid } from "@/components/ThemesGrid";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CTASection } from "@/components/CTASection";
import { SEO, personJsonLd, eventJsonLd } from "@/components/SEO";
import { upcomingEvents, pastEvents } from "@/lib/events";
import { SocialRail } from "@/components/SocialRail";
import { SiteFooter } from "@/components/SiteFooter";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const Speaking = () => {
  return (
    <main className="relative bg-background text-foreground">
      <SEO
        title="Speaking Hub — 33 keynotes de Gonzalo Acuña Nava"
        description="Catálogo completo de 33 keynotes en PropTech, IA Operativa, Liderazgo y Resiliencia. Filtra por categoría y reserva disponibilidad para Q2–Q4 2026."
        path="/speaking"
        jsonLd={[personJsonLd, ...upcomingEvents.map(eventJsonLd), ...pastEvents.map(eventJsonLd)]}
      />
      <ScrollProgressBar />
      <Nav />
      <SocialRail />

      <section className="relative overflow-hidden pt-40 pb-16 md:pt-52 md:pb-24">
        <div className="absolute inset-0 radial-gold opacity-70" />
        <div className="relative mx-auto max-w-content px-6 md:px-20">
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-[11px] uppercase tracking-[0.32em] text-gold"
          >
            Speaking Hub · 2026
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="mt-4 font-display text-5xl leading-[0.98] text-white md:text-7xl"
          >
            33 temas. <span className="italic text-gold">Una sola tarima.</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-6 max-w-2xl text-base text-white/65 md:text-lg"
          >
            Cada keynote está diseñada con el modelo "after-state": lo que el equipo ejecuta el lunes
            por la mañana después del aplauso. Filtra por categoría y abre el detalle.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45 }}
            className="mt-8 flex flex-wrap gap-3"
          >
            <Link
              to="/booking"
              className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.45)]"
            >
              Reservar Keynote <ArrowRight size={14} />
            </Link>
          </motion.div>
        </div>
      </section>

      <ThemesGrid />
      <CTASection />
      <SiteFooter />
    </main>
  );
};

export default Speaking;
