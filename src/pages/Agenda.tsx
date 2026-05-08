import { useEffect, useMemo, useState } from "react";
import { Loader2, CheckCircle2, Calendar as CalendarIcon } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";

interface Slot { start: string; end: string; available: boolean }

function todayISO() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function addDaysISO(base: string, n: number) {
  const d = new Date(base + "T12:00:00Z");
  d.setUTCDate(d.getUTCDate() + n);
  return d.toISOString().slice(0, 10);
}

const fmtTime = (iso: string) =>
  new Intl.DateTimeFormat("es-MX", { hour: "2-digit", minute: "2-digit", timeZone: "America/Mexico_City" }).format(new Date(iso));

const fmtDate = (iso: string) =>
  new Intl.DateTimeFormat("es-MX", { weekday: "long", day: "numeric", month: "long", timeZone: "America/Mexico_City" }).format(new Date(iso + "T12:00:00Z"));

export default function Agenda() {
  const [date, setDate] = useState(todayISO());
  const [slots, setSlots] = useState<Slot[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Slot | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<{ meetLink?: string } | null>(null);
  const [form, setForm] = useState({ full_name: "", email: "", topic: "", message: "" });
  const { toast } = useToast();

  const days = useMemo(() => {
    const start = todayISO();
    return Array.from({ length: 14 }, (_, i) => addDaysISO(start, i));
  }, []);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setSelected(null);
    supabase.functions.invoke("agenda-slots", { body: { date } }).then(({ data, error }) => {
      if (cancelled) return;
      if (error || (data as any)?.error) {
        toast({ title: "No pudimos cargar los horarios", description: error?.message || (data as any)?.error, variant: "destructive" });
        setSlots([]);
      } else {
        setSlots((data as any).slots ?? []);
      }
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [date, toast]);

  const handleBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selected) return;
    setSubmitting(true);
    const { data, error } = await supabase.functions.invoke("agenda-book", {
      body: { ...form, start: selected.start, end: selected.end },
    });
    setSubmitting(false);
    if (error || (data as any)?.error) {
      const msg = (data as any)?.error === "slot_taken" ? "Ese horario acaba de ocuparse, elige otro." : (error?.message || (data as any)?.error || "Error al agendar");
      toast({ title: "No se pudo agendar", description: msg, variant: "destructive" });
      return;
    }
    setDone({ meetLink: (data as any)?.meetLink });
  };

  return (
    <div className="min-h-screen bg-background text-white">
      <SEO title="Agenda una reunión · Gonzalo Acuña" description="Agenda una videollamada con Gonzalo Acuña Nava. Disponibilidad en tiempo real con Google Meet." />
      <Nav />
      <main className="mx-auto max-w-content px-6 pb-24 pt-32 md:px-20">
        <header className="mb-12 max-w-2xl">
          <p className="text-xs uppercase tracking-[0.3em] text-gold">Agenda</p>
          <h1 className="mt-3 font-display text-4xl leading-tight md:text-5xl">Agenda una videollamada de 30 minutos</h1>
          <p className="mt-4 text-white/60">Selecciona un día y un horario disponible. Recibirás un correo de confirmación con el link de Google Meet y un archivo .ics para tu calendario.</p>
        </header>

        {done ? (
          <div className="rounded-2xl border border-gold/30 bg-white/5 p-8">
            <div className="flex items-center gap-3 text-gold">
              <CheckCircle2 className="h-6 w-6" />
              <h2 className="font-display text-2xl">Reunión confirmada</h2>
            </div>
            <p className="mt-3 text-white/70">Te enviamos los detalles a <strong>{form.email}</strong>.</p>
            {done.meetLink && (
              <a href={done.meetLink} target="_blank" rel="noreferrer" className="mt-6 inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-sm font-medium text-background hover:opacity-90">
                Unirse por Google Meet
              </a>
            )}
          </div>
        ) : (
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-sm uppercase tracking-widest text-white/50"><CalendarIcon className="h-4 w-4" /> Día</h2>
              <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                {days.map(d => (
                  <button key={d} onClick={() => setDate(d)}
                    className={`rounded-lg border px-3 py-3 text-left text-xs transition ${d === date ? "border-gold bg-gold/10 text-white" : "border-white/10 text-white/60 hover:border-white/30"}`}>
                    <div className="font-medium capitalize">{new Intl.DateTimeFormat("es-MX",{weekday:"short",timeZone:"America/Mexico_City"}).format(new Date(d+"T12:00:00Z"))}</div>
                    <div className="text-lg text-white">{new Date(d+"T12:00:00Z").getUTCDate()}</div>
                  </button>
                ))}
              </div>

              <h2 className="mb-4 mt-8 text-sm uppercase tracking-widest text-white/50">Horarios · {fmtDate(date)}</h2>
              {loading ? (
                <div className="flex items-center gap-2 text-white/60"><Loader2 className="h-4 w-4 animate-spin" /> Cargando disponibilidad…</div>
              ) : (
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {slots.length === 0 && <p className="col-span-full text-sm text-white/50">No hay horarios disponibles este día.</p>}
                  {slots.map(s => (
                    <button key={s.start} disabled={!s.available} onClick={() => setSelected(s)}
                      className={`rounded-lg border px-3 py-2 text-sm transition ${
                        selected?.start === s.start ? "border-gold bg-gold/15 text-white" :
                        s.available ? "border-white/10 text-white hover:border-gold/50" :
                        "cursor-not-allowed border-white/5 text-white/25 line-through"
                      }`}>
                      {fmtTime(s.start)}
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="mb-4 text-sm uppercase tracking-widest text-white/50">Tus datos</h2>
              <form onSubmit={handleBook} className="space-y-4 rounded-2xl border border-white/10 bg-white/[0.02] p-6">
                <div className="text-sm text-white/70">
                  {selected ? (
                    <>Reservando: <strong className="text-gold">{fmtDate(date)} · {fmtTime(selected.start)}</strong></>
                  ) : "Selecciona un horario para continuar."}
                </div>
                <input required minLength={2} maxLength={120} placeholder="Nombre completo *"
                  value={form.full_name} onChange={e => setForm(f => ({...f, full_name: e.target.value}))}
                  className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                <input required type="email" maxLength={200} placeholder="Email *"
                  value={form.email} onChange={e => setForm(f => ({...f, email: e.target.value}))}
                  className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                <input maxLength={200} placeholder="Tema / contexto (opcional)"
                  value={form.topic} onChange={e => setForm(f => ({...f, topic: e.target.value}))}
                  className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                <textarea maxLength={2000} rows={4} placeholder="¿De qué quieres hablar? (opcional)"
                  value={form.message} onChange={e => setForm(f => ({...f, message: e.target.value}))}
                  className="w-full rounded-lg border border-white/10 bg-background px-4 py-3 text-sm focus:border-gold focus:outline-none" />
                <button type="submit" disabled={!selected || submitting}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gold px-6 py-3 text-sm font-medium text-background transition hover:opacity-90 disabled:opacity-40">
                  {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                  Confirmar reunión
                </button>
                <p className="text-[11px] text-white/40">Se creará un evento en el calendario de Gonzalo y recibirás link de Google Meet por correo.</p>
              </form>
            </section>
          </div>
        )}
      </main>
      <SiteFooter />
    </div>
  );
}