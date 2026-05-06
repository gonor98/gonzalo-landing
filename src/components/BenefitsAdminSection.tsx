import { useState } from "react";
import { Plus, Trash2, Save, RotateCcw, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import {
  BENEFITS,
  ICONS,
  readBenefitsBundle,
  writeBenefitsBundle,
  resetBenefits,
  type BenefitOverride,
  type BenefitsBundle,
  type BenefitStatus,
} from "@/lib/benefits";

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
      _origin: "base", _removed: removed.has(it.id),
    };
  });
  const added: Row[] = (b.added ?? []).map((a) => ({ ...a, _origin: "added" }));
  return [...base, ...added];
};

export const BenefitsAdminSection = () => {
  const [rows, setRows] = useState<Row[]>(() => buildRows(readBenefitsBundle()));
  const [saved, setSaved] = useState(false);

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

  const save = () => {
    const bundle: BenefitsBundle = { edits: {}, added: [], removed: [] };
    rows.forEach((r) => {
      const { _origin, _removed, ...clean } = r;
      if (_origin === "base") {
        if (_removed) { bundle.removed!.push(r.id); return; }
        const baseEntry = BENEFITS.find((b) => b.id === r.id)!;
        const diff: Partial<BenefitOverride> = {};
        (Object.keys(clean) as (keyof BenefitOverride)[]).forEach((k) => {
          const cv = clean[k]; const bv = (baseEntry as Record<string, unknown>)[k];
          if (k === "iconKey") { if (cv && cv !== "GraduationCap") (diff as Record<string, unknown>)[k] = cv; return; }
          if (JSON.stringify(cv) !== JSON.stringify(bv)) (diff as Record<string, unknown>)[k] = cv;
        });
        if (Object.keys(diff).length) bundle.edits![r.id] = diff;
      } else {
        bundle.added!.push(clean);
      }
    });
    writeBenefitsBundle(bundle);
    setSaved(true);
    setTimeout(() => setSaved(false), 1600);
  };

  const reset = () => {
    if (!confirm("¿Restablecer el catálogo Benefits a los valores por defecto?")) return;
    resetBenefits();
    setRows(buildRows({}));
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