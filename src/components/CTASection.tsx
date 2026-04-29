import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";

export const CTASection = () => {
  return (
    <section id="contacto" className="relative overflow-hidden bg-background py-[140px] md:px-20 px-6">
      <div className="absolute inset-0 radial-gold opacity-90" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent" />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-content text-center"
      >
        <p className="mb-6 text-[11px] uppercase tracking-[0.32em] text-gold">Disponible 2026</p>
        <h2 className="font-display text-5xl md:text-7xl leading-[1.04] text-white max-w-4xl mx-auto">
          Invita a Gonzalo a tu <br className="hidden md:block" />
          <span className="italic text-gold">Próximo Evento</span>
        </h2>
        <p className="mt-6 text-white/60 text-lg max-w-2xl mx-auto">
          Keynotes en PropTech, Web3, IA, y Emprendimiento desde LATAM.
        </p>

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="mailto:gonavacuu@gmail.com?subject=Keynote%20Booking"
            className="group inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-sm uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.45)]"
          >
            Reservar Keynote
            <ArrowUpRight size={16} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
          <a
            href="#empresas"
            className="inline-flex items-center gap-3 rounded-full border border-gold px-8 py-4 text-sm uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold/10"
          >
            Ver Empresas
          </a>
        </div>

        <p className="mt-20 text-xs uppercase tracking-[0.28em] text-white/35">
          © 2026 Gonzalo Acuña Nava · Guadalajara, México
        </p>
      </motion.div>
    </section>
  );
};