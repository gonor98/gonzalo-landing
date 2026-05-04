import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Eye, Link as LinkIcon, Check, GraduationCap, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { PDFPreviewModal } from "@/components/PDFPreviewModal";
import { trackCTAClick, trackDownload, trackPreviewOpen } from "@/lib/track";
import { useBonusMaterials, useDescargasSeo, type BonusMaterial } from "@/lib/bonusMaterials";

const SITE = "https://gonzaloacuna.com";

const Row = ({
  m,
  onPreview,
  onCopy,
  copied,
}: {
  m: BonusMaterial;
  onPreview: () => void;
  onCopy: () => void;
  copied: boolean;
}) => {
  const Icon = m.icon;
  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all hover:border-gold/40 sm:p-6"
    >
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
            <Icon size={20} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">{m.tag}</p>
            <h3 className="mt-1 font-display text-lg text-white sm:text-xl">{m.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/60">{m.description}</p>
            <p className="mt-3 truncate text-[11px] text-white/35">{SITE}{m.href}</p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap sm:justify-end">
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Eye size={13} /> Ver
          </button>
          <button
            type="button"
            onClick={onCopy}
            aria-label="Copiar enlace de descarga"
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            {copied ? <Check size={13} /> : <LinkIcon size={13} />}
            {copied ? "Copiado" : "Copiar enlace"}
          </button>
          <a
            href={m.href}
            download={m.filename}
            onClick={() => {
              trackCTAClick(m.trackId, "bonus_ceti_descargas");
              trackDownload(m.filename, "bonus_ceti_descargas", "download");
            }}
            className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_24px_rgba(201,168,76,0.5)]"
          >
            <Download size={13} /> Descargar
          </a>
        </div>
      </div>
    </motion.li>
  );
};

const BonusCetiDescargas = () => {
  const materials = useBonusMaterials();
  const seo = useDescargasSeo();
  const [preview, setPreview] = useState<null | { src: string; filename: string; title: string; trackId: string }>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const openPreview = (m: BonusMaterial) => {
    trackPreviewOpen(m.filename, "bonus_ceti_descargas");
    trackDownload(m.filename, "bonus_ceti_descargas", "preview");
    setPreview({ src: m.href, filename: m.filename, title: m.title, trackId: m.trackId });
  };

  const copyLink = async (m: BonusMaterial) => {
    const url = `${SITE}${m.href}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(m.id);
      trackCTAClick(`copiar_enlace_${m.id}`, "bonus_ceti_descargas");
      setTimeout(() => setCopiedId((c) => (c === m.id ? null : c)), 1800);
    } catch {
      window.prompt("Copia el enlace:", url);
    }
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title={seo.title}
        description={seo.description}
        path="/bonus-ceti-descargas"
        ogImage={seo.ogImage}
      />
      <Nav />

      <section className="relative overflow-hidden pt-32 pb-12 sm:pt-40 sm:pb-16">
        <div className="aurora absolute inset-0 -z-10 opacity-60" />
        <div className="radial-gold absolute inset-0 -z-10" />
        <div className="mx-auto max-w-content px-6 md:px-20">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
            <GraduationCap size={12} /> Catálogo CETI
          </span>
          <h1 className="mt-6 font-display text-3xl leading-[1.05] text-white sm:text-5xl">
            Descargas directas y <span className="text-gold">enlaces compartibles</span>
          </h1>
          <p className="mt-4 max-w-2xl text-sm text-white/65 sm:text-base">
            Todos los materiales del bonus en un solo catálogo. Copia el enlace de cada PDF para
            enviárselo a tus compañeros o descárgalos al instante.
          </p>
        </div>
      </section>

      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <ul className="flex flex-col gap-4">
            {materials.map((m) => (
              <Row
                key={m.id}
                m={m}
                copied={copiedId === m.id}
                onPreview={() => openPreview(m)}
                onCopy={() => copyLink(m)}
              />
            ))}
          </ul>

          <div className="mt-10 flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 text-sm text-white/65">
            <span>¿Buscas la experiencia completa con beneficios?</span>
            <Link
              to="/bonus-ceti"
              onClick={() => trackCTAClick("ir_bonus_ceti", "bonus_ceti_descargas")}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold hover:bg-gold/10"
            >
              Ir al Bonus CETI <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />

      <PDFPreviewModal
        open={!!preview}
        onClose={() => setPreview(null)}
        src={preview?.src ?? ""}
        filename={preview?.filename ?? ""}
        title={preview?.title ?? ""}
        trackId={preview?.trackId ?? ""}
        location="bonus_ceti_descargas"
      />
    </main>
  );
};

export default BonusCetiDescargas;