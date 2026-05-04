import { useState } from "react";
import { motion } from "framer-motion";
import { Download, Sparkles, ArrowRight, GraduationCap, Eye, PlayCircle, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { trackCTAClick, trackDownload, trackPreviewOpen, trackVideo } from "@/lib/track";
import { PDFPreviewModal } from "@/components/PDFPreviewModal";
import {
  FINPLE_URL,
  useBonusMaterials,
  useConferenceVideo,
  type BonusMaterial,
} from "@/lib/bonusMaterials";
import { useRef } from "react";

type CardProps = {
  material: BonusMaterial;
  onPreview: () => void;
};

const DownloadCard = ({ material, onPreview }: CardProps) => {
  const { icon: Icon, tag, title, description, cta, href, filename, trackId } = material;
  return (
  <motion.div
    initial={{ opacity: 0, y: 24 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-80px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
    className="group relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-b from-white/[0.04] to-white/[0.01] p-5 backdrop-blur-xl transition-all hover:border-gold/40 hover:shadow-[0_20px_60px_-20px_rgba(201,168,76,0.35)] sm:p-7"
  >
    <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-gold/10 blur-3xl opacity-50 transition-opacity group-hover:opacity-100" />
    <div className="relative flex flex-col gap-5">
      {/* Thumbnail preview */}
      <button
        type="button"
        onClick={onPreview}
        aria-label={`Vista previa de ${title}`}
        className="group/thumb relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-white/[0.04] to-black/40"
      >
        <div className="flex h-full items-center justify-center text-gold/60">
          <Icon size={56} strokeWidth={1.1} />
        </div>
        <div className="absolute inset-0 flex items-end justify-between bg-gradient-to-t from-black/85 via-black/30 to-transparent p-4 opacity-90 transition-opacity group-hover/thumb:opacity-100">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-background/60 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-white/80 backdrop-blur">
            <Eye size={11} /> Vista previa
          </span>
          <span className="text-[10px] uppercase tracking-[0.22em] text-white/50">PDF</span>
        </div>
      </button>

      <div>
        <div className="mb-4 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
            <Icon size={20} />
          </div>
          <span className="text-[10px] uppercase tracking-[0.28em] text-gold/80">{tag}</span>
        </div>
        <h3 className="font-display text-2xl leading-tight text-white sm:text-3xl">{title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-white/65 sm:text-base">{description}</p>

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center">
          <a
            href={href}
            download={filename}
            onClick={() => {
              trackCTAClick(trackId, "bonus_ceti");
              trackDownload(filename, "bonus_ceti", "download");
            }}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-[12px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.55)]"
          >
            <Download size={14} /> {cta}
          </a>
          <button
            type="button"
            onClick={onPreview}
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/15 px-5 py-3 text-[12px] uppercase tracking-[0.22em] text-white/80 transition-colors hover:border-gold/40 hover:text-gold"
          >
            <Eye size={13} /> Previsualizar
          </button>
        </div>
      </div>
    </div>
  </motion.div>
  );
};

const ConferenceVideoBlock = () => {
  const video = useConferenceVideo();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const milestonesSent = useRef<Set<number>>(new Set());

  if (!video.url) {
    return (
      <div className="relative overflow-hidden rounded-3xl border border-dashed border-white/15 bg-white/[0.02] p-8 text-center sm:p-14">
        <PlayCircle size={48} className="mx-auto text-gold/70" strokeWidth={1.2} />
        <h3 className="mt-5 font-display text-2xl text-white sm:text-3xl">
          Video de la conferencia · próximamente
        </h3>
        <p className="mx-auto mt-3 max-w-xl text-sm text-white/60 sm:text-base">
          Estamos editando la grabación completa de “95 Rechazos” en CETI.
          Aquí podrás revivirla en cuanto esté lista.
        </p>
      </div>
    );
  }
  const { url, provider, title, poster } = video;

  const handleTimeUpdate = () => {
    const el = videoRef.current;
    if (!el || !el.duration) return;
    const pct = Math.floor((el.currentTime / el.duration) * 100);
    [25, 50, 75, 90].forEach((m) => {
      if (pct >= m && !milestonesSent.current.has(m)) {
        milestonesSent.current.add(m);
        trackVideo("progress", title, "bonus_ceti", { percent: m });
      }
    });
  };

  return (
    <div className="overflow-hidden rounded-3xl border border-white/10 bg-black">
      <div className="aspect-video w-full">
        {provider === "file" ? (
          <video
            ref={videoRef}
            controls
            preload="metadata"
            className="h-full w-full"
            poster={poster}
            onPlay={() => trackVideo("play", title, "bonus_ceti")}
            onPause={() => trackVideo("pause", title, "bonus_ceti")}
            onEnded={() => trackVideo("ended", title, "bonus_ceti")}
            onTimeUpdate={handleTimeUpdate}
          >
            <source src={url} />
          </video>
        ) : (
          <iframe
            src={url}
            title={title}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
            loading="lazy"
            className="h-full w-full"
            onLoad={() => trackVideo("play", title, "bonus_ceti", { embed: true })}
          />
        )}
      </div>
    </div>
  );
};

const BonusCeti = () => {
  const materials = useBonusMaterials();
  const [preview, setPreview] = useState<null | {
    src: string;
    filename: string;
    title: string;
    trackId: string;
  }>(null);

  const openPreview = (p: NonNullable<typeof preview>) => {
    trackPreviewOpen(p.filename, "bonus_ceti");
    trackDownload(p.filename, "bonus_ceti", "preview");
    setPreview(p);
  };

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title="Bonus CETI — Gonzalo Acuña Nava"
        description="Regalo exclusivo para estudiantes CETI: guía de inicio (finanzas, IA, mentalidad founder) + slides de la conferencia 95 Rechazos + 1 año GRATIS de Finple Pro."
        path="/bonus-ceti"
      />
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40 sm:pb-24">
        <div className="aurora absolute inset-0 -z-10 opacity-70" />
        <div className="radial-gold absolute inset-0 -z-10" />
        <div className="mx-auto max-w-content px-6 md:px-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="max-w-3xl"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
              <GraduationCap size={12} /> Exclusivo CETI
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] text-white sm:text-6xl md:text-7xl">
              Bonus Exclusivo para <span className="text-gold">Asistentes CETI</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              El mapa de inicio que nadie te enseña en la escuela y que puedes implementar esta semana.
              Un regalo de <span className="text-white">Gonzalo Acuña Nava</span>.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Downloads */}
      <section className="relative pb-20 sm:pb-28">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">Tus descargas</p>
              <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Llévate todo el material</h2>
            </div>
            <Link
              to="/bonus-ceti-descargas"
              onClick={() => trackCTAClick("ver_catalogo_descargas", "bonus_ceti")}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/75 transition-colors hover:border-gold/40 hover:text-gold"
            >
              <Share2 size={13} /> Catálogo compartible
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {materials.map((m) => (
              <DownloadCard
                key={m.id}
                material={m}
                onPreview={() =>
                  openPreview({
                    src: m.href,
                    filename: m.filename,
                    title: m.title,
                    trackId: m.trackId,
                  })
                }
              />
            ))}
          </div>
        </div>
      </section>

      {/* Conference video */}
      <section className="relative pb-20 sm:pb-28">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="mb-8">
            <p className="text-[10px] uppercase tracking-[0.28em] text-white/40">Conferencia completa</p>
            <h2 className="mt-2 font-display text-2xl text-white sm:text-3xl">Revive la charla</h2>
          </div>
          <ConferenceVideoBlock />
        </div>
      </section>

      {/* Finple Pro CTA */}
      <section className="relative pb-24 sm:pb-32">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative overflow-hidden rounded-[2rem] border border-gold/40 bg-gradient-to-br from-gold/20 via-gold/[0.08] to-background p-8 sm:p-14"
          >
            <div className="absolute -right-20 -top-20 h-72 w-72 rounded-full bg-gold/30 blur-3xl" />
            <div className="absolute -left-20 -bottom-20 h-72 w-72 rounded-full bg-gold/20 blur-3xl" />
            <div className="relative flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
              <div className="max-w-2xl">
                <span className="inline-flex items-center gap-2 rounded-full border border-gold/50 bg-background/40 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
                  <Sparkles size={12} /> Tu regalo especial
                </span>
                <h2 className="mt-5 font-display text-3xl leading-tight text-white sm:text-5xl">
                  Acceso a <span className="text-gold">Finple Pro GRATIS</span> por un año
                </h2>
                <p className="mt-4 text-sm text-white/75 sm:text-base">
                  Valor: <span className="text-white">$4,000 MXN</span>. El Duolingo de las inversiones —
                  aprende a invertir jugando, en minutos al día.
                </p>
              </div>
              <a
                href={FINPLE_URL}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackCTAClick("reclamar_finple_pro", "bonus_ceti")}
                className="inline-flex items-center gap-3 rounded-full bg-gold px-8 py-4 text-[12px] uppercase tracking-[0.24em] text-background transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.6)]"
              >
                Reclamar Finple Pro <ArrowRight size={16} />
              </a>
            </div>
          </motion.div>

          <p className="mt-10 text-center text-xs text-white/40">
            ¿Dudas? Escríbeme y te respondo personalmente.{" "}
            <Link to="/booking" className="text-gold hover:underline">Agenda una keynote</Link>.
          </p>
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
        location="bonus_ceti"
      />
    </main>
  );
};

export default BonusCeti;