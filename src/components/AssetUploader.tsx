import { useRef, useState } from "react";
import { Upload, Check, AlertTriangle, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const BUCKET = "benefits-assets";

export type AssetUploaderProps = {
  /** Current value (path or full URL). */
  value: string;
  onChange: (urlOrPath: string) => void;
  /** "pdf" | "video" | "image" — used for accept + folder. */
  kind: "pdf" | "video" | "image";
  /** Optional folder prefix, e.g. "benefits/ceti-2026". */
  folder?: string;
  label?: string;
  placeholder?: string;
};

const ACCEPT: Record<AssetUploaderProps["kind"], string> = {
  pdf: "application/pdf",
  video: "video/mp4,video/webm,video/quicktime",
  image: "image/png,image/jpeg,image/webp",
};

/**
 * Reusable asset uploader for Benefits admin.
 * - Uploads to public bucket `benefits-assets` (admin-only via RLS).
 * - Returns the public URL via onChange.
 * - Validates that an entered URL/path is reachable (HEAD).
 */
export const AssetUploader = ({
  value, onChange, kind, folder = "uploads", label, placeholder,
}: AssetUploaderProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [status, setStatus] = useState<{ ok: boolean; msg: string } | null>(null);

  const upload = async (file: File) => {
    setBusy(true); setStatus(null);
    try {
      const ext = file.name.split(".").pop() ?? "bin";
      const key = `${folder.replace(/^\/+|\/+$/g, "")}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext}`;
      const { error } = await supabase.storage.from(BUCKET).upload(key, file, {
        cacheControl: "3600", upsert: false, contentType: file.type,
      });
      if (error) throw error;
      const { data } = supabase.storage.from(BUCKET).getPublicUrl(key);
      onChange(data.publicUrl);
      setStatus({ ok: true, msg: `Subido (${(file.size / 1024).toFixed(0)} KB)` });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Error al subir" });
    } finally {
      setBusy(false);
    }
  };

  const validate = async () => {
    if (!value) { setStatus({ ok: false, msg: "Sin valor" }); return; }
    const url = /^https?:/.test(value) ? value : `${window.location.origin}${value.startsWith("/") ? "" : "/"}${value}`;
    setBusy(true);
    try {
      const r = await fetch(url, { method: "HEAD" });
      setStatus({ ok: r.ok, msg: r.ok ? `OK · ${r.status}` : `No accesible · ${r.status}` });
    } catch (e) {
      setStatus({ ok: false, msg: e instanceof Error ? e.message : "Error de red" });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      {label && <span className="mb-1.5 block text-[10px] uppercase tracking-[0.22em] text-white/45">{label}</span>}
      <div className="flex flex-wrap gap-2">
        <input
          className="flex-1 min-w-[220px] rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2 text-sm text-white placeholder:text-white/30 focus:border-gold/50 focus:outline-none"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder ?? "/archivo.pdf o https://..."}
        />
        <button
          type="button"
          onClick={() => ref.current?.click()}
          disabled={busy}
          className="inline-flex items-center gap-2 rounded-lg border border-gold/40 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-gold hover:bg-gold/10 disabled:opacity-50"
        >
          <Upload size={12} /> {busy ? "..." : "Subir"}
        </button>
        <button
          type="button"
          onClick={validate}
          disabled={busy || !value}
          className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/75 hover:border-gold/40 hover:text-gold disabled:opacity-50"
        >
          Validar
        </button>
        {value && (
          <a
            href={value.startsWith("http") ? value : value}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 rounded-lg border border-white/15 px-3 py-2 text-[11px] uppercase tracking-[0.22em] text-white/55 hover:text-gold"
          >
            <ExternalLink size={11} />
          </a>
        )}
        <input
          ref={ref} type="file" accept={ACCEPT[kind]} hidden
          onChange={(e) => { const f = e.target.files?.[0]; if (f) upload(f); e.target.value = ""; }}
        />
      </div>
      {status && (
        <p className={`mt-2 inline-flex items-center gap-1.5 text-[11px] ${status.ok ? "text-emerald-400" : "text-amber-400"}`}>
          {status.ok ? <Check size={11} /> : <AlertTriangle size={11} />} {status.msg}
        </p>
      )}
    </div>
  );
};