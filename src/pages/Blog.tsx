import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock, Search, X } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useMemo, useState } from "react";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { BLOG_POSTS } from "@/lib/blog";
import { trackCTAClick } from "@/lib/track";

const SITE = "https://gonzaloacuna.com";
const PAGE_SIZE = 9;

// Curated topic categories — each maps to keyword fragments that appear in posts.
const CATEGORIES: { id: string; label: string; match: string[] }[] = [
  { id: "all", label: "Todos", match: [] },
  { id: "libro", label: "Libro · Fracasa hasta ganar", match: ["fracasa", "mil flechas", "95 rechazos", "carwash", "validación", "cine-empresa", "código acuña", "tres canastas"] },
  { id: "proptech", label: "PropTech & Tokenización", match: ["proptech", "tokenización", "tokenizar", "erc-3643", "propmatch", "inmobiliari"] },
  { id: "fintech", label: "FinTech & Capital", match: ["fintech", "finple", "callii", "spei", "vc", "ronda", "levantar", "tesis"] },
  { id: "ia", label: "IA Operativa", match: ["ia ", "inteligencia artificial", "ai ", "operativa"] },
  { id: "founder", label: "Liderazgo Founder", match: ["founder", "liderazgo", "marca personal", "mentor", "rechazos"] },
  { id: "prensa", label: "Prensa & Cobertura", match: ["economista", "codelaunch", "medios", "prensa", "cobertura", "notipress"] },
  { id: "edu", label: "Educación & Conferencias", match: ["maestro", "universidad", "doctor", "edtech", "conferenc", "keynote"] },
];

const matchesCategory = (post: (typeof BLOG_POSTS)[number], catId: string) => {
  if (catId === "all") return true;
  const cat = CATEGORIES.find((c) => c.id === catId);
  if (!cat) return true;
  const haystack = [post.title, post.description, post.excerpt, ...post.keywords]
    .join(" ")
    .toLowerCase();
  return cat.match.some((m) => haystack.includes(m));
};

const matchesQuery = (post: (typeof BLOG_POSTS)[number], q: string) => {
  if (!q) return true;
  const needle = q.trim().toLowerCase();
  if (!needle) return true;
  const hay = [post.title, post.description, post.excerpt, ...post.keywords]
    .join(" ")
    .toLowerCase();
  return hay.includes(needle);
};

const Blog = () => {
  const [params, setParams] = useSearchParams();
  const cat = params.get("cat") ?? "all";
  const q = params.get("q") ?? "";
  const page = Math.max(1, Number(params.get("p") ?? "1") || 1);
  const [query, setQuery] = useState(q);

  const filtered = useMemo(
    () => BLOG_POSTS.filter((p) => matchesCategory(p, cat) && matchesQuery(p, q)),
    [cat, q],
  );
  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, totalPages);
  const pageItems = filtered.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

  const setParam = (k: string, v: string | null) => {
    const next = new URLSearchParams(params);
    if (v == null || v === "" || (k === "cat" && v === "all") || (k === "p" && v === "1")) next.delete(k);
    else next.set(k, v);
    // Reset page on filter changes
    if (k === "cat" || k === "q") next.delete("p");
    setParams(next, { replace: true });
  };

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

          {/* Search */}
          <form
            className="mt-8 flex max-w-xl items-center gap-2 rounded-full border border-white/15 bg-white/[0.03] px-4 py-2.5"
            onSubmit={(e) => {
              e.preventDefault();
              setParam("q", query);
            }}
            role="search"
          >
            <Search size={14} className="text-white/45" />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Busca: tokenización, 95 rechazos, IA, ronda…"
              aria-label="Buscar artículos"
              className="flex-1 bg-transparent text-sm text-white placeholder:text-white/35 focus:outline-none"
            />
            {q && (
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setParam("q", "");
                }}
                className="text-white/55 hover:text-white"
                aria-label="Limpiar búsqueda"
              >
                <X size={14} />
              </button>
            )}
            <button
              type="submit"
              className="rounded-full bg-gold px-4 py-1.5 text-[10px] uppercase tracking-[0.22em] text-background"
            >
              Buscar
            </button>
          </form>

          {/* Categories */}
          <div className="mt-5 flex flex-wrap gap-2" role="tablist" aria-label="Categorías del blog">
            {CATEGORIES.map((c) => {
              const active = c.id === cat;
              return (
                <button
                  key={c.id}
                  role="tab"
                  aria-selected={active}
                  onClick={() => setParam("cat", c.id)}
                  className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] transition-colors ${
                    active
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-white/10 bg-white/[0.02] text-white/60 hover:border-gold/40 hover:text-white"
                  }`}
                >
                  {c.label}
                </button>
              );
            })}
          </div>

          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/40">
            {filtered.length} artículo{filtered.length === 1 ? "" : "s"}
            {q && ` · "${q}"`}
          </p>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto grid max-w-content gap-6 px-6 md:grid-cols-2 md:px-20 lg:grid-cols-3">
          {pageItems.length === 0 && (
            <div className="col-span-full rounded-3xl border border-white/10 bg-white/[0.02] p-10 text-center">
              <p className="font-display text-2xl text-white">Sin resultados.</p>
              <p className="mt-2 text-sm text-white/60">
                Prueba con otro tema o limpia los filtros.
              </p>
              <button
                onClick={() => {
                  setQuery("");
                  const next = new URLSearchParams();
                  setParams(next, { replace: true });
                }}
                className="mt-5 inline-flex rounded-full border border-gold/40 px-5 py-2 text-[11px] uppercase tracking-[0.22em] text-gold"
              >
                Limpiar filtros
              </button>
            </div>
          )}
          {pageItems.map((p, i) => (
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

        {/* Pagination */}
        {totalPages > 1 && (
          <nav
            aria-label="Paginación del blog"
            className="mx-auto mt-12 flex max-w-content items-center justify-center gap-2 px-6 md:px-20"
          >
            {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((n) => {
              const active = n === safePage;
              return (
                <button
                  key={n}
                  onClick={() => {
                    setParam("p", String(n));
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  aria-current={active ? "page" : undefined}
                  className={`min-w-9 rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                    active
                      ? "border-gold bg-gold/15 text-gold"
                      : "border-white/10 bg-white/[0.02] text-white/60 hover:border-gold/40 hover:text-white"
                  }`}
                >
                  {n}
                </button>
              );
            })}
          </nav>
        )}
      </section>

      <SiteFooter />
    </main>
  );
};

export default Blog;