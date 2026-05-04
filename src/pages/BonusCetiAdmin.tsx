import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Save, RotateCcw, ExternalLink, Share2, ArrowLeft } from "lucide-react";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import {
  BONUS_MATERIALS,
  CONFERENCE_VIDEO,
  readMaterialsOverrides,
  readVideoOverride,
  resetOverrides,
  writeMaterialsOverrides,
  writeVideoOverride,
} from "@/lib/bonusMaterials";

const SITE = "https://gonzaloacuna.com";

type Draft = Record<string, {
  tag: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  filename: string;
}>;

const buildDraft = (): Draft => {
  const overrides = readMaterialsOverrides();
  return Object.fromEntries(
    BONUS_MATERIALS.map((m) => {
      const o = overrides[m.id] ?? {};
      return [m.id, {
        tag: o.tag ?? m.tag,
        title: o.title ?? m.title,
        description: o.description ?? m.description,
        cta: o.cta ?? m.cta,
        href: o.href ?? m.href,
        filename: o.filename ?? m.filename,
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

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/45">{label}</span>
    {children}
  </label>
);

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none";

const BonusCetiAdmin = () => {
  const [draft, setDraft] = useState<Draft>(buildDraft);
  const [video, setVideo] = useState(buildVideoDraft);
  const [saved, setSaved] = useState(false);

  useEffect(() => { if (saved) { const t = setTimeout(() => setSaved(false), 1600); return () => clearTimeout(t); } }, [saved]);

  const generatedRoutes = useMemo(
    () => Object.entries(draft).map(([id, m]) => ({ id, ...m, share: `${SITE}${m.href}` })),
    [draft],
  );

  const update = (id: string, field: keyof Draft[string], value: string) =>
    setDraft((d) => ({ ...d, [id]: { ...d[id], [field]: value } }));

  const save = () => {
    // Materials: store only diffs vs canonical defaults
    const overrides: Record<string, Partial<Draft[string]>> = {};
    BONUS_MATERIALS.forEach((m) => {
      const d = draft[m.id];
      const diff: Partial<Draft[string]> = {};
      (["tag","title","description","cta","href","filename"] as const).forEach((k) => {
        if (d[k] !== (m as any)[k]) diff[k] = d[k];
      });
      if (Object.keys(diff).length) overrides[m.id] = diff;
    });
    writeMaterialsOverrides(overrides);

    writeVideoOverride({
      url: video.url || null,
      provider: video.url ? video.provider : null,
      title: video.title,
      poster: video.poster || undefined,
    });
    setSaved(true);
  };

  const reset = () => {
    resetOverrides();
    setDraft(buildDraft());
    setVideo(buildVideoDraft());
  };

  const copy = (text: string) => navigator.clipboard?.writeText(text);

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
              <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">Panel interno</p>
              <h1 className="mt-2 font-display text-3xl text-white sm:text-5xl">
                Administrar Bonus <span className="text-gold">CETI</span>
              </h1>
              <p className="mt-3 max-w-2xl text-sm text-white/60">
                Edita los PDFs, sus enlaces de descarga y el video de la conferencia. Los cambios se
                guardan localmente en este navegador y se aplican al instante en{" "}
                <Link to="/bonus-ceti" className="text-gold hover:underline">/bonus-ceti</Link> y{" "}
                <Link to="/bonus-ceti-descargas" className="text-gold hover:underline">/bonus-ceti-descargas</Link>.
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

      <section className="pb-12">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <h2 className="mb-4 font-display text-xl text-white">Video de la conferencia</h2>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Field label="Proveedor">
                <select
                  className={inputCls}
                  value={video.provider}
                  onChange={(e) => setVideo((v) => ({ ...v, provider: e.target.value as typeof v.provider }))}
                >
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
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold">
            <RotateCcw size={13} /> Restablecer
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-[11px] uppercase tracking-[0.24em] text-background transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]">
            <Save size={13} /> {saved ? "Guardado ✓" : "Guardar cambios"}
          </button>
        </div>
        <p className="mx-auto mt-4 max-w-content px-6 text-right text-[11px] text-white/40 md:px-20">
          Los cambios se almacenan en este navegador (localStorage). Para cambios permanentes en
          producción, edita <code>src/lib/bonusMaterials.ts</code>.
        </p>
      </section>

      <SiteFooter />
    </main>
  );
};

export default BonusCetiAdmin;