import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categories, themes, type ThemeCategory, type KeynoteTheme } from "@/lib/themes";

const ALL = "Todas" as const;

interface ThemesGridProps {
  initialCategory?: ThemeCategory | typeof ALL;
  /** When true, only render first 6 cards + "View all" CTA. */
  compact?: boolean;
}

export const ThemesGrid = ({ initialCategory = ALL, compact = false }: ThemesGridProps) => {
  const [active, setActive] = useState<ThemeCategory | typeof ALL>(initialCategory);
  const [selected, setSelected] = useState<KeynoteTheme | null>(null);

  const filtered =
    active === ALL ? themes : themes.filter((t) => t.category === active);
  const display = compact ? filtered.slice(0, 6) : filtered;

  // Lock scroll when slide-over open
  useEffect(() => {
    if (selected) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [selected]);

  return (
    <section id="speaking" className="relative bg-background py-24 md:py-32" aria-label="Catálogo de keynotes">
      <div className="mx-auto max-w-content px-6 md:px-20">
        {!compact && (
          <div className="mb-12 max-w-3xl">
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Speaking Catalog · 33 temas</p>
            <h2 className="mt-3 font-display text-4xl text-white md:text-6xl">
              El menú 2026 — <span className="italic text-gold">elige tu after-state</span>
            </h2>
            <p className="mt-5 text-base text-white/60 md:text-lg">
              Cada keynote está diseñada para producir un cambio operacional medible el lunes por la mañana.
              Filtra por categoría y abre el detalle para ver el resultado esperado.
            </p>
          </div>
        )}

        {/* Filter chips */}
        <div className="mb-10 flex flex-wrap gap-2">
          {[ALL, ...categories].map((c) => {
            const isActive = active === c;
            const count = c === ALL ? themes.length : themes.filter((t) => t.category === c).length;
            return (
              <button
                key={c}
                onClick={() => setActive(c)}
                className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.18em] transition-all ${
                  isActive
                    ? "border-gold bg-gold text-background"
                    : "border-white/15 text-white/65 hover:border-gold/60 hover:text-gold"
                }`}
              >
                {c} <span className={`ml-1.5 text-[10px] ${isActive ? "text-background/60" : "text-white/35"}`}>{count}</span>
              </button>
            );
          })}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {display.map((t, i) => (
            <motion.button
              key={t.id}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: 0.04 * (i % 6) }}
              onClick={() => setSelected(t)}
              className="group relative overflow-hidden rounded-[14px] border border-white/8 bg-card/40 p-6 text-left transition-all hover:-translate-y-1 hover:border-gold/40 hover:shadow-[0_20px_50px_-20px_rgba(201,168,76,0.4)] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
            >
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">{t.category}</p>
              <h3 className="mt-3 font-display text-xl leading-snug text-white">{t.title}</h3>
              <p className="mt-3 line-clamp-2 text-sm text-white/55">{t.logline}</p>
              <div className="mt-6 flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-gold/80 transition-colors group-hover:text-gold">
                Ver after-state <ArrowUpRight size={12} />
              </div>
              <div className="absolute -right-12 -top-12 h-32 w-32 rounded-full bg-gold/0 blur-2xl transition-all group-hover:bg-gold/10" />
            </motion.button>
          ))}
        </div>

        {compact && (
          <div className="mt-10 flex justify-center">
            <Link
              to="/speaking"
              className="inline-flex items-center gap-3 rounded-full border border-gold/60 px-7 py-3 text-[11px] uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-background"
            >
              Ver los 33 temas <ArrowUpRight size={14} />
            </Link>
          </div>
        )}
      </div>

      {/* SLIDE-OVER */}
      <AnimatePresence>
        {selected && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelected(null)}
              className="fixed inset-0 z-[90] bg-black/70 backdrop-blur-sm"
              aria-hidden
            />
            <motion.aside
              role="dialog"
              aria-modal="true"
              aria-labelledby="theme-detail-title"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 240 }}
              className="fixed inset-y-0 right-0 z-[91] w-full max-w-2xl overflow-y-auto border-l border-gold/20 bg-background p-8 md:p-12"
            >
              <div className="flex items-start justify-between gap-6">
                <p className="text-[10px] uppercase tracking-[0.32em] text-gold">{selected.category}</p>
                <button
                  onClick={() => setSelected(null)}
                  aria-label="Cerrar"
                  className="rounded-full border border-white/15 p-2 text-white/65 transition-all hover:border-gold hover:text-gold"
                >
                  <X size={16} />
                </button>
              </div>

              <h3 id="theme-detail-title" className="mt-4 font-display text-3xl text-white md:text-5xl">
                {selected.title}
              </h3>
              <p className="mt-4 text-base italic text-gold/80">{selected.logline}</p>
              <p className="mt-6 text-base leading-relaxed text-white/70">{selected.description}</p>

              <div className="mt-10">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Qué te llevas</p>
                <ul className="mt-4 space-y-3">
                  {selected.whatYouLearn.map((b) => (
                    <li key={b} className="flex gap-3 text-sm text-white/75">
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
                      <span>{b}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="mt-10 rounded-[14px] border border-gold/30 bg-gold/[0.06] p-6">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">After-state · Lunes por la mañana</p>
                <p className="mt-3 text-base leading-relaxed text-white">{selected.afterState}</p>
              </div>

              <div className="mt-10 flex flex-wrap gap-3">
                <Link
                  to="/booking"
                  className="inline-flex items-center gap-3 rounded-full bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
                  onClick={() => setSelected(null)}
                >
                  Check Availability Q2–Q4 2026 <ArrowUpRight size={12} />
                </Link>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </section>
  );
};
