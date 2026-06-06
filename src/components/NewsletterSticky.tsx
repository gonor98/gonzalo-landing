import { useEffect, useState } from "react";
import { Mail, X, Loader2, CheckCircle2 } from "lucide-react";
import { useLocation } from "react-router-dom";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { trackCTAClick, trackNewsletter } from "@/lib/track";

const STORAGE_KEY = "ga_newsletter_dismissed_v1";
const EMAIL_SCHEMA = z
  .string()
  .trim()
  .email("Ingresa un correo válido (ej. nombre@empresa.com)")
  .max(200, "Correo demasiado largo");

// Sticky newsletter bar — only on home and blog routes
const ALLOWED_PATHS = (path: string) =>
  path === "/" || path === "/blog" || path.startsWith("/blog/");

export const NewsletterSticky = () => {
  const { pathname } = useLocation();
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (!ALLOWED_PATHS(pathname)) {
      setOpen(false);
      return;
    }
    if (typeof window === "undefined") return;
    if (window.sessionStorage.getItem(STORAGE_KEY) === "1") return;
    // small delay so it doesn't fight LCP
    const t = window.setTimeout(() => {
      setOpen(true);
      trackNewsletter("view", pathname);
    }, 2200);
    return () => window.clearTimeout(t);
  }, [pathname]);

  const dismiss = () => {
    setOpen(false);
    trackNewsletter("dismiss", pathname);
    try {
      window.sessionStorage.setItem(STORAGE_KEY, "1");
    } catch {}
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (submitting) return;
    const parsed = EMAIL_SCHEMA.safeParse(email);
    if (!parsed.success) {
      toast({
        title: "Correo inválido",
        description: parsed.error.issues[0]?.message ?? "Revisa el formato.",
        variant: "destructive",
      });
      return;
    }
    setSubmitting(true);
    trackNewsletter("submit", pathname);
    try {
      const { data, error } = await supabase.functions.invoke("newsletter-subscribe", {
        body: { email: parsed.data, source_path: pathname, language: "es-MX" },
      });
      if (error) throw new Error(error.message ?? "No se pudo registrar");
      const status = (data as any)?.status ?? "pending_confirmation";
      trackCTAClick("newsletter_signup", pathname);
      trackNewsletter("success", pathname, { status });
      setDone(true);
      try {
        window.sessionStorage.setItem(STORAGE_KEY, "1");
      } catch {}
    } catch (err: any) {
      trackNewsletter("error", pathname, { message: err?.message ?? "unknown" });
      // Silent fail to UX — toast is enough
      toast({
        title: "No pudimos suscribirte",
        description: err?.message ?? "Intenta de nuevo en un momento.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!open || !ALLOWED_PATHS(pathname)) return null;

  return (
    <aside
      role="complementary"
      aria-label="Newsletter Gonzalo Acuña"
      className="fixed inset-x-3 bottom-3 z-[60] sm:inset-x-auto sm:bottom-5 sm:right-5 sm:max-w-[420px]"
    >
      <div className="relative overflow-hidden rounded-2xl border border-gold/40 bg-background/95 p-4 shadow-[0_20px_60px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-5">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-gold/10 via-transparent to-transparent" />
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar newsletter"
          className="absolute right-2 top-2 rounded-full p-1.5 text-white/55 transition-colors hover:bg-white/5 hover:text-white"
        >
          <X size={14} />
        </button>

        {done ? (
          <div className="relative flex items-start gap-3 pr-6">
            <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-gold" />
            <div>
              <p className="font-display text-base text-white">¡Listo! Te metimos a la lista.</p>
              <p className="mt-1 text-xs text-white/65">
                Revisa tu correo y haz clic en el link de confirmación. Sin ese clic no te llega nada (regla de doble opt-in). Si no lo ves en 3 min, revisa spam.
              </p>
            </div>
          </div>
        ) : collapsed ? (
          <button
            type="button"
            onClick={() => setCollapsed(false)}
            className="relative flex w-full items-center gap-3 pr-6 text-left"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
              <Mail size={15} />
            </span>
            <span className="flex-1">
              <span className="block text-[10px] uppercase tracking-[0.24em] text-gold">Newsletter</span>
              <span className="block text-sm text-white/85">Insights founder cada 2 semanas</span>
            </span>
          </button>
        ) : (
          <form onSubmit={onSubmit} className="relative pr-4">
            <div className="flex items-center gap-2">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gold/40 bg-gold/10 text-gold">
                <Mail size={13} />
              </span>
              <p className="text-[10px] uppercase tracking-[0.24em] text-gold">Newsletter Gonzalo</p>
            </div>
            <p className="mt-2 font-display text-base leading-snug text-white sm:text-lg">
              Lo que aprendo construyendo PropMatch, CALLII y Finple — directo a tu correo.
            </p>
            <p className="mt-1.5 text-xs leading-relaxed text-white/60">
              Un email cada 2 semanas con frameworks reales de PropTech, IA y levantamiento de capital en LATAM. Sin humo, sin spam.
            </p>
            <div className="mt-3 flex flex-col gap-2 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Tu correo
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                inputMode="email"
                required
                maxLength={200}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="flex-1 rounded-full border border-white/15 bg-background/80 px-4 py-2.5 text-sm text-white placeholder:text-white/35 focus:border-gold/60 focus:outline-none"
              />
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background transition hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] disabled:opacity-60"
              >
                {submitting && <Loader2 size={12} className="animate-spin" />}
                {submitting ? "Enviando" : "Suscribirme"}
              </button>
            </div>
            <button
              type="button"
              onClick={() => setCollapsed(true)}
              className="mt-2 text-[10px] uppercase tracking-[0.22em] text-white/40 hover:text-white/70"
            >
              Minimizar
            </button>
          </form>
        )}
      </div>
    </aside>
  );
};