import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";
import { trackDownload } from "@/lib/track";
import { useIsMobile } from "@/hooks/use-mobile";

interface PDFPreviewModalProps {
  open: boolean;
  onClose: () => void;
  src: string;
  filename: string;
  title: string;
  trackId: string;
  location?: string;
}

export const PDFPreviewModal = ({
  open,
  onClose,
  src,
  filename,
  title,
  trackId,
  location = "bonus_ceti",
}: PDFPreviewModalProps) => {
  const isMobile = useIsMobile();
  const dialogRef = useRef<HTMLDivElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const lastFocused = useRef<HTMLElement | null>(null);
  const [embedFailed, setEmbedFailed] = useState(false);

  useEffect(() => {
    if (!open) return;
    setEmbedFailed(false);
    // Detect failure to load embed (object onError is unreliable — use timeout heuristic on mobile only)
    if (isMobile) {
      const t = setTimeout(() => setEmbedFailed(true), 2500);
      return () => clearTimeout(t);
    }
  }, [open, src, isMobile]);

  useEffect(() => {
    if (!open) return;
    lastFocused.current = document.activeElement as HTMLElement | null;
    // Move focus into dialog
    requestAnimationFrame(() => closeBtnRef.current?.focus());

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
        );
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
      lastFocused.current?.focus?.();
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md sm:p-8"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label={`Vista previa: ${title}`}
        >
          <motion.div
            ref={dialogRef}
            initial={{ y: 24, scale: 0.98, opacity: 0 }}
            animate={{ y: 0, scale: 1, opacity: 1 }}
            exit={{ y: 12, scale: 0.98, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex h-[88vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-white/10 bg-background shadow-[0_30px_120px_-20px_rgba(201,168,76,0.4)]"
          >
            <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-background/80 px-5 py-3 backdrop-blur">
              <div className="min-w-0">
                <p className="text-[10px] uppercase tracking-[0.28em] text-gold/80">Vista previa</p>
                <h3 className="truncate font-display text-base text-white sm:text-lg">{title}</h3>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={src}
                  download={filename}
                  onClick={() => trackDownload(filename, location, "download")}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-2 text-[11px] uppercase tracking-[0.2em] text-background transition-all hover:shadow-[0_0_24px_rgba(201,168,76,0.55)]"
                >
                  <Download size={13} /> Descargar
                </a>
                <a
                  href={src}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackDownload(filename, location, "preview")}
                  aria-label="Abrir en nueva pestaña"
                  className="hidden h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-gold/40 hover:text-gold sm:inline-flex"
                >
                  <ExternalLink size={14} />
                </a>
                <button
                  ref={closeBtnRef}
                  onClick={onClose}
                  aria-label="Cerrar vista previa"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <X size={15} />
                </button>
              </div>
            </header>
            <div className="relative flex-1 bg-black/40">
              {isMobile && embedFailed ? (
                <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                  <p className="text-sm text-white/70">
                    Para una mejor experiencia en móvil, abre el PDF en una nueva pestaña o descárgalo.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <a
                      href={src}
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => trackDownload(filename, location, "preview")}
                      className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/85"
                    >
                      <ExternalLink size={13} /> Abrir PDF
                    </a>
                    <a
                      href={src}
                      download={filename}
                      onClick={() => trackDownload(filename, location, "download")}
                      className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background"
                    >
                      <Download size={13} /> Descargar PDF
                    </a>
                  </div>
                </div>
              ) : (
                <object
                  data={`${src}#view=FitH&toolbar=1`}
                  type="application/pdf"
                  className="h-full w-full"
                  onError={() => setEmbedFailed(true)}
                >
                  <div className="flex h-full flex-col items-center justify-center gap-4 p-8 text-center">
                    <p className="text-sm text-white/70">
                      Tu navegador no puede mostrar el PDF embebido.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                      <a
                        href={src}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackDownload(filename, location, "preview")}
                        className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-white/85"
                      >
                        <ExternalLink size={13} /> Abrir en nueva pestaña
                      </a>
                      <a
                        href={src}
                        download={filename}
                        onClick={() => trackDownload(filename, location, "download")}
                        className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background"
                      >
                        <Download size={13} /> Descargar PDF
                      </a>
                    </div>
                  </div>
                </object>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};