import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { OGPreviewCard } from "@/components/OGPreviewCard";
import { useDescargasSeo } from "@/lib/bonusMaterials";

const SITE = "https://gonzaloacuna.com";

const BonusCetiDescargasPreview = () => {
  const seo = useDescargasSeo();
  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title="OG Preview · Descargas CETI"
        description="Vista previa de cómo se ve el enlace al compartirlo en redes."
        path="/bonus-ceti-descargas/preview"
      />
      <Nav />
      <section className="pt-32 pb-12 sm:pt-40">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <Link to="/bonus-ceti-admin" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-gold">
            <ArrowLeft size={12} /> Volver al admin
          </Link>
          <h1 className="mt-4 font-display text-3xl text-white sm:text-5xl">
            Vista previa <span className="text-gold">Open Graph</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Así se verá <code>{SITE}/bonus-ceti-descargas</code> al compartirse en
            Twitter/X, LinkedIn, WhatsApp y Facebook.
          </p>
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto grid max-w-3xl gap-8 px-6 md:px-20">
          <OGPreviewCard
            title={seo.title}
            description={seo.description}
            image={seo.ogImage}
            url={`${SITE}/bonus-ceti-descargas`}
          />
          <dl className="grid grid-cols-1 gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm sm:grid-cols-[140px_1fr]">
            <dt className="text-[10px] uppercase tracking-[0.22em] text-white/40">Título</dt>
            <dd className="text-white/85">{seo.title} <span className="ml-2 text-white/40">({seo.title.length} chars)</span></dd>
            <dt className="text-[10px] uppercase tracking-[0.22em] text-white/40">Descripción</dt>
            <dd className="text-white/85">{seo.description} <span className="ml-2 text-white/40">({seo.description.length} chars)</span></dd>
            <dt className="text-[10px] uppercase tracking-[0.22em] text-white/40">Imagen</dt>
            <dd className="break-all text-white/55">{seo.ogImage}</dd>
          </dl>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
};

export default BonusCetiDescargasPreview;