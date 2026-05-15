import { motion } from "framer-motion";
import { ArrowUpRight, Calendar, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { PRESS_MENTIONS, OUTLET_LIST } from "@/lib/pressMentions";
import { trackCTAClick } from "@/lib/track";
import pressHero from "@/assets/press-hero.jpg";

const SITE = "https://gonzaloacuna.com";

const CATEGORY_LABEL: Record<string, string> = {
  tier1: "Medios Tier 1",
  industry: "Medios de industria",
  podcast: "Podcasts",
  stage: "Escenarios oficiales",
};

const Press = () => {
  const sorted = [...PRESS_MENTIONS].sort((a, b) => (a.date < b.date ? 1 : -1));

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: "Prensa y menciones · Gonzalo Acuña Nava",
      url: `${SITE}/prensa`,
      about: { "@type": "Person", name: "Gonzalo Acuña Nava", url: SITE },
      hasPart: sorted.map((m) => ({
        "@type": "NewsArticle",
        headline: m.title,
        url: m.url,
        datePublished: m.date,
        publisher: { "@type": "Organization", name: m.outlet },
        about: { "@type": "Person", name: "Gonzalo Acuña Nava" },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
        { "@type": "ListItem", position: 2, name: "Prensa", item: `${SITE}/prensa` },
      ],
    },
  ];

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title="Prensa y menciones · Gonzalo Acuña Nava — El Economista, NotiPress, PropTech LATAM"
        description="Menciones reales de Gonzalo Acuña Nava y PropMatch en El Economista, NotiPress, Real Estate Market, PropTech LATAM Connection, DobleFilo MX, CodeLaunch y más. Backlinks verificables y cobertura tier-1."
        path="/prensa"
        ogImage={pressHero}
        jsonLd={jsonLd}
      />
      <Nav />

      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
        <img
          src={pressHero}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover opacity-25"
          loading="eager"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/80 to-background" />
        <div className="relative mx-auto max-w-content px-6 md:px-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
            Prensa · Cobertura verificada
          </span>
          <h1 className="mt-6 font-display text-4xl leading-[1.05] text-white sm:text-6xl md:text-7xl">
            Lo que la prensa dice <br />
            <span className="italic text-gold">de Gonzalo y PropMatch</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/65 sm:text-lg">
            {PRESS_MENTIONS.length} menciones verificables en {OUTLET_LIST.length} medios de México,
            LATAM, Estados Unidos y España. Cada enlace abre directo en la nota original.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {OUTLET_LIST.map((o) => (
              <span
                key={o}
                className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[11px] text-white/70"
              >
                {o}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-content gap-5 px-6 md:grid-cols-2 md:px-20">
          {sorted.map((m, i) => (
            <motion.a
              key={m.url}
              href={m.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackCTAClick(`press_open_${m.outlet}`, "press_index")}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{ duration: 0.45, delay: i * 0.04 }}
              className="group relative flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-all hover:-translate-y-1 hover:border-gold/40"
            >
              <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em]">
                <span className="text-gold">{m.outlet} · {m.country}</span>
                <span className="text-white/40">{CATEGORY_LABEL[m.category]}</span>
              </div>
              <h2 className="mt-4 font-display text-xl leading-tight text-white group-hover:text-gold">
                {m.title}
              </h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{m.excerpt}</p>
              <div className="mt-5 flex items-center justify-between text-[11px] uppercase tracking-[0.22em] text-white/45">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={12} />
                  {new Date(m.date).toLocaleDateString("es-MX", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
                <span className="inline-flex items-center gap-1.5 text-gold/80 group-hover:text-gold">
                  Leer nota <ArrowUpRight size={13} />
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* CTA */}
        <div className="mx-auto mt-16 max-w-content px-6 md:px-20">
          <div className="rounded-3xl border border-gold/30 bg-gold/[0.06] p-8 sm:p-10">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold">¿Eres periodista?</p>
            <h3 className="mt-2 font-display text-2xl text-white sm:text-3xl">
              Press kit, fotos en alta y entrevistas
            </h3>
            <p className="mt-3 max-w-2xl text-sm text-white/70">
              Si cubres PropTech, IA, blockchain o startups en LATAM y quieres entrevistar a Gonzalo o
              acceder a press kit con datos verificados, escríbenos directo.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/booking"
                onClick={() => trackCTAClick("press_booking", "press_cta")}
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-background hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
              >
                Solicitar entrevista <ArrowUpRight size={13} />
              </Link>
              <a
                href="mailto:gonzalo@propmatchapp.com?subject=Press%20kit%20Gonzalo%20Acu%C3%B1a%20Nava"
                onClick={() => trackCTAClick("press_email", "press_cta")}
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-white/85 hover:border-gold/40 hover:text-gold"
              >
                press@propmatchapp.com <ExternalLink size={13} />
              </a>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Press;
