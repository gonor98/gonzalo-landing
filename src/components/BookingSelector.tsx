import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Loader2 } from "lucide-react";
import { useMemo, useRef, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { bookingTypes, type BookingType } from "@/lib/booking";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const NAME_MIN = 2;
const NAME_MAX = 120;
const EMAIL_MAX = 200;

type FieldError = { field: string; message: string };

function validateClient(
  values: Record<string, string>,
  fields: { name: string; label: string; required?: boolean; type: string }[],
): FieldError | null {
  for (const f of fields) {
    const v = values[f.name]?.trim() ?? "";
    if (f.required && !v) {
      return { field: f.name, message: `Falta: ${f.label}` };
    }
  }
  const name = values.full_name?.trim() ?? "";
  if (name.length < NAME_MIN || name.length > NAME_MAX) {
    return {
      field: "full_name",
      message: `El nombre debe tener entre ${NAME_MIN} y ${NAME_MAX} caracteres.`,
    };
  }
  const email = values.email?.trim() ?? "";
  if (!email || email.length > EMAIL_MAX || !EMAIL_RE.test(email)) {
    return {
      field: "email",
      message: "Email inválido. Revisa el formato (ej. nombre@empresa.com).",
    };
  }
  return null;
}

export const BookingSelector = () => {
  const [type, setType] = useState<BookingType>("organizer");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [values, setValues] = useState<Record<string, string>>({});
  const [fieldError, setFieldError] = useState<FieldError | null>(null);
  const submittingRef = useRef(false); // hard guard against double-submit
  const { toast } = useToast();

  const config = useMemo(() => bookingTypes.find((b) => b.id === type)!, [type]);

  const setField = (k: string, v: string) => setValues((s) => ({ ...s, [k]: v }));

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Anti-double-submit: hard ref guard + state flag
    if (submittingRef.current) return;
    submittingRef.current = true;
    setSubmitting(true);
    setFieldError(null);

    // Full client-side validation
    const invalid = validateClient(values, config.fields);
    if (invalid) {
      setFieldError(invalid);
      // Safe log: which field failed, never the value itself
      console.warn("[booking] client validation failed", { field: invalid.field });
      toast({ title: "Revisa el formulario", description: invalid.message, variant: "destructive" });
      submittingRef.current = false;
      setSubmitting(false);
      return;
    }

    try {
      const { data, error } = await supabase.functions.invoke("submit-booking", {
        body: { booking_type: type, ...values, website: values.website ?? "" },
      });

      // Surface 4xx/5xx body messages from the edge function
      if (error) {
        let serverMsg = error.message ?? "Error desconocido del servidor.";
        let serverField: string | undefined;
        try {
          const ctx = (error as any).context;
          if (ctx && typeof ctx.json === "function") {
            const j = await ctx.json();
            if (j?.error) serverMsg = j.error;
            if (j?.field) serverField = j.field;
          }
        } catch {}
        if (serverField) setFieldError({ field: serverField, message: serverMsg });
        // Safe log: status + offending field, never the values
        console.warn("[booking] server rejected submission", {
          field: serverField ?? "unknown",
          status: (error as any)?.context?.status,
        });
        throw new Error(serverMsg);
      }
      if ((data as any)?.error) throw new Error((data as any).error);
      setDone(true);
      toast({
        title: "Solicitud enviada",
        description: "Recibirás un correo de confirmación en minutos.",
      });
    } catch (err: any) {
      // Safe log: only message, no PII
      console.error("[booking] submission failed:", err?.message);
      toast({
        title: "No pudimos enviar tu solicitud",
        description: err?.message || "Intenta de nuevo en unos segundos.",
        variant: "destructive",
      });
    } finally {
      submittingRef.current = false;
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
            setFieldError(null);
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
      {/* Quick alternative: book a 30-min video call directly */}
      <div className="mb-6 flex flex-col items-start justify-between gap-3 rounded-[14px] border border-gold/30 bg-gold/5 p-5 sm:flex-row sm:items-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Atajo</p>
          <p className="mt-1 text-sm text-white/80">¿Solo quieres conocernos? Agenda una videollamada de 30 min con disponibilidad en tiempo real.</p>
        </div>
        <a
          href="/agenda"
          className="inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-gold transition hover:bg-gold hover:text-background"
        >
          Agendar videollamada <ArrowRight size={14} />
        </a>
      </div>
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
            {/* Honeypot — hidden from users, bots fill it */}
            <input
              type="text"
              name="website"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
              value={values.website ?? ""}
              onChange={(e) => setField("website", e.target.value)}
              style={{ position: "absolute", left: "-9999px", width: 1, height: 1, opacity: 0 }}
            />
            {config.fields.map((f) => {
              const id = `f-${f.name}`;
              const isWide = f.type === "textarea";
              const hasError = fieldError?.field === f.name;
              const common = `w-full rounded-[10px] border bg-background/60 px-4 py-3 text-sm text-white placeholder:text-white/35 focus:outline-none transition-colors ${
                hasError
                  ? "border-red-500/60 focus:border-red-500"
                  : "border-white/10 focus:border-gold/60"
              }`;
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
                      onChange={(e) => {
                        setField(f.name, e.target.value);
                        if (fieldError?.field === f.name) setFieldError(null);
                      }}
                      className={common}
                    />
                  ) : f.type === "select" ? (
                    <select
                      id={id}
                      value={values[f.name] ?? ""}
                      onChange={(e) => {
                        setField(f.name, e.target.value);
                        if (fieldError?.field === f.name) setFieldError(null);
                      }}
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
                      minLength={f.name === "full_name" ? NAME_MIN : undefined}
                      maxLength={
                        f.name === "full_name" ? NAME_MAX : f.name === "email" ? EMAIL_MAX : 200
                      }
                      placeholder={f.placeholder}
                      value={values[f.name] ?? ""}
                      onChange={(e) => {
                        setField(f.name, e.target.value);
                        if (fieldError?.field === f.name) setFieldError(null);
                      }}
                      className={common}
                    />
                  )}
                  {hasError && (
                    <p className="mt-1.5 text-[11px] text-red-400">{fieldError.message}</p>
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
              aria-busy={submitting}
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
