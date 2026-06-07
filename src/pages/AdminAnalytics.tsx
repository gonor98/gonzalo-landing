import { useEffect, useMemo, useState } from "react";
import { Loader2, RefreshCw, TrendingUp, MousePointerClick, MailCheck, MoveDown, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { SEO } from "@/components/SEO";

type EventRow = {
  id: string;
  event: string;
  path: string | null;
  session_id: string | null;
  properties: Record<string, unknown> | null;
  referrer: string | null;
  created_at: string;
};

const RANGES = [
  { id: "24h", label: "24 h", ms: 24 * 60 * 60 * 1000 },
  { id: "7d", label: "7 días", ms: 7 * 24 * 60 * 60 * 1000 },
  { id: "30d", label: "30 días", ms: 30 * 24 * 60 * 60 * 1000 },
] as const;

function Inner() {
  const [rows, setRows] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [range, setRange] = useState<typeof RANGES[number]["id"]>("7d");

  const load = async () => {
    setLoading(true);
    const since = new Date(Date.now() - (RANGES.find((r) => r.id === range)?.ms ?? 7 * 86400000)).toISOString();
    const { data } = await supabase
      .from("analytics_events")
      .select("*")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    setRows((data as any) ?? []);
    setLoading(false);
  };
  useEffect(() => { load(); }, [range]);
  // Realtime via polling every 15s
  useEffect(() => {
    const t = setInterval(load, 15000);
    return () => clearInterval(t);
  }, [range]);

  const stats = useMemo(() => {
    const newsletter = rows.filter((r) => r.event === "newsletter_event");
    const action = (a: string) => newsletter.filter((r) => (r.properties as any)?.action === a).length;
    const scrolls = rows.filter((r) => r.event === "scroll_depth");
    const sessions = new Set(rows.map((r) => r.session_id).filter(Boolean)).size;
    const view = action("view");
    const submit = action("submit");
    const success = action("success");
    const dismiss = action("dismiss");
    const conv = view ? Math.round((success / view) * 1000) / 10 : 0;
    const byDepth = (d: number) => scrolls.filter((s) => Number((s.properties as any)?.percent) === d).length;
    const ctaClicks = rows.filter((r) => r.event === "cta_click");
    const relatedClicks = ctaClicks.filter((r) => String((r.properties as any)?.cta ?? "").startsWith("related_")).length;
    const topCta: Record<string, number> = {};
    for (const c of ctaClicks) {
      const k = String((c.properties as any)?.cta ?? "n/a");
      topCta[k] = (topCta[k] ?? 0) + 1;
    }
    const topCtaSorted = Object.entries(topCta).sort((a, b) => b[1] - a[1]).slice(0, 10);
    const topPaths: Record<string, number> = {};
    for (const r of rows) {
      const k = r.path ?? "n/a";
      topPaths[k] = (topPaths[k] ?? 0) + 1;
    }
    const topPathsSorted = Object.entries(topPaths).sort((a, b) => b[1] - a[1]).slice(0, 10);
    return { view, submit, success, dismiss, conv, sessions, byDepth, ctaClicks: ctaClicks.length, relatedClicks, topCtaSorted, topPathsSorted };
  }, [rows]);

  const Card = ({ icon: Icon, label, value, hint }: any) => (
    <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-5">
      <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.22em] text-white/55">
        <Icon size={13} className="text-gold" /> {label}
      </div>
      <div className="mt-3 font-display text-3xl text-white">{value}</div>
      {hint && <div className="mt-1 text-[11px] text-white/45">{hint}</div>}
    </div>
  );

  return (
    <main className="min-h-screen bg-background text-foreground">
      <SEO title="Dashboard analíticas · Admin" description="Resumen de conversión en tiempo real." path="/admin/analytics" />
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-28">
        <header className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Admin · Analytics</p>
            <h1 className="mt-2 font-display text-4xl text-white">Conversión en tiempo real</h1>
            <p className="mt-1 text-sm text-white/55">Newsletter, scroll depth y CTAs · refresh cada 15 s.</p>
          </div>
          <div className="flex items-center gap-2">
            {RANGES.map((r) => (
              <button
                key={r.id}
                onClick={() => setRange(r.id)}
                className={`rounded-full border px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] ${range === r.id ? "border-gold bg-gold/10 text-gold" : "border-white/15 text-white/55 hover:border-white/40"}`}
              >{r.label}</button>
            ))}
            <button onClick={load} className="rounded-full border border-white/15 px-3 py-1.5 text-white/60 hover:border-white/40">
              <RefreshCw size={13} className={loading ? "animate-spin" : ""} />
            </button>
          </div>
        </header>

        <section className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card icon={Users} label="Sesiones únicas" value={stats.sessions} />
          <Card icon={MailCheck} label="Newsletter view → success" value={`${stats.conv}%`} hint={`${stats.view} views · ${stats.submit} submits · ${stats.success} confirmados`} />
          <Card icon={MousePointerClick} label="CTA clicks" value={stats.ctaClicks} hint={`${stats.relatedClicks} desde "Lecturas relacionadas"`} />
          <Card icon={TrendingUp} label="Eventos totales" value={rows.length} />
        </section>

        <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[25, 50, 75, 100].map((d) => (
            <Card key={d} icon={MoveDown} label={`Scroll ${d}%`} value={stats.byDepth(d)} />
          ))}
        </section>

        <section className="mt-10 grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-display text-lg text-white">Top CTAs</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {stats.topCtaSorted.length === 0 && <li className="text-white/45">Sin datos aún.</li>}
              {stats.topCtaSorted.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                  <span className="truncate text-white/75">{k}</span>
                  <span className="font-mono text-gold">{v}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6">
            <h2 className="font-display text-lg text-white">Top rutas</h2>
            <ul className="mt-4 space-y-2 text-sm">
              {stats.topPathsSorted.length === 0 && <li className="text-white/45">Sin datos aún.</li>}
              {stats.topPathsSorted.map(([k, v]) => (
                <li key={k} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2">
                  <span className="truncate text-white/75">{k}</span>
                  <span className="font-mono text-gold">{v}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
          <h2 className="font-display text-lg text-white">Últimos 100 eventos</h2>
          {loading ? (
            <div className="flex items-center gap-2 py-6 text-white/55"><Loader2 className="animate-spin" size={14} /> Cargando...</div>
          ) : (
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-white/45">
                  <tr className="text-left">
                    <th className="py-2 pr-3">Evento</th>
                    <th className="py-2 pr-3">Ruta</th>
                    <th className="py-2 pr-3">Props</th>
                    <th className="py-2 pr-3">Cuándo</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.slice(0, 100).map((r) => (
                    <tr key={r.id} className="border-t border-white/5 align-top text-white/75">
                      <td className="py-2 pr-3 font-mono text-gold">{r.event}</td>
                      <td className="py-2 pr-3">{r.path}</td>
                      <td className="py-2 pr-3 font-mono text-[11px] text-white/55">{r.properties ? JSON.stringify(r.properties) : ""}</td>
                      <td className="py-2 pr-3 whitespace-nowrap">{new Date(r.created_at).toLocaleString("es-MX")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function AdminAnalytics() {
  return (
    <AdminAuthGate>
      <Inner />
    </AdminAuthGate>
  );
}