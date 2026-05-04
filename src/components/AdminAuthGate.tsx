import { useState } from "react";
import { Mail, LogIn, Loader2, Shield, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable";
import { useAdminAuth } from "@/hooks/useAdminAuth";

const inputCls =
  "w-full rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none";

export const AdminAuthGate = ({ children }: { children: React.ReactNode }) => {
  const { loading, session, isAdmin, refresh } = useAdminAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-white/60">
        <Loader2 className="animate-spin" size={20} />
      </div>
    );
  }

  if (session && isAdmin) {
    return (
      <>
        <div className="fixed right-4 top-4 z-50 flex items-center gap-2 rounded-full border border-gold/30 bg-background/80 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] text-gold backdrop-blur">
          <Shield size={12} /> Admin · {session.user.email}
          <button
            onClick={async () => { await supabase.auth.signOut(); }}
            className="ml-2 inline-flex items-center gap-1 text-white/60 hover:text-gold"
            aria-label="Cerrar sesión"
          >
            <LogOut size={11} /> Salir
          </button>
        </div>
        {children}
      </>
    );
  }

  const onPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true); setMsg(null);
    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email, password,
          options: { emailRedirectTo: `${window.location.origin}/bonus-ceti-admin` },
        });
        if (error) throw error;
        setMsg("Cuenta creada. Revisa tu correo para confirmar y luego pide acceso admin.");
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        await refresh();
      }
    } catch (err) {
      setMsg(err instanceof Error ? err.message : "Error de autenticación");
    } finally { setBusy(false); }
  };

  const onGoogle = async () => {
    setBusy(true); setMsg(null);
    try {
      const r = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.href });
      if (r.error) setMsg(r.error.message ?? "No se pudo iniciar sesión con Google");
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Error con Google");
    } finally { setBusy(false); }
  };

  return (
    <main className="relative flex min-h-screen items-center justify-center bg-background px-6 py-24 text-foreground">
      <div className="aurora absolute inset-0 -z-10 opacity-50" />
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/[0.02] p-8 backdrop-blur">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-gold/30 bg-gold/10 text-gold">
            <Shield size={20} />
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">Acceso restringido</p>
            <h1 className="font-display text-2xl text-white">Admin · Bonus CETI</h1>
          </div>
        </div>

        {session && !isAdmin ? (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-sm text-amber-100">
            <p>Sesión iniciada como <b>{session.user.email}</b>, pero tu cuenta no tiene rol <code>admin</code>.</p>
            <p className="mt-2 text-amber-100/80">
              Pide al administrador que ejecute en la base de datos:
              <br />
              <code className="block mt-2 rounded bg-black/30 p-2 text-[11px]">
                INSERT INTO user_roles(user_id, role) VALUES ('{session.user.id}', 'admin');
              </code>
            </p>
            <button
              onClick={async () => { await supabase.auth.signOut(); }}
              className="mt-3 inline-flex items-center gap-2 rounded-full border border-white/15 px-3 py-1.5 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold"
            >
              <LogOut size={11} /> Cerrar sesión
            </button>
          </div>
        ) : (
          <>
            <button
              type="button"
              onClick={onGoogle}
              disabled={busy}
              className="mb-4 flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-5 py-2.5 text-sm text-white hover:border-gold/40 hover:text-gold disabled:opacity-50"
            >
              <LogIn size={14} /> Continuar con Google
            </button>
            <div className="my-4 flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
              <span className="h-px flex-1 bg-white/10" />o<span className="h-px flex-1 bg-white/10" />
            </div>
            <form onSubmit={onPasswordSubmit} className="flex flex-col gap-3">
              <input className={inputCls} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
              <input className={inputCls} type="password" placeholder="Contraseña" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.24em] text-background hover:shadow-[0_0_30px_rgba(201,168,76,0.5)] disabled:opacity-50"
              >
                <Mail size={13} /> {mode === "signup" ? "Crear cuenta" : "Entrar"}
              </button>
              <button
                type="button"
                onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
                className="text-[11px] uppercase tracking-[0.22em] text-white/50 hover:text-gold"
              >
                {mode === "signin" ? "¿Sin cuenta? Crear una" : "Ya tengo cuenta"}
              </button>
            </form>
          </>
        )}
        {msg && <p className="mt-4 text-xs text-white/60">{msg}</p>}
      </div>
    </main>
  );
};