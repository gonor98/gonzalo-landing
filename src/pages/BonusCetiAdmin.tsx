import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import {
  Save, RotateCcw, ExternalLink, Share2, ArrowLeft, Download as DownloadIcon,
  Upload, Eye, History, Check, AlertTriangle,
} from "lucide-react";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { OGPreviewCard } from "@/components/OGPreviewCard";
import {
  BONUS_MATERIALS,
  CONFERENCE_VIDEO,
  HERO_LOOP_VIDEO,
  DESCARGAS_SEO,
  readMaterialsOverrides,
  readVideoOverride,
  readHeroOverride,
  readSeoOverride,
  resetOverrides,
  writeMaterialsOverrides,
  writeVideoOverride,
  writeHeroOverride,
  writeSeoOverride,
  exportOverrides,
  importOverrides,
  type BonusOverridesBundle,
} from "@/lib/bonusMaterials";
import { trackVideo } from "@/lib/track";
import { BenefitsAdminSection } from "@/components/BenefitsAdminSection";

const SITE = "https://gonzaloacuna.com";

type Draft = Record<string, {
  tag: string; title: string; description: string;
  cta: string; href: string; filename: string;
}>;

const buildDraft = (): Draft => {
  const overrides = readMaterialsOverrides();
  return Object.fromEntries(
    BONUS_MATERIALS.map((m) => {
      const o = overrides[m.id] ?? {};
      return [m.id, {
        tag: o.tag ?? m.tag, title: o.title ?? m.title,
        description: o.description ?? m.description, cta: o.cta ?? m.cta,
        href: o.href ?? m.href, filename: o.filename ?? m.filename,
      }];
    }),
  ) as Draft;
};

const buildVideoDraft = () => {
  const o = readVideoOverride();
  return {
    url: o.url ?? CONFERENCE_VIDEO.url ?? "",
    provider: (o.provider ?? CONFERENCE_VIDEO.provider ?? "youtube") as "youtube" | "vimeo" | "file",
    title: o.title ?? CONFERENCE_VIDEO.title,
    poster: o.poster ?? CONFERENCE_VIDEO.poster ?? "",
  };
};

const buildHeroDraft = () => {
  const o = readHeroOverride();
  return {
    provider: (o.provider ?? HERO_LOOP_VIDEO.provider) as "youtube" | "vimeo" | "file",
    source: o.source ?? HERO_LOOP_VIDEO.source,
    title: o.title ?? HERO_LOOP_VIDEO.title,
  };
};

/** Parse a YouTube/Vimeo URL OR id and return { provider, source } or null. */
const parseEmbedUrl = (raw: string): { provider: "youtube" | "vimeo"; source: string } | null => {
  const v = raw.trim();
  if (!v) return null;
  // Bare YouTube id (11 chars, allowed alphabet)
  if (/^[a-zA-Z0-9_-]{11}$/.test(v)) return { provider: "youtube", source: v };
  // Bare Vimeo numeric id
  if (/^\d{6,}$/.test(v)) return { provider: "vimeo", source: v };
  try {
    const u = new URL(v);
    if (/youtu\.be$/.test(u.hostname)) return { provider: "youtube", source: u.pathname.slice(1) };
    if (/youtube(-nocookie)?\.com$/.test(u.hostname)) {
      const id = u.searchParams.get("v");
      if (id) return { provider: "youtube", source: id };
      const m = u.pathname.match(/\/(embed|shorts)\/([\w-]{11})/);
      if (m) return { provider: "youtube", source: m[2] };
    }
    if (/vimeo\.com$/.test(u.hostname)) {
      const m = u.pathname.match(/\/(\d{6,})/);
      if (m) return { provider: "vimeo", source: m[1] };
    }
  } catch { /* not a URL */ }
  return null;
};

const SNAPSHOTS_KEY = "bonus_admin_snapshots_v1";
type Snapshot = { id: string; ts: string; bundle: BonusOverridesBundle };
const readSnapshots = (): Snapshot[] => {
  try { return JSON.parse(localStorage.getItem(SNAPSHOTS_KEY) || "[]"); } catch { return []; }
};
const writeSnapshots = (s: Snapshot[]) => localStorage.setItem(SNAPSHOTS_KEY, JSON.stringify(s.slice(0, 20)));

const buildSeoDraft = () => {
  const o = readSeoOverride();
  return {
    title: o.title ?? DESCARGAS_SEO.title,
    description: o.description ?? DESCARGAS_SEO.description,
    ogImage: o.ogImage ?? DESCARGAS_SEO.ogImage,
  };
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/45">{label}</span>
    {children}
  </label>
);

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none";

const AdminInner = () => {
  const [draft, setDraft] = useState<Draft>(buildDraft);
  const [video, setVideo] = useState(buildVideoDraft);
  const [hero, setHero] = useState(buildHeroDraft);
  const [seo, setSeo] = useState(buildSeoDraft);
  const [saved, setSaved] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const [heroUrl, setHeroUrl] = useState("");
  const [heroValidation, setHeroValidation] = useState<null | { ok: boolean; msg: string }>(null);
  const [snapshots, setSnapshots] = useState<Snapshot[]>(readSnapshots);

  useEffect(() => { if (saved) { const t = setTimeout(() => setSaved(false), 1600); return () => clearTimeout(t); } }, [saved]);

  const generatedRoutes = useMemo(
    () => Object.entries(draft).map(([id, m]) => ({ id, ...m, share: `${SITE}${m.href}` })),
    [draft],
  );

  const update = (id: string, field: keyof Draft[string], value: string) =>
    setDraft((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));

  const save = () => {
    const overrides: Record<string, Partial<Draft[string]>> = {};
    BONUS_MATERIALS.forEach((m) => {
      const d = draft[m.id]; const diff: Partial<Draft[string]> = {};
      (["tag","title","description","cta","href","filename"] as const).forEach((k) => {
        if (d[k] !== (m as Record<string, unknown>)[k]) diff[k] = d[k];
      });
      if (Object.keys(diff).length) overrides[m.id] = diff;
    });
    // Snapshot BEFORE writing so we can revert
    const snap: Snapshot = { id: crypto.randomUUID(), ts: new Date().toISOString(), bundle: exportOverrides() };
    const next = [snap, ...snapshots].slice(0, 20);
    setSnapshots(next); writeSnapshots(next);

    writeMaterialsOverrides(overrides);
    writeVideoOverride({
      url: video.url || null,
      provider: video.url ? video.provider : null,
      title: video.title,
      poster: video.poster || undefined,
    });
    writeHeroOverride({ provider: hero.provider, source: hero.source, title: hero.title });
    writeSeoOverride({ title: seo.title, description: seo.description, ogImage: seo.ogImage });
    setSaved(true);
  };

  const restoreSnapshot = (s: Snapshot) => {
    if (!confirm(`Restaurar la versión del ${new Date(s.ts).toLocaleString()}?`)) return;
    importOverrides(s.bundle);
    setDraft(buildDraft()); setVideo(buildVideoDraft());
    setHero(buildHeroDraft()); setSeo(buildSeoDraft());
  };

  const validateHeroUrl = () => {
    const parsed = parseEmbedUrl(heroUrl);
    if (!parsed) {
      setHeroValidation({ ok: false, msg: "URL no reconocida. Pega un link de YouTube/Vimeo o un ID." });
      return;
    }
    setHero((v) => ({ ...v, provider: parsed.provider, source: parsed.source }));
    setHeroValidation({ ok: true, msg: `OK · ${parsed.provider} → ${parsed.source}. Recuerda Guardar.` });
  };

  const reset = () => {
    if (!confirm("¿Restablecer TODAS las ediciones a los valores por defecto?")) return;
    resetOverrides();
    setDraft(buildDraft()); setVideo(buildVideoDraft());
    setHero(buildHeroDraft()); setSeo(buildSeoDraft());
  };

  const copy = (text: string) => navigator.clipboard?.writeText(text);

  const onExport = () => {
    const data = exportOverrides();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `bonus-ceti-overrides-${new Date().toISOString().slice(0, 10)}.json`;
    a.click(); URL.revokeObjectURL(url);
  };

  const onImport = async (file: File) => {
    try {
      const text = await file.text();
      const parsed = JSON.parse(text) as BonusOverridesBundle;
      importOverrides(parsed);
      setDraft(buildDraft()); setVideo(buildVideoDraft());
      setHero(buildHeroDraft()); setSeo(buildSeoDraft());
      setImportMsg(`Importado ✓ (${file.name})`);
    } catch (e) {
      setImportMsg(e instanceof Error ? `Error: ${e.message}` : "Error al importar JSON");
    }
  };

  // --- Conference video preview (in-admin) ---
  const previewVideoRef = useRef<HTMLVideoElement | null>(null);
  const ytPreviewSrc = useMemo(() => {
    if (!video.url) return null;
    if (video.provider === "youtube") return video.url.includes("/embed/") ? video.url : video.url;
    if (video.provider === "vimeo") return video.url;
    return null;
  }, [video.url, video.provider]);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title="Admin · Bonus CETI — Gonzalo Acuña Nava"
        description="Panel interno para editar el catálogo de PDFs y el video de la conferencia."
        path="/bonus-ceti-admin"
      />
      <Nav />

      <section className="pt-32 pb-10 sm:pt-40">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">Panel interno · Solo admins</p>
              <h1 className="mt-2 font-display text-3xl text-white sm:text-5xl">
                Administrar Bonus <span className="text-gold">CETI</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/60">
                Edita PDFs, video de conferencia, video del hero y SEO. Cambios en localStorage de este navegador
                — usa Exportar/Importar para moverlos entre dispositivos.
              </p>
            </div>
            <Link
              to="/bonus-ceti"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold"
            >
              <ArrowLeft size={13} /> Ver landing
            </Link>
          </div>
        </div>
      </section>

      {/* Export/Import */}
      <section className="pb-10">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <button onClick={onExport} className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold hover:bg-gold/10">
              <DownloadIcon size={13} /> Exportar JSON
            </button>
            <button onClick={() => fileRef.current?.click()} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-white/80 hover:border-gold/40 hover:text-gold">
              <Upload size={13} /> Importar JSON
            </button>
            <input
              ref={fileRef} type="file" accept="application/json" hidden
              onChange={(e) => { const f = e.target.files?.[0]; if (f) onImport(f); e.target.value = ""; }}
            />
            {importMsg && <span className="text-xs text-white/55">{importMsg}</span>}
            <span className="ml-auto text-[10px] uppercase tracking-[0.22em] text-white/35">
              Útil para mover ediciones entre navegadores/ambientes
            </span>
          </div>
        </div>
      </section>

      {/* Materials */}
      <section className="pb-12">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <h2 className="mb-4 font-display text-xl text-white">Materiales descargables</h2>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {BONUS_MATERIALS.map((m) => {
              const d = draft[m.id];
              return (
                <div key={m.id} className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
                  <p className="text-[10px] uppercase tracking-[0.28em] text-gold/70">ID: {m.id}</p>
                  <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <Field label="Tag"><input className={inputCls} value={d.tag} onChange={(e) => update(m.id, "tag", e.target.value)} /></Field>
                    <Field label="CTA"><input className={inputCls} value={d.cta} onChange={(e) => update(m.id, "cta", e.target.value)} /></Field>
                    <Field label="Título"><input className={inputCls} value={d.title} onChange={(e) => update(m.id, "title", e.target.value)} /></Field>
                    <Field label="Filename (download)"><input className={inputCls} value={d.filename} onChange={(e) => update(m.id, "filename", e.target.value)} /></Field>
                    <div className="sm:col-span-2">
                      <Field label="Descripción">
                        <textarea className={`${inputCls} min-h-[88px]`} value={d.description} onChange={(e) => update(m.id, "description", e.target.value)} />
                      </Field>
                    </div>
                    <div className="sm:col-span-2">
                      <Field label="Ruta del archivo (debe existir en /public)">
                        <input className={inputCls} value={d.href} onChange={(e) => update(m.id, "href", e.target.value)} placeholder="/mi-archivo.pdf" />
                      </Field>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Benefits catalog CRUD */}
      <BenefitsAdminSection />

      {/* Hero loop video */}
      <section className="pb-12">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <h2 className="mb-4 font-display text-xl text-white">Video del hero (loop, mute)</h2>
          <div className="mb-4 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/45">Pegar y validar URL (YouTube/Vimeo)</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <input
                className={`${inputCls} flex-1 min-w-[260px]`}
                value={heroUrl}
                onChange={(e) => setHeroUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
              />
              <button
                onClick={validateHeroUrl}
                className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold hover:bg-gold/10"
              >
                Validar y aplicar
              </button>
            </div>
            {heroValidation && (
              <p className={`mt-2 inline-flex items-center gap-2 text-xs ${heroValidation.ok ? "text-emerald-400" : "text-amber-400"}`}>
                {heroValidation.ok ? <Check size={12} /> : <AlertTriangle size={12} />} {heroValidation.msg}
              </p>
            )}
          </div>
          <div className="grid grid-cols-1 gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:grid-cols-[1fr_280px]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Proveedor">
                <select className={inputCls} value={hero.provider} onChange={(e) => setHero((v) => ({ ...v, provider: e.target.value as typeof v.provider }))}>
                  <option value="youtube">YouTube</option>
                  <option value="vimeo">Vimeo</option>
                  <option value="file">Archivo MP4</option>
                </select>
              </Field>
              <Field label="Título (alt)">
                <input className={inputCls} value={hero.title} onChange={(e) => setHero((v) => ({ ...v, title: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label={
                  hero.provider === "youtube" ? "YouTube videoId (ej: cmGTwjjw-kw)"
                  : hero.provider === "vimeo" ? "Vimeo videoId numérico" : "URL del archivo .mp4"
                }>
                  <input className={inputCls} value={hero.source} onChange={(e) => setHero((v) => ({ ...v, source: e.target.value }))} />
                </Field>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45">Vista previa</p>
              <div className="aspect-[9/16] w-full overflow-hidden rounded-xl border border-gold/20 bg-black">
                {hero.provider === "youtube" && hero.source ? (
                  <iframe className="h-full w-full border-0" src={`https://www.youtube-nocookie.com/embed/${hero.source}?autoplay=1&mute=1&loop=1&playlist=${hero.source}&controls=0&modestbranding=1&playsinline=1`} title={hero.title} allow="autoplay; encrypted-media" />
                ) : hero.provider === "vimeo" && hero.source ? (
                  <iframe className="h-full w-full border-0" src={`https://player.vimeo.com/video/${hero.source}?autoplay=1&loop=1&muted=1&background=1`} title={hero.title} allow="autoplay" />
                ) : hero.provider === "file" && hero.source ? (
                  <video src={hero.source} autoPlay loop muted playsInline className="h-full w-full object-cover" />
                ) : <div className="flex h-full items-center justify-center text-xs text-white/40">Sin video</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Conference video editor + preview */}
      <section className="pb-12">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <h2 className="mb-4 font-display text-xl text-white">Video de la conferencia</h2>
          <div className="grid grid-cols-1 gap-5 rounded-2xl border border-white/10 bg-white/[0.02] p-5 lg:grid-cols-[1fr_360px]">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Proveedor">
                <select className={inputCls} value={video.provider} onChange={(e) => setVideo((v) => ({ ...v, provider: e.target.value as typeof v.provider }))}>
                  <option value="youtube">YouTube (embed)</option>
                  <option value="vimeo">Vimeo (embed)</option>
                  <option value="file">Archivo MP4 propio</option>
                </select>
              </Field>
              <Field label="Título">
                <input className={inputCls} value={video.title} onChange={(e) => setVideo((v) => ({ ...v, title: e.target.value }))} />
              </Field>
              <div className="sm:col-span-2">
                <Field label="URL (embed YouTube/Vimeo o archivo .mp4)">
                  <input className={inputCls} value={video.url} onChange={(e) => setVideo((v) => ({ ...v, url: e.target.value }))} placeholder="https://www.youtube.com/embed/VIDEO_ID" />
                </Field>
              </div>
              <div className="sm:col-span-2">
                <Field label="Poster (opcional, solo para archivo .mp4)">
                  <input className={inputCls} value={video.poster} onChange={(e) => setVideo((v) => ({ ...v, poster: e.target.value }))} />
                </Field>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45">Vista previa (con tracking)</p>
              <div className="aspect-video w-full overflow-hidden rounded-xl border border-gold/20 bg-black">
                {video.provider === "file" && video.url ? (
                  <video
                    ref={previewVideoRef}
                    src={video.url}
                    poster={video.poster || undefined}
                    controls preload="metadata"
                    className="h-full w-full"
                    onPlay={() => trackVideo("play", video.title, "admin_preview")}
                    onPause={() => trackVideo("pause", video.title, "admin_preview")}
                    onEnded={() => trackVideo("ended", video.title, "admin_preview")}
                  />
                ) : ytPreviewSrc ? (
                  <iframe
                    className="h-full w-full border-0"
                    src={ytPreviewSrc}
                    title={video.title}
                    allow="autoplay; encrypted-media; picture-in-picture"
                    onLoad={() => trackVideo("play", video.title, "admin_preview", { embed: true })}
                  />
                ) : <div className="flex h-full items-center justify-center text-xs text-white/40">Sin URL configurada</div>}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO + OG preview */}
      <section className="pb-12">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <div className="mb-4 flex items-end justify-between">
            <h2 className="font-display text-xl text-white">SEO · /bonus-ceti-descargas</h2>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { save(); window.open("/bonus-ceti-descargas/preview", "_blank"); }}
                className="inline-flex items-center gap-2 rounded-full bg-gold/90 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-background hover:bg-gold"
              >
                <Eye size={12} /> Guardar y abrir OG/Twitter preview
              </button>
              <Link
                to="/bonus-ceti-descargas/preview"
                target="_blank"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold"
              >
                Vista pública
              </Link>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-[1fr_360px]">
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
              <div className="grid grid-cols-1 gap-3">
                <Field label={`Título (${seo.title.length} chars · ideal <60)`}>
                  <input className={inputCls} value={seo.title} onChange={(e) => setSeo((s) => ({ ...s, title: e.target.value }))} />
                </Field>
                <Field label={`Descripción (${seo.description.length} chars · ideal <160)`}>
                  <textarea className={`${inputCls} min-h-[88px]`} value={seo.description} onChange={(e) => setSeo((s) => ({ ...s, description: e.target.value }))} />
                </Field>
                <Field label="Imagen OG (URL pública 1200x630 ideal)">
                  <input className={inputCls} value={seo.ogImage} onChange={(e) => setSeo((s) => ({ ...s, ogImage: e.target.value }))} />
                </Field>
              </div>
            </div>
            <div>
              <p className="mb-2 text-[10px] uppercase tracking-[0.22em] text-white/45">Vista previa al compartir</p>
              <OGPreviewCard title={seo.title} description={seo.description} image={seo.ogImage} url={`${SITE}/bonus-ceti-descargas`} />
            </div>
          </div>
        </div>
      </section>

      <section className="pb-12">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <h2 className="mb-4 font-display text-xl text-white">Enlaces generados</h2>
          <ul className="flex flex-col gap-2">
            {generatedRoutes.map((r) => (
              <li key={r.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-white/[0.02] px-4 py-3 text-sm">
                <span className="truncate font-mono text-white/75">{r.share}</span>
                <div className="flex items-center gap-2">
                  <button onClick={() => copy(r.share)} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold">
                    <Share2 size={12} /> Copiar
                  </button>
                  <a href={r.href} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold">
                    <ExternalLink size={12} /> Abrir
                  </a>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="pb-24">
        <div className="mx-auto flex max-w-content flex-wrap items-center justify-end gap-3 px-6 md:px-20">
          {snapshots.length > 0 && (
            <details className="mr-auto w-full max-w-2xl rounded-2xl border border-white/10 bg-white/[0.02] p-4">
              <summary className="flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/75">
                <History size={13} /> Historial de versiones ({snapshots.length})
              </summary>
              <ul className="mt-3 max-h-64 space-y-2 overflow-auto">
                {snapshots.map((s) => (
                  <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs">
                    <span className="text-white/70">{new Date(s.ts).toLocaleString()}</span>
                    <button
                      onClick={() => restoreSnapshot(s)}
                      className="inline-flex items-center gap-1 rounded-full border border-gold/40 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-gold hover:bg-gold/10"
                    >
                      <RotateCcw size={11} /> Restaurar
                    </button>
                  </li>
                ))}
              </ul>
              <p className="mt-2 text-[10px] text-white/40">Se crea un snapshot automático cada vez que guardas.</p>
            </details>
          )}
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold">
            <RotateCcw size={13} /> Restablecer
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-[11px] uppercase tracking-[0.24em] text-background transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]">
            <Save size={13} /> {saved ? "Guardado ✓" : "Guardar cambios"}
          </button>
        </div>
        <p className="mx-auto mt-4 max-w-content px-6 text-right text-[11px] text-white/40 md:px-20">
          Cambios en localStorage de este navegador. Para producción, edita
          <code className="mx-1">src/lib/bonusMaterials.ts</code> o usa Exportar/Importar entre ambientes.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
};

const BonusCetiAdmin = () => (
  <AdminAuthGate>
    <AdminInner />
  </AdminAuthGate>
);

export default BonusCetiAdmin;