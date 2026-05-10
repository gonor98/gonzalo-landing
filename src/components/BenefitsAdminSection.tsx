import { useState } from "react";
import { Plus, Trash2, Save, RotateCcw, Eye, History, Check, AlertTriangle, PlayCircle, ShieldCheck, RefreshCw, X } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BENEFITS,
  ICONS,
  readBenefitsBundle,
  writeBenefitsBundle,
  resetBenefits,
  exportBenefits,
  importBenefits,
  type BenefitOverride,
  type BenefitsBundle,
  type BenefitStatus,
} from "@/lib/benefits";
import { AssetUploader } from "@/components/AssetUploader";
import { OGPreviewCard } from "@/components/OGPreviewCard";
import { DESCARGAS_SEO } from "@/lib/bonusMaterials";

const SITE = "https://gonzaloacuna.com";
const SNAP_KEY = "benefits_admin_snapshots_v1";
type Snapshot = { id: string; ts: string; bundle: BenefitsBundle; author?: string; summary?: string };
const readSnaps = (): Snapshot[] => {
  try { return JSON.parse(localStorage.getItem(SNAP_KEY) || "[]"); } catch { return []; }
};
const writeSnaps = (s: Snapshot[]) => localStorage.setItem(SNAP_KEY, JSON.stringify(s.slice(0, 20)));

const KNOWN_ROUTES = new Set([
  "/", "/speaking", "/audit-os", "/investors", "/booking", "/agenda",
  "/benefits", "/blog",
  "/bonus-ceti", "/bonus-ceti-descargas",
]);

type Finding = { rowId: string; rowTitle: string; severity: "error" | "warning"; message: string };

const validateRows = async (rows: Row[]): Promise<Finding[]> => {
  const out: Finding[] = [];
  const live = rows.filter(r => !r._removed);
  for (const r of live) {
    const push = (sev: Finding["severity"], message: string) =>
      out.push({ rowId: r.id, rowTitle: r.title || r.id, severity: sev, message });
    if (!r.title?.trim()) push("error", "Título vacío");
    if (!r.description?.trim()) push("error", "Descripción vacía");
    if (!r.badge?.trim()) push("warning", "Badge vacío");
    if (r.landingPath && !r.landingPath.startsWith("/")) push("error", `landingPath inválido: ${r.landingPath}`);
    if (r.downloadsPath && !r.downloadsPath.startsWith("/")) push("error", `downloadsPath inválido: ${r.downloadsPath}`);
    if (r.landingPath && !KNOWN_ROUTES.has(r.landingPath)) push("warning", `landingPath ${r.landingPath} no está registrado en el router`);
    if (r.downloadsPath && !KNOWN_ROUTES.has(r.downloadsPath)) push("warning", `downloadsPath ${r.downloadsPath} no está registrado en el router`);
    if (r.externalUrl) {
      try { new URL(r.externalUrl); } catch { push("error", `externalUrl inválida: ${r.externalUrl}`); }
    }
    for (const [field, url] of [["pdfUrl", r.pdfUrl], ["videoUrl", r.videoUrl], ["thumbnailUrl", r.thumbnailUrl]] as const) {
      if (!url) continue;
      try {
        const ctrl = new AbortController();
        const t = setTimeout(() => ctrl.abort(), 5000);
        const res = await fetch(url, { method: "HEAD", signal: ctrl.signal });
        clearTimeout(t);
        if (!res.ok) push("error", `${field} no accesible (${res.status})`);
      } catch {
        push("warning", `${field} no se pudo verificar (timeout/CORS)`);
      }
    }
    if (!r.thumbnailUrl) push("warning", "Sin thumbnail/OG image");
  }
  return out;
};

// OG batch run history
const OG_KEY = "og_batch_runs_v1";
type OgRun = { id: string; startedAt: string; finishedAt?: string; items: OgCheck[] };
const readRuns = (): OgRun[] => { try { return JSON.parse(localStorage.getItem(OG_KEY) || "[]"); } catch { return []; } };
const writeRuns = (r: OgRun[]) => localStorage.setItem(OG_KEY, JSON.stringify(r.slice(0, 20)));

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none";

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <label className="block">
    <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/45">{label}</span>
    {children}
  </label>
);

const blank = (): BenefitOverride => ({
  id: `event-${Date.now().toString(36)}`,
  kind: "event",
  status: "active",
  badge: "Nuevo evento",
  title: "Título del evento",
  description: "Descripción breve del beneficio o evento.",
  date: "",
  location: "",
  landingPath: "",
  downloadsPath: "",
  externalUrl: "",
  iconKey: "GraduationCap",
  highlights: [],
  pdfUrl: "",
  videoUrl: "",
  thumbnailUrl: "",
});

type Row = BenefitOverride & { _origin: "base" | "added"; _removed?: boolean };

const buildRows = (b: BenefitsBundle): Row[] => {
  const removed = new Set(b.removed ?? []);
  const edits = b.edits ?? {};
  const base: Row[] = BENEFITS.map((it) => {
    const e = edits[it.id] ?? {};
    return {
      id: it.id, kind: it.kind, status: it.status,
      badge: e.badge ?? it.badge, title: e.title ?? it.title,
      description: e.description ?? it.description,
      date: e.date ?? it.date ?? "", location: e.location ?? it.location ?? "",
      landingPath: e.landingPath ?? it.landingPath ?? "",
      downloadsPath: e.downloadsPath ?? it.downloadsPath ?? "",
      externalUrl: e.externalUrl ?? it.externalUrl ?? "",
      iconKey: e.iconKey ?? "GraduationCap",
      highlights: e.highlights ?? it.highlights ?? [],
      pdfUrl: e.pdfUrl ?? it.pdfUrl ?? "",
      videoUrl: e.videoUrl ?? it.videoUrl ?? "",
      thumbnailUrl: e.thumbnailUrl ?? it.thumbnailUrl ?? "",
      _origin: "base", _removed: removed.has(it.id),
    };
  });
  const added: Row[] = (b.added ?? []).map((a) => ({ ...a, _origin: "added" }));
  return [...base, ...added];
};

export const BenefitsAdminSection = () => {
  const [rows, setRows] = useState<Row[]>(() => buildRows(readBenefitsBundle()));
  const [saved, setSaved] = useState(false);
  const [snaps, setSnaps] = useState<Snapshot[]>(readSnaps);
  const [ogResults, setOgResults] = useState<null | OgCheck[]>(null);
  const [ogRunning, setOgRunning] = useState(false);
  const [ogRuns, setOgRuns] = useState<OgRun[]>(readRuns);
  const [findings, setFindings] = useState<Finding[] | null>(null);
  const [validating, setValidating] = useState(false);
  const [pendingPublish, setPendingPublish] = useState(false);

  const update = (idx: number, patch: Partial<Row>) =>
    setRows((r) => r.map((row, i) => (i === idx ? { ...row, ...patch } : row)));

  const add = () => setRows((r) => [...r, { ...blank(), _origin: "added" }]);

  const remove = (idx: number) =>
    setRows((r) => r.flatMap((row, i) => {
      if (i !== idx) return [row];
      if (row._origin === "added") return [];
      return [{ ...row, _removed: true }];
    }));

  const restore = (idx: number) => update(idx, { _removed: false });

  const persist = () => {
    const bundle: BenefitsBundle = { edits: {}, added: [], removed: [] };
    const changedTitles: string[] = [];
    rows.forEach((r) => {
      const { _origin, _removed, ...clean } = r;
      if (_origin === "base") {
        if (_removed) { bundle.removed!.push(r.id); changedTitles.push(`− ${r.title}`); return; }
        const baseEntry = BENEFITS.find((b) => b.id === r.id)!;
        const diff: Partial<BenefitOverride> = {};
        (Object.keys(clean) as (keyof BenefitOverride)[]).forEach((k) => {
          const cv = clean[k]; const bv = (baseEntry as Record<string, unknown>)[k];
          if (k === "iconKey") { if (cv && cv !== "GraduationCap") (diff as Record<string, unknown>)[k] = cv; return; }
          if (JSON.stringify(cv) !== JSON.stringify(bv)) (diff as Record<string, unknown>)[k] = cv;
        });
        if (Object.keys(diff).length) {
          bundle.edits![r.id] = diff;
          changedTitles.push(`✎ ${r.title} (${Object.keys(diff).join(", ")})`);
        }
      } else {
        bundle.added!.push(clean);
        changedTitles.push(`+ ${r.title}`);
      }
    });
    // Snapshot BEFORE writing so we can revert; capture author + summary
    const author = (typeof window !== "undefined" && (localStorage.getItem("admin_email") || "admin")) || "admin";
    const summary = changedTitles.slice(0, 6).join(" · ") || "Sin cambios";
    const snap: Snapshot = { id: crypto.randomUUID(), ts: new Date().toISOString(), bundle: exportBenefits(), author, summary };
    const next = [snap, ...snaps].slice(0, 20);
    setSnaps(next); writeSnaps(next);
    writeBenefitsBundle(bundle);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const runValidation = async () => {
    setValidating(true);
    const f = await validateRows(rows);
    setFindings(f);
    setValidating(false);
  };

  const onPublishClick = async () => {
    setPendingPublish(true);
    setValidating(true);
    const f = await validateRows(rows);
    setFindings(f);
    setValidating(false);
    if (!f.some(x => x.severity === "error")) {
      // No blockers — publish straight away
      persist();
      setPendingPublish(false);
    }
  };

  const publishAnyway = () => { persist(); setFindings(null); setPendingPublish(false); };

  const reset = () => {
    if (!confirm("¿Restablecer el catálogo Benefits a los valores por defecto?")) return;
    resetBenefits();
    setRows(buildRows({}));
  };

  const restoreSnap = (s: Snapshot) => {
    if (!confirm(`Restaurar Benefits a la versión del ${new Date(s.ts).toLocaleString()}?`)) return;
    importBenefits(s.bundle);
    setRows(buildRows(s.bundle));
  };

  const runOgTest = async () => {
    setOgRunning(true); setOgResults(null);
    const runId = crypto.randomUUID();
    const targets: OgTarget[] = [];
    rows.filter((r) => !r._removed).forEach((r) => {
      if (r.landingPath) targets.push({ id: r.id, label: r.title, path: r.landingPath, image: r.thumbnailUrl });
      if (r.downloadsPath) targets.push({ id: `${r.id}-dl`, label: `${r.title} · descargas`, path: r.downloadsPath, image: r.thumbnailUrl || DESCARGAS_SEO.ogImage });
    });
    // Always include the descargas preview reference
    targets.push({ id: "descargas-default", label: "CETI · descargas (default)", path: "/bonus-ceti-descargas", image: DESCARGAS_SEO.ogImage });
    const checks: OgCheck[] = await Promise.all(targets.map((t) => runOgCheck(t)));
    setOgResults(checks);
    const run: OgRun = { id: runId, startedAt: new Date().toISOString(), finishedAt: new Date().toISOString(), items: checks };
    const nextRuns = [run, ...ogRuns].slice(0, 20);
    setOgRuns(nextRuns); writeRuns(nextRuns);
    setOgRunning(false);
  };

  const runOgCheck = async (t: OgTarget): Promise<OgCheck> => {
      const url = `${SITE}${t.path}`;
      const issues: string[] = [];
      const titleLen = t.label.length;
      if (titleLen > 60) issues.push(`Título largo (${titleLen}>60)`);
      let imageOk = false;
      if (t.image) {
        try {
          const r = await fetch(t.image, { method: "HEAD" });
          imageOk = r.ok;
          if (!r.ok) issues.push(`Imagen no accesible (${r.status})`);
        } catch { issues.push("Imagen no alcanzable"); }
      } else {
        issues.push("Sin imagen OG asignada");
      }
      return { ...t, url, issues, imageOk, ok: issues.length === 0 };
  };

  const retryOgFailures = async (run: OgRun) => {
    setOgRunning(true);
    const failed = run.items.filter(i => !i.ok);
    const retried = await Promise.all(failed.map(f => runOgCheck(f)));
    const merged = run.items.map(i => retried.find(r => r.id === i.id) ?? i);
    const next = ogRuns.map(r => r.id === run.id ? { ...r, items: merged, finishedAt: new Date().toISOString() } : r);
    setOgRuns(next); writeRuns(next);
    if (ogResults && ogResults === run.items) setOgResults(merged);
    setOgRunning(false);
  };

  return (
    <section className="pb-12">
      <div className="mx-auto max-w-content px-6 md:px-20">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="font-display text-xl text-white">Catálogo Benefits</h2>
            <p className="mt-1 text-xs text-white/55">
              Crea, edita o elimina eventos/materiales del hub <code>/benefits</code>.
              Las páginas <code>/bonus-ceti</code> y <code>/bonus-ceti-descargas</code>
              siguen vivas — aquí solo configuras cómo aparecen en el hub.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Link to="/benefits/preview" target="_blank" className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold">
              <Eye size={12} /> OG previews
            </Link>
            <button onClick={add} className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold hover:bg-gold/10">
              <Plus size={13} /> Nuevo
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {rows.map((r, idx) => (
            <div
              key={`${r.id}-${idx}`}
              className={`rounded-2xl border ${r._removed ? "border-red-500/30 opacity-50" : "border-white/10"} bg-white/[0.02] p-5`}
            >
              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold/70">
                  {r._origin === "base" ? "Base" : "Nuevo"} · ID: {r.id}
                  {r._removed && " · MARCADO PARA ELIMINAR"}
                </p>
                {r._removed ? (
                  <button onClick={() => restore(idx)} className="text-[11px] uppercase tracking-[0.22em] text-gold hover:text-white">Deshacer</button>
                ) : (
                  <button onClick={() => remove(idx)} className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-red-400">
                    <Trash2 size={12} /> Eliminar
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <Field label="ID (slug único)">
                  <input className={inputCls} value={r.id} disabled={r._origin === "base"} onChange={(e) => update(idx, { id: e.target.value })} />
                </Field>
                <Field label="Tipo">
                  <select className={inputCls} value={r.kind} onChange={(e) => update(idx, { kind: e.target.value as Row["kind"] })}>
                    <option value="event">Evento / Conferencia</option>
                    <option value="platform">Plataforma</option>
                    <option value="perk">Perk</option>
                  </select>
                </Field>
                <Field label="Estatus">
                  <select className={inputCls} value={r.status} onChange={(e) => update(idx, { status: e.target.value as BenefitStatus })}>
                    <option value="active">Activo</option>
                    <option value="upcoming">Próximamente</option>
                    <option value="archived">Archivado</option>
                  </select>
                </Field>
                <Field label="Icono">
                  <select className={inputCls} value={r.iconKey ?? "GraduationCap"} onChange={(e) => update(idx, { iconKey: e.target.value })}>
                    {Object.keys(ICONS).map((k) => <option key={k} value={k}>{k}</option>)}
                  </select>
                </Field>
                <Field label="Badge"><input className={inputCls} value={r.badge} onChange={(e) => update(idx, { badge: e.target.value })} /></Field>
                <Field label="Título"><input className={inputCls} value={r.title} onChange={(e) => update(idx, { title: e.target.value })} /></Field>
                <Field label="Fecha"><input className={inputCls} value={r.date ?? ""} onChange={(e) => update(idx, { date: e.target.value })} /></Field>
                <Field label="Ubicación"><input className={inputCls} value={r.location ?? ""} onChange={(e) => update(idx, { location: e.target.value })} /></Field>
                <div className="sm:col-span-2">
                  <Field label="Descripción">
                    <textarea className={`${inputCls} min-h-[72px]`} value={r.description} onChange={(e) => update(idx, { description: e.target.value })} />
                  </Field>
                </div>
                <Field label="Landing path (ej: /bonus-ceti)"><input className={inputCls} value={r.landingPath ?? ""} onChange={(e) => update(idx, { landingPath: e.target.value })} placeholder="/bonus-ceti" /></Field>
                <Field label="Downloads path (ej: /bonus-ceti-descargas)"><input className={inputCls} value={r.downloadsPath ?? ""} onChange={(e) => update(idx, { downloadsPath: e.target.value })} placeholder="/bonus-ceti-descargas" /></Field>
                <div className="sm:col-span-2">
                  <Field label="URL externa (opcional)"><input className={inputCls} value={r.externalUrl ?? ""} onChange={(e) => update(idx, { externalUrl: e.target.value })} placeholder="https://..." /></Field>
                </div>
                <div className="sm:col-span-2">
                  <Field label="Highlights (uno por línea)">
                    <textarea
                      className={`${inputCls} min-h-[72px]`}
                      value={(r.highlights ?? []).join("\n")}
                      onChange={(e) => update(idx, { highlights: e.target.value.split("\n").map((s) => s.trim()).filter(Boolean) })}
                    />
                  </Field>
                </div>
                <div className="sm:col-span-2 grid grid-cols-1 gap-3">
                  <AssetUploader
                    label="PDF (descargable)"
                    kind="pdf"
                    folder={`benefits/${r.id}`}
                    value={r.pdfUrl ?? ""}
                    onChange={(v) => update(idx, { pdfUrl: v })}
                  />
                  <AssetUploader
                    label="Video (mp4/webm)"
                    kind="video"
                    folder={`benefits/${r.id}`}
                    value={r.videoUrl ?? ""}
                    onChange={(v) => update(idx, { videoUrl: v })}
                  />
                  <AssetUploader
                    label="Thumbnail / OG (1200x630)"
                    kind="image"
                    folder={`benefits/${r.id}`}
                    value={r.thumbnailUrl ?? ""}
                    onChange={(v) => update(idx, { thumbnailUrl: v })}
                  />
                </div>
              </div>
              {(r.landingPath || r.downloadsPath) && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {r.landingPath && (
                    <Link to={`/benefits/${r.id}/preview`} target="_blank" className="text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-gold">
                      Ver OG preview ↗
                    </Link>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* OG Batch Tester */}
        <div className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-display text-base text-white">Test automático OG/Twitter</h3>
              <p className="mt-1 text-xs text-white/55">Renderiza preview cards de cada landing/descarga y valida título &lt; 60 chars + imagen accesible.</p>
            </div>
            <button
              onClick={runOgTest}
              disabled={ogRunning}
              className="inline-flex items-center gap-2 rounded-full border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold hover:bg-gold/10 disabled:opacity-50"
            >
              <PlayCircle size={13} /> {ogRunning ? "Corriendo..." : "Probar todas las rutas"}
            </button>
          </div>
          {ogResults && (
            <>
              <div className="mt-4 grid grid-cols-1 gap-1 text-xs sm:grid-cols-3">
                <div className="rounded-lg border border-white/10 px-3 py-2 text-white/70">Total: <span className="text-white">{ogResults.length}</span></div>
                <div className="rounded-lg border border-emerald-500/20 px-3 py-2 text-emerald-400">OK: {ogResults.filter((r) => r.ok).length}</div>
                <div className="rounded-lg border border-amber-500/20 px-3 py-2 text-amber-400">Con avisos: {ogResults.filter((r) => !r.ok).length}</div>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-2">
                {ogResults.map((r) => (
                  <div key={r.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-3">
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <p className="truncate text-[11px] uppercase tracking-[0.22em] text-white/60">{r.label}</p>
                      {r.ok ? (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400"><Check size={10} /> OK</span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[10px] text-amber-400"><AlertTriangle size={10} /> Avisos</span>
                      )}
                    </div>
                    <OGPreviewCard title={r.label} description={r.url} image={r.image} url={r.url} />
                    {r.issues.length > 0 && (
                      <ul className="mt-2 space-y-0.5 text-[11px] text-amber-300/80">
                        {r.issues.map((i) => <li key={i}>• {i}</li>)}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Version history */}
        {snaps.length > 0 && (
          <details className="mt-6 rounded-2xl border border-white/10 bg-white/[0.02] p-4">
            <summary className="flex cursor-pointer items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-white/75">
              <History size={13} /> Historial Benefits ({snaps.length})
            </summary>
            <ul className="mt-3 max-h-64 space-y-2 overflow-auto">
              {snaps.map((s) => (
                <li key={s.id} className="flex items-center justify-between gap-3 rounded-lg border border-white/5 bg-white/[0.02] px-3 py-2 text-xs">
                  <span className="text-white/70">{new Date(s.ts).toLocaleString()}</span>
                  <button
                    onClick={() => restoreSnap(s)}
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

        <div className="mt-6 flex flex-wrap items-center justify-end gap-3">
          <button onClick={reset} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold">
            <RotateCcw size={13} /> Restablecer Benefits
          </button>
          <button onClick={save} className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-2.5 text-[11px] uppercase tracking-[0.24em] text-background hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]">
            <Save size={13} /> {saved ? "Guardado ✓" : "Guardar Benefits"}
          </button>
        </div>
      </div>
    </section>
  );
};

type OgTarget = { id: string; label: string; path: string; image?: string };
type OgCheck = OgTarget & { url: string; issues: string[]; imageOk: boolean; ok: boolean };