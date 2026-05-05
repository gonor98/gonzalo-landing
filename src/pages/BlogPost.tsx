import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Calendar, Clock } from "lucide-react";
import { Link, Navigate, useParams } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { getPostBySlug, BLOG_POSTS } from "@/lib/blog";
import { trackCTAClick } from "@/lib/track";

const SITE = "https://gonzaloacuna.com";

/** Tiny markdown-ish renderer (## h2, - list, blank-line paragraphs, **bold**). */
const renderBody = (md: string) => {
  const blocks = md.trim().split(/\n\n+/);
  return blocks.map((block, i) => {
    if (block.startsWith("## ")) {
      return (
        <h2 key={i} className="mt-12 font-display text-2xl text-white sm:text-3xl">
          {block.replace(/^##\s+/, "")}
        </h2>
      );
    }
    if (/^[-•]\s/.test(block)) {
      const items = block.split("\n").map((l) => l.replace(/^[-•]\s+/, ""));
      return (
        <ul key={i} className="mt-5 space-y-2.5">
          {items.map((it, j) => (
            <li key={j} className="flex gap-3 text-base leading-relaxed text-white/75">
              <span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-gold" />
              <span dangerouslySetInnerHTML={{ __html: inline(it) }} />
            </li>
          ))}
        </ul>
      );
    }
    return (
      <p
        key={i}
        className="mt-5 text-base leading-[1.75] text-white/75"
        dangerouslySetInnerHTML={{ __html: inline(block) }}
      />
    );
  });
};

const inline = (s: string) =>
  s.replace(/\*\*(.+?)\*\*/g, '<strong class="text-white">$1</strong>');

const BlogPost = () => {
  const { slug } = useParams();
  const post = slug ? getPostBySlug(slug) : null;
  if (!post) return <Navigate to="/blog" replace />;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    keywords: post.keywords.join(", "),
    author: { "@type": "Person", name: "Gonzalo Acuña Nava", url: SITE },
    publisher: { "@type": "Person", name: "Gonzalo Acuña Nava" },
    mainEntityOfPage: `${SITE}/blog/${post.slug}`,
    image: `${SITE}/og-gonzalo.jpg`,
    inLanguage: "es-MX",
    audience: { "@type": "Audience", audienceType: post.audience },
  };

  const others = BLOG_POSTS.filter((p) => p.slug !== post.slug).slice(0, 2);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title={`${post.title} · Blog Gonzalo Acuña Nava`}
        description={post.description}
        path={`/blog/${post.slug}`}
        ogImage="https://gonzaloacuna.com/og-gonzalo.jpg"
        jsonLd={jsonLd}
      />
      <Nav />

      <article className="pt-32 sm:pt-40">
        <div className="mx-auto max-w-3xl px-6 md:px-0">
          <Link to="/blog" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-gold">
            <ArrowLeft size={12} /> Blog
          </Link>
          <div className="mt-6 flex items-center gap-3 text-[11px] uppercase tracking-[0.22em] text-white/45">
            <span className="inline-flex items-center gap-1"><Calendar size={11} /> {new Date(post.date).toLocaleDateString("es-MX", { day: "numeric", month: "long", year: "numeric" })}</span>
            <span>·</span>
            <span className="inline-flex items-center gap-1"><Clock size={11} /> {post.readMinutes} min</span>
          </div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="mt-4 font-display text-4xl leading-[1.05] text-white sm:text-5xl md:text-6xl"
          >
            {post.title}
          </motion.h1>
          <p className="mt-5 text-lg leading-relaxed text-white/65">{post.excerpt}</p>
          <div className="mt-6 flex flex-wrap gap-1.5">
            {post.keywords.map((k) => (
              <span key={k} className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-[10px] text-white/55">
                {k}
              </span>
            ))}
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/35">
            Para: {post.audience}
          </p>
        </div>

        <div className="mx-auto mt-10 max-w-3xl px-6 pb-10 md:px-0">
          <div className="rounded-3xl border border-white/10 bg-white/[0.02] p-6 sm:p-10">
            {renderBody(post.body)}
          </div>

          {/* CTA */}
          <div className="mt-10 rounded-3xl border border-gold/30 bg-gold/[0.06] p-6 sm:p-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Siguiente paso</p>
            <h3 className="mt-2 font-display text-2xl text-white">¿Lo quieres aplicar a tu empresa o evento?</h3>
            <Link
              to={post.cta.to}
              onClick={() => trackCTAClick(`blog_cta_${post.slug}`, "blog_post")}
              className="mt-5 inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-background hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
            >
              {post.cta.label} <ArrowRight size={13} />
            </Link>
          </div>

          {/* More posts */}
          {others.length > 0 && (
            <div className="mt-14">
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">Sigue leyendo</p>
              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {others.map((p) => (
                  <Link
                    key={p.slug}
                    to={`/blog/${p.slug}`}
                    className="group rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-gold/40"
                  >
                    <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">{p.readMinutes} min</p>
                    <h4 className="mt-2 font-display text-lg text-white group-hover:text-gold">{p.title}</h4>
                    <p className="mt-2 line-clamp-2 text-sm text-white/55">{p.excerpt}</p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </article>

      <SiteFooter />
    </main>
  );
};

export default BlogPost;