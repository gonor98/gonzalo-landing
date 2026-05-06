import { Link, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { OGPreviewCard } from "@/components/OGPreviewCard";
import { useBenefits } from "@/lib/benefits";

const SITE = "https://gonzaloacuna.com";
const HUB = {
  title: "Benefits — Conferencias, Material Gratuito y Acceso Premium · Gonzalo Acuña Nava",
  description: "Hub de beneficios: material de conferencias (CETI, eventos LATAM), acceso gratis a plataformas premium, guías y descargas directas para estudiantes y founders.",
  ogImage: `${SITE}/og-gonzalo.jpg`,
  url: `${SITE}/benefits`,
};

const BenefitsPreview = () => {
  const { id } = useParams();
  const benefits = useBenefits();
  const entry = id ? benefits.find((b) => b.id === id) : null;

  const cards = entry
    ? [
        {
          title: `${entry.title} · Gonzalo Acuña Nava`,
          description: entry.description,
          image: HUB.ogImage,
          url: `${SITE}${entry.landingPath ?? "/benefits"}`,
        },
        entry.downloadsPath && {
          title: `Descargas · ${entry.title}`,
          description: entry.description,
          image: HUB.ogImage,
          url: `${SITE}${entry.downloadsPath}`,
        },
      ].filter(Boolean) as Array<{ title: string; description: string; image: string; url: string }>
    : [HUB, ...benefits.map((b) => ({
        title: `${b.title} · Gonzalo Acuña Nava`,
        description: b.description,
        image: HUB.ogImage,
        url: `${SITE}${b.landingPath ?? "/benefits"}`,
      }))];

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO title="OG Preview · Benefits" description="Vista previa de cada landing/descarga del catálogo Benefits." path="/benefits/preview" />
      <Nav />
      <section className="pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <Link to="/bonus-ceti-admin" className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-gold">
            <ArrowLeft size={12} /> Volver al admin
          </Link>
          <h1 className="mt-4 font-display text-3xl text-white sm:text-5xl">
            Vista previa <span className="text-gold">Benefits</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm text-white/60">
            Así se verán las landings/descargas del hub al compartirse en redes. El
            favicon <code>/favicon.png</code> y la imagen <code>/og-gonzalo.jpg</code>
            son los activos globales de marca.
          </p>
        </div>
      </section>
      <section className="pb-24">
        <div className="mx-auto grid max-w-5xl gap-8 px-6 md:grid-cols-2 md:px-20">
          {cards.map((c) => (
            <div key={c.url} className="space-y-2">
              <p className="text-[10px] uppercase tracking-[0.22em] text-gold/70">{c.url}</p>
              <OGPreviewCard {...c} />
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </main>
  );
};

export default BenefitsPreview;