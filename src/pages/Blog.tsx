import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { BLOG_POSTS } from "@/lib/blog";
import { trackCTAClick } from "@/lib/track";

const SITE = "https://gonzaloacuna.com";

const Blog = () => {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Blog · Gonzalo Acuña Nava",
    url: `${SITE}/blog`,
    blogPost: BLOG_POSTS.map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      description: p.description,
      datePublished: p.date,
      keywords: p.keywords.join(", "),
      author: { "@type": "Person", name: "Gonzalo Acuña Nava" },
      url: `${SITE}/blog/${p.slug}`,
    })),
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title="Blog · PropTech, IA Operativa y Liderazgo Founder — Gonzalo Acuña Nava"
        description="Análisis sin bullshit de PropTech LATAM, tokenización inmobiliaria ERC-3643, IA operativa con ROI real y liderazgo founder. Por Gonzalo Acuña Nava."
        path="/blog"
        ogImage="https://gonzaloacuna.com/og-gonzalo.jpg"
        jsonLd={jsonLd}
      />
      <Nav />
      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="aurora absolute inset-0 -z-10 opacity-60" />
        <div className="mx-auto max-w-content px-6 md:px-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
            Blog · Insights de campo
          </span>
          <h1 className="mt-6 font-display text-4xl leading-[1.05] text-white sm:text-6xl">
            Lo que aprendo construyendo, <br />
            <span className="italic text-gold">en formato corto</span>
          </h1>
          <p className="mt-5 max-w-2xl text-base text-white/65">
            PropTech, IA operativa, levantamiento de capital y liderazgo founder en LATAM.
            Sin teoría: lo que veo dentro de PropMatch, CALLII y Finple.
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-content gap-6 px-6 md:grid-cols-2 md:px-20 lg:grid-cols-3">
          {BLOG_POSTS.map((p, i) => (
            <motion.article
              key={p.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.06 }}
              className="group relative flex h-full flex-col overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 transition-all hover:border-gold/40"
            >
              {p.cover && (
                <div className="-mx-6 -mt-6 mb-5 overflow-hidden">
                  <img
                    src={p.cover}
                    alt={p.title}
                    loading="lazy"
                    decoding="async"
                    width={1536}
                    height={864}
                    className="h-44 w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
              )}
              <div className="mb-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/45">
                <span className="inline-flex items-center gap-1"><Calendar size={11} /> {new Date(p.date).toLocaleDateString("es-MX", { day: "numeric", month: "short", year: "numeric" })}</span>
                <span>·</span>
                <span className="inline-flex items-center gap-1"><Clock size={11} /> {p.readMinutes} min</span>
              </div>
              <h2 className="font-display text-xl leading-tight text-white">{p.title}</h2>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{p.excerpt}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.keywords.slice(0, 3).map((k) => (
                  <span key={k} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/50">
                    {k}
                  </span>
                ))}
              </div>
              <Link
                to={`/blog/${p.slug}`}
                onClick={() => trackCTAClick(`blog_open_${p.slug}`, "blog_index")}
                className="mt-5 inline-flex items-center gap-2 self-start rounded-full border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold transition-colors hover:bg-gold/10"
              >
                Leer <ArrowRight size={12} />
              </Link>
            </motion.article>
          ))}
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Blog;