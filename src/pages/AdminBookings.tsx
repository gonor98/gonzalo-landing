import { useEffect, useMemo, useState } from "react";
import { Loader2, Search, Calendar as CalendarIcon, Mail, Phone, ExternalLink, RefreshCw, History, Link2, Save, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AdminAuthGate } from "@/components/AdminAuthGate";
import { SEO } from "@/components/SEO";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";

type Keynote = {
  id: string; created_at: string; booking_type: string; full_name: string; email: string;
  organization: string | null; role: string | null; phone: string | null;
  event_name: string | null; event_date: string | null; event_city: string | null;
  audience_size: string | null; budget_range: string | null; topic_interest: string | null;
  message: string | null; status: string;
};
type Meeting = {
  id: string; created_at: string; full_name: string; email: string; topic: string | null;
  message: string | null; start_time: string; end_time: string; meet_link: string | null;
  status: string; duration_minutes: number;
};
type AuditEntry = {
  id: string; booking_id: string; booking_table: string;
  actor_label: string | null; action: string; field: string | null;
  old_value: string | null; new_value: string | null; note: string | null;
  created_at: string;
};

const STATUSES = ["all", "new", "contacted", "confirmed", "cancelled", "meeting"];

function Inner() {
  const [tab, setTab] = useState<"keynotes" | "meetings">("keynotes");
  const [keynotes, setKeynotes] = useState<Keynote[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [historyFor, setHistoryFor] = useState<{ id: string; table: string; title: string } | null>(null);
  const [historyEntries, setHistoryEntries] = useState<AuditEntry[]>([]);
  const [editMeetFor, setEditMeetFor] = useState<string | null>(null);
  const [editMeetValue, setEditMeetValue] = useState("");
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const [k, m] = await Promise.all([
      supabase.from("keynote_bookings").select("*").order("created_at", { ascending: false }),
      supabase.from("meeting_bookings").select("*").order("start_time", { ascending: false }),
    ]);
    if (k.error) toast({ title: "Error keynotes", description: k.error.message, variant: "destructive" });
    if (m.error) toast({ title: "Error reuniones", description: m.error.message, variant: "destructive" });
    setKeynotes((k.data ?? []) as any);
    setMeetings((m.data ?? []) as any);
    setLoading(false);
  };
  useEffect(() => { load(); }, []);

  const audit = async (entry: Omit<AuditEntry, "id" | "created_at" | "actor_label"> & { actor_label?: string | null }) => {
    const { data: u } = await supabase.auth.getUser();
    await supabase.from("booking_audit_log").insert({
      ...entry,
      actor_user_id: u.user?.id ?? null,
      actor_label: entry.actor_label ?? u.user?.email ?? "admin",
    });
  };

  const openHistory = async (table: string, id: string, title: string) => {
    setHistoryFor({ id, table, title });
    const { data } = await supabase
      .from("booking_audit_log")
      .select("*")
      .eq("booking_id", id)
      .order("created_at", { ascending: false });
    setHistoryEntries((data ?? []) as any);
  };

  const filteredKeynotes = useMemo(() => {
    const ql = q.toLowerCase();
    return keynotes.filter(b =>
      (status === "all" || b.status === status) &&
      (!ql || b.full_name.toLowerCase().includes(ql) || b.email.toLowerCase().includes(ql) || (b.organization ?? "").toLowerCase().includes(ql))
    );
  }, [keynotes, q, status]);

  const filteredMeetings = useMemo(() => {
    const ql = q.toLowerCase();
    return meetings.filter(b =>
      (status === "all" || b.status === status) &&
      (!ql || b.full_name.toLowerCase().includes(ql) || b.email.toLowerCase().includes(ql) || (b.topic ?? "").toLowerCase().includes(ql))
    );
  }, [meetings, q, status]);

  const updateKeynoteStatus = async (b: Keynote, next: string) => {
    const { error } = await supabase.from("keynote_bookings").update({ status: next }).eq("id", b.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await audit({
      booking_id: b.id, booking_table: "keynote_bookings",
      action: "status_change", field: "status",
      old_value: b.status, new_value: next, note: null,
    });
    toast({ title: "Estado actualizado" }); load();
  };
  const updateMeetingStatus = async (b: Meeting, next: string) => {
    const { error } = await supabase.from("meeting_bookings").update({ status: next }).eq("id", b.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await audit({
      booking_id: b.id, booking_table: "meeting_bookings",
      action: next === "cancelled" ? "cancellation" : "status_change",
      field: "status", old_value: b.status, new_value: next, note: null,
    });
    toast({ title: next === "cancelled" ? "Reunión cancelada" : "Estado actualizado" }); load();
  };
  const saveMeetLink = async (b: Meeting) => {
    const next = editMeetValue.trim();
    const { error } = await supabase.from("meeting_bookings").update({ meet_link: next || null }).eq("id", b.id);
    if (error) return toast({ title: "Error", description: error.message, variant: "destructive" });
    await audit({
      booking_id: b.id, booking_table: "meeting_bookings",
      action: "meet_link_update", field: "meet_link",
      old_value: b.meet_link, new_value: next || null, note: null,
    });
    setEditMeetFor(null); toast({ title: "Link de Meet actualizado" }); load();
  };

  const fmtDate = (iso: string) => new Date(iso).toLocaleString("es-MX", { dateStyle: "medium", timeStyle: "short" });

  return (
    <main className="min-h-screen bg-background pb-24 pt-24 text-white">
      <SEO title="Admin · Bookings" description="Panel de bookings" path="/admin/bookings" />
      <div className="mx-auto max-w-content px-6 md:px-20">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Admin</p>
            <h1 className="mt-2 font-display text-4xl">Bookings</h1>
            <p className="mt-2 text-sm text-white/60">{keynotes.length} keynotes · {meetings.length} reuniones</p>
          </div>
          <button onClick={load} className="inline-flex items-center gap-2 rounded-full border border-white/15 px-4 py-2 text-xs uppercase tracking-widest text-white/70 hover:border-gold hover:text-gold">
            <RefreshCw size={12} /> Refrescar
          </button>
        </div>

        <div className="mb-6 flex flex-col gap-3 sm:flex-row">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.02] px-3">
            <Search size={14} className="text-white/40" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Buscar por nombre, email u organización…" className="flex-1 bg-transparent py-2.5 text-sm focus:outline-none" />
          </div>
          <select value={status} onChange={e => setStatus(e.target.value)} className="rounded-lg border border-white/10 bg-background px-3 py-2.5 text-sm">
            {STATUSES.map(s => <option key={s} value={s}>{s === "all" ? "Todos los estados" : s}</option>)}
          </select>
        </div>

        <Tabs value={tab} onValueChange={(v) => setTab(v as any)}>
          <TabsList className="bg-white/[0.04]">
            <TabsTrigger value="keynotes">Keynotes ({filteredKeynotes.length})</TabsTrigger>
            <TabsTrigger value="meetings">Reuniones ({filteredMeetings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="keynotes" className="mt-6">
            {loading ? <Loader2 className="mx-auto animate-spin" /> : (
              <div className="space-y-3">
                {filteredKeynotes.length === 0 && <p className="text-white/50">Sin resultados.</p>}
                {filteredKeynotes.map(b => (
                  <article key={b.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <header className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-gold">{b.booking_type} · {b.status}</p>
                        <h3 className="mt-1 font-display text-xl">{b.full_name}</h3>
                        <p className="text-sm text-white/60">{b.organization} {b.role && `· ${b.role}`}</p>
                      </div>
                      <div className="text-right text-xs text-white/50">{fmtDate(b.created_at)}</div>
                    </header>
                    <div className="mt-3 grid grid-cols-1 gap-2 text-sm text-white/75 md:grid-cols-2">
                      <a href={`mailto:${b.email}`} className="inline-flex items-center gap-1.5 hover:text-gold"><Mail size={12} />{b.email}</a>
                      {b.phone && <a href={`tel:${b.phone}`} className="inline-flex items-center gap-1.5 hover:text-gold"><Phone size={12} />{b.phone}</a>}
                      {b.event_name && <p>📅 {b.event_name} {b.event_date && `· ${b.event_date}`} {b.event_city && `· ${b.event_city}`}</p>}
                      {b.audience_size && <p>👥 {b.audience_size}</p>}
                      {b.budget_range && <p>💰 {b.budget_range}</p>}
                      {b.topic_interest && <p>🎯 {b.topic_interest}</p>}
                    </div>
                    {b.message && <p className="mt-3 whitespace-pre-wrap rounded-lg border-l-2 border-gold/40 bg-black/30 p-3 text-sm text-white/70">{b.message}</p>}
                    <div className="mt-3 flex flex-wrap items-center gap-2">
                      <select
                        value={b.status}
                        onChange={(e) => updateKeynoteStatus(b, e.target.value)}
                        className="rounded-full border border-white/10 bg-background px-3 py-1.5 text-[11px] uppercase tracking-widest"
                      >
                        {["new","contacted","confirmed","cancelled"].map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <button onClick={() => openHistory("keynote_bookings", b.id, b.full_name)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/70 hover:border-gold hover:text-gold">
                        <History size={11} /> Historial
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="meetings" className="mt-6">
            {loading ? <Loader2 className="mx-auto animate-spin" /> : (
              <div className="space-y-3">
                {filteredMeetings.length === 0 && <p className="text-white/50">Sin reuniones.</p>}
                {filteredMeetings.map(b => (
                  <article key={b.id} className="rounded-xl border border-white/10 bg-white/[0.02] p-5">
                    <header className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] uppercase tracking-[0.28em] text-gold inline-flex items-center gap-1.5"><CalendarIcon size={11}/>{fmtDate(b.start_time)} · {b.duration_minutes}min</p>
                        <h3 className="mt-1 font-display text-xl">{b.full_name}</h3>
                        <a href={`mailto:${b.email}`} className="text-sm text-white/60 hover:text-gold">{b.email}</a>
                      </div>
                      <span className={`rounded-full px-3 py-1 text-[10px] uppercase tracking-widest ${b.status === "confirmed" ? "bg-gold/15 text-gold" : "bg-red-500/15 text-red-300"}`}>{b.status}</span>
                    </header>
                    {b.topic && <p className="mt-2 text-sm text-white/70">🎯 {b.topic}</p>}
                    {b.message && <p className="mt-2 text-sm text-white/60">{b.message}</p>}
                    <div className="mt-3 flex flex-wrap gap-2">
                      {b.meet_link && (
                        <a href={b.meet_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-gold px-3 py-1.5 text-[11px] uppercase tracking-widest text-background hover:opacity-90">
                          <ExternalLink size={11} /> Google Meet
                        </a>
                      )}
                      {editMeetFor === b.id ? (
                        <span className="inline-flex items-center gap-1">
                          <input value={editMeetValue} onChange={e => setEditMeetValue(e.target.value)} placeholder="https://meet.google.com/..." className="w-64 rounded-full border border-white/15 bg-background px-3 py-1.5 text-[11px]" />
                          <button onClick={() => saveMeetLink(b)} className="rounded-full border border-gold px-3 py-1.5 text-[11px] text-gold"><Save size={11} /></button>
                          <button onClick={() => setEditMeetFor(null)} className="rounded-full border border-white/15 px-3 py-1.5 text-[11px]"><X size={11} /></button>
                        </span>
                      ) : (
                        <button onClick={() => { setEditMeetFor(b.id); setEditMeetValue(b.meet_link ?? ""); }} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/70 hover:border-gold hover:text-gold">
                          <Link2 size={11} /> Editar Meet
                        </button>
                      )}
                      {b.status === "confirmed" && (
                        <button onClick={() => updateMeetingStatus(b, "cancelled")} className="rounded-full border border-red-500/40 px-3 py-1.5 text-[11px] uppercase tracking-widest text-red-300 hover:bg-red-500/10">
                          Cancelar
                        </button>
                      )}
                      <button onClick={() => openHistory("meeting_bookings", b.id, b.full_name)} className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-widest text-white/70 hover:border-gold hover:text-gold">
                        <History size={11} /> Historial
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* History drawer */}
      {historyFor && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60" onClick={() => setHistoryFor(null)}>
          <div onClick={(e) => e.stopPropagation()} className="h-full w-full max-w-md overflow-auto border-l border-white/10 bg-background p-6">
            <div className="mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Historial</p>
                <h2 className="mt-1 font-display text-xl">{historyFor.title}</h2>
              </div>
              <button onClick={() => setHistoryFor(null)} className="rounded-full border border-white/15 p-2 text-white/60 hover:text-white"><X size={14} /></button>
            </div>
            {historyEntries.length === 0 ? (
              <p className="text-sm text-white/50">Sin cambios registrados aún.</p>
            ) : (
              <ol className="space-y-3">
                {historyEntries.map(h => (
                  <li key={h.id} className="rounded-lg border border-white/10 bg-white/[0.02] p-3 text-sm">
                    <p className="text-[10px] uppercase tracking-widest text-gold/80">{h.action.replace(/_/g, " ")}</p>
                    <p className="mt-1 text-white/80">
                      {h.field && <span className="text-white/50">{h.field}: </span>}
                      {h.old_value && <span className="line-through text-red-300/70">{h.old_value}</span>}
                      {h.old_value && h.new_value && " → "}
                      {h.new_value && <span className="text-emerald-300">{h.new_value}</span>}
                    </p>
                    {h.note && <p className="mt-1 text-xs text-white/60">{h.note}</p>}
                    <p className="mt-1 text-[10px] text-white/40">{h.actor_label ?? "admin"} · {fmtDate(h.created_at)}</p>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default function AdminBookings() {
  return <AdminAuthGate><Inner /></AdminAuthGate>;
}
