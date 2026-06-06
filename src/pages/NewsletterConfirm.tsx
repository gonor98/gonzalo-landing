import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import { trackNewsletter } from "@/lib/track";

type State = "loading" | "ok" | "already" | "error";

const NewsletterConfirm = () => {
  const [sp] = useSearchParams();
  const token = sp.get("token") ?? "";
  const [state, setState] = useState<State>("loading");
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!token) { setState("error"); return; }
      try {
        const { data, error } = await supabase.functions.invoke("newsletter-confirm", { body: { token } });
        if (cancelled) return;
        if (error) { setState("error"); return; }
        const status = (data as any)?.status;
        setEmail((data as any)?.email ?? null);
        if (status === "confirmed") { setState("ok"); trackNewsletter("success", "/newsletter/confirm", { stage: "double_opt_in" }); }
        else if (status === "already_confirmed") setState("already");
        else setState("error");
      } catch { if (!cancelled) setState("error"); }
    })();
    return () => { cancelled = true; };
  }, [token]);

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO title="Confirma tu suscripción · Gonzalo Acuña Nava" description="Confirma tu suscripción al newsletter de Gonzalo Acuña Nava." path="/newsletter/confirm" noIndex />
      <Nav />
      <section className="mx-auto flex max-w-xl flex-col items-center px-6 pt-40 text-center">
        {state === "loading" && (<><Loader2 className="h-8 w-8 animate-spin text-gold" /><p className="mt-4 text-white/70">Confirmando...</p></>)}
        {(state === "ok" || state === "already") && (
          <>
            <CheckCircle2 className="h-10 w-10 text-gold" />
            <h1 className="mt-5 font-display text-3xl text-white sm:text-4xl">
              {state === "ok" ? "¡Suscripción confirmada!" : "Ya estabas en la lista"}
            </h1>
            <p className="mt-3 text-white/70">{email ? `Correo: ${email}` : ""} — A partir de ahora te llega un email cada 2 semanas con lo que aprendo construyendo PropMatch, CALLII y Finple.</p>
            <Link to="/blog" className="mt-8 inline-flex rounded-full bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-background">Leer el blog</Link>
          </>
        )}
        {state === "error" && (
          <>
            <XCircle className="h-10 w-10 text-red-400" />
            <h1 className="mt-5 font-display text-3xl text-white sm:text-4xl">Token inválido o expirado</h1>
            <p className="mt-3 text-white/70">Vuelve a suscribirte desde la home para recibir un nuevo link de confirmación.</p>
            <Link to="/" className="mt-8 inline-flex rounded-full border border-gold/50 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-gold">Volver al inicio</Link>
          </>
        )}
      </section>
      <SiteFooter />
    </main>
  );
};
export default NewsletterConfirm;