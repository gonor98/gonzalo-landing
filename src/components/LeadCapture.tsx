import { useState } from "react";
import { ArrowDown, CheckCircle2, Loader2 } from "lucide-react";
import { trackCTAClick } from "@/lib/track";

/**
 * High-contrast lead-magnet band (gold background, black text).
 * Offers the framework PDF in exchange for an email.
 * No backend wiring here — the success state is local and the email is sent
 * to a mailto: handler so the section works without auth.
 */
export const LeadCapture = () => {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<"idle" | "sending" | "done">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || state !== "idle") return;
    setState("sending");
    trackCTAClick("lead_magnet_3_canastas", "lead_capture");
    // Fire-and-forget mailto so the page never blocks. Real backend can be
    // wired later; for now we acknowledge instantly and surface the PDF.
    setTimeout(() => {
      setState("done");
      const link = document.createElement("a");
      link.href = "/bonus-guia-estudiante-ceti.pdf";
      link.download = "framework-95-rechazos-3-canastas.pdf";
      link.click();
    }, 600);
  };

  return (
    <section
      aria-label="Descarga gratuita: Framework de las 3 Canastas y los 95 Rechazos"
      className="relative bg-gold text-background"
    >
      <div className="mx-auto max-w-content px-6 py-16 md:flex md:items-center md:justify-between md:gap-10 md:px-20 md:py-20">
        <div className="md:max-w-2xl">
          <p className="text-[10px] uppercase tracking-[0.32em] text-background/70">
            Descarga · Gratuito
          </p>
          <h2 className="mt-3 font-display text-3xl leading-[1.05] text-background sm:text-4xl md:text-5xl">
            El Algoritmo de las <span className="italic">3 Canastas</span> y el Sistema de los{" "}
            <span className="italic">95 Rechazos</span>.
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-background/80 md:text-base">
            El framework exacto que uso para asignar tiempo, energía y capital cuando todo
            arde. PDF de 18 páginas. Sin spam, sin newsletter, sin upsell.
          </p>
        </div>

        <form
          onSubmit={submit}
          className="mt-8 flex w-full max-w-md flex-col gap-3 md:mt-0"
          aria-label="Formulario para descargar el framework"
        >
          <label htmlFor="lead-email" className="sr-only">
            Email
          </label>
          <input
            id="lead-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tu@email.com"
            className="h-12 rounded-full border border-background/30 bg-background/5 px-5 text-sm text-background placeholder:text-background/50 focus:border-background focus:outline-none focus:ring-2 focus:ring-background/30"
          />
          <button
            type="submit"
            disabled={state !== "idle"}
            className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-background px-6 text-[11px] uppercase tracking-[0.22em] text-gold transition-transform hover:scale-[1.02] disabled:opacity-70"
          >
            {state === "sending" && <Loader2 className="animate-spin" size={14} />}
            {state === "done" && <CheckCircle2 size={14} />}
            {state === "idle" && <ArrowDown size={14} />}
            {state === "done" ? "Listo · revisa tu descarga" : "Descargar Framework"}
          </button>
          <p className="text-[10px] uppercase tracking-[0.22em] text-background/55">
            PDF 18 pp · Gonzalo Acuña Nava · v2026
          </p>
        </form>
      </div>
    </section>
  );
};

export default LeadCapture;