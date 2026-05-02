import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Download, ExternalLink } from "lucide-react";
import { trackDownload } from "@/lib/track";

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
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
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
                  onClick={onClose}
                  aria-label="Cerrar vista previa"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
                >
                  <X size={15} />
                </button>
              </div>
            </header>
            <div className="relative flex-1 bg-black/40">
              <object data={`${src}#view=FitH`} type="application/pdf" className="h-full w-full">
                <iframe
                  src={`${src}#view=FitH`}
                  title={title}
                  className="h-full w-full"
                />
                <div className="flex h-full flex-col items-center justify-center gap-3 p-6 text-center">
                  <p className="text-sm text-white/70">
                    Tu navegador no puede mostrar el PDF embebido.
                  </p>
                  <a
                    href={src}
                    download={filename}
                    onClick={() => trackDownload(filename, location, "download")}
                    className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background"
                  >
                    <Download size={13} /> Descargar PDF
                  </a>
                </div>
              </object>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};