import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { bookingTypes, type BookingType } from "@/lib/booking";

export const BookingSelector = () => {
  const [type, setType] = useState<BookingType>("organizer");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const { toast } = useToast();

  const config = useMemo(() => bookingTypes.find((b) => b.id === type)!, [type]);

  const setField = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    // Quick client-side checks for required
    for (const f of config.fields) {
      if (f.required && !values[f.name]?.trim()) {
        toast({ title: "Campo requerido", description: `Falta: ${f.label}`, variant: "destructive" });
        setSubmitting(false);
        return;
      }
    }

    try {
      const { error } = await supabase.functions.invoke("submit-booking", {
        body: { booking_type: type, ...values },
      });
      if (error) throw error;
      setDone(true);
      toast({ title: "Solicitud enviada", description: "Recibirás un correo de confirmación en minutos." });
    } catch (err: any) {
      console.error(err);
      toast({
        title: "No pudimos enviar tu solicitud",
        description: err?.message || "Intenta de nuevo en unos segundos.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (done) {
    return (
      <div className="mx-auto max-w-2xl rounded-[18px] border border-gold/30 bg-card/40 p-10 text-center backdrop-blur">
        <CheckCircle2 size={48} className="mx-auto text-gold" />
        <h3 className="mt-6 font-display text-3xl text-white">Recibimos tu solicitud</h3>
        <p className="mt-3 text-white/70">
          Te enviamos una confirmación a tu correo. Una persona del equipo te contactará en menos de 48 horas
          hábiles con la disponibilidad de Gonzalo para Q2–Q4 2026.
        </p>
        <button
          onClick={() => {
            setDone(false);
            setValues({});
          }}
          className="mt-8 text-[11px] uppercase tracking-[0.22em] text-gold/70 hover:text-gold"
        >
          Enviar otra solicitud
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      {/* Type selector */}
      <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
        {bookingTypes.map((b) => {
          const active = b.id === type;
          return (
            <button
              key={b.id}
              type="button"
              onClick={() => setType(b.id)}
              className={`group rounded-[14px] border p-6 text-left transition-all ${
                active
                  ? "border-gold bg-gold/10 shadow-[0_0_40px_-10px_rgba(201,168,76,0.5)]"
                  : "border-white/10 bg-card/30 hover:border-gold/40"
              }`}
            >
              <p className={`text-[10px] uppercase tracking-[0.28em] ${active ? "text-gold" : "text-white/45"}`}>
                Tipo de booking
              </p>
              <h4 className="mt-2 font-display text-2xl text-white">{b.label}</h4>
              <p className="mt-2 text-sm text-white/55">{b.oneLiner}</p>
            </button>
          );
        })}
      </div>

      {/* Dynamic form */}
      <AnimatePresence mode="wait">
        <motion.form
          key={type}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          onSubmit={onSubmit}
          className="mt-8 rounded-[18px] border border-white/10 bg-card/40 p-6 backdrop-blur md:p-10"
        >
          <p className="mb-8 text-sm text-white/60">{config.description}</p>

          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {config.fields.map((f) => {
              const id = `f-${f.name}`;
              const isWide = f.type === "textarea";
              const common =
                "w-full rounded-[10px] border border-white/10 bg-background/60 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none focus:border-gold/60 transition-colors";
              return (
                <div key={f.name} className={isWide ? "md:col-span-2" : ""}>
                  <label htmlFor={id} className="mb-2 block text-[10px] uppercase tracking-[0.22em] text-white/55">
                    {f.label} {f.required && <span className="text-gold">*</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      id={id}
                      rows={4}
                      maxLength={2000}
                      placeholder={f.placeholder}
                      value={values[f.name] ?? ""}
                      onChange={(e) => setField(f.name, e.target.value)}
                      className={common}
                    />
                  ) : f.type === "select" ? (
                    <select
                      id={id}
                      value={values[f.name] ?? ""}
                      onChange={(e) => setField(f.name, e.target.value)}
                      className={common}
                    >
                      <option value="">Selecciona...</option>
                      {f.options?.map((o) => (
                        <option key={o} value={o} className="bg-background">
                          {o}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={id}
                      type={f.type}
                      required={f.required}
                      maxLength={200}
                      placeholder={f.placeholder}
                      value={values[f.name] ?? ""}
                      onChange={(e) => setField(f.name, e.target.value)}
                      className={common}
                    />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] uppercase tracking-[0.22em] text-white/40">
              Respuesta &lt; 48h hábiles
            </p>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-3 rounded-full bg-gold px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_40px_rgba(201,168,76,0.5)] disabled:opacity-60"
            >
              {submitting ? <Loader2 size={14} className="animate-spin" /> : <ArrowRight size={14} />}
              {submitting ? "Enviando..." : "Enviar solicitud"}
            </button>
          </div>
        </motion.form>
      </AnimatePresence>
    </div>
  );
};
