import { AnimatePresence, motion } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { posterFor } from "@/lib/videos";

type Props = {
  videoId: string | null;
  title?: string;
  poster?: string;
  onClose: () => void;
};

export const VideoModal = ({ videoId, title, poster, onClose }: Props) => {
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  // Reset state on each open
  useEffect(() => {
    if (videoId) {
      setLoading(true);
      setError(false);
    }
  }, [videoId]);

  // Body lock + keyboard (Esc + Tab focus trap) + initial focus
  useEffect(() => {
    if (!videoId) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";

    // Defer to ensure node is mounted
    const focusTimer = window.setTimeout(() => closeBtnRef.current?.focus(), 50);

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      if (e.key === "Tab" && dialogRef.current) {
        const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), iframe, [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
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
    window.addEventListener("keydown", onKey);

    // Error fallback: if iframe never loads in 8s, show error
    const errorTimer = window.setTimeout(() => {
      setLoading((l) => {
        if (l) setError(true);
        return l;
      });
    }, 8000);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
      window.clearTimeout(focusTimer);
      window.clearTimeout(errorTimer);
      previouslyFocused?.focus?.();
    };
  }, [videoId, onClose]);

  const posterSrc = videoId ? posterFor(videoId, poster) : "";

  return (
    <AnimatePresence>
      {videoId && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[120] flex items-center justify-center bg-background/90 backdrop-blur-md p-4 md:p-10"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-labelledby="video-modal-title"
          aria-describedby="video-modal-desc"
        >
          <button
            ref={closeBtnRef}
            onClick={onClose}
            aria-label="Cerrar reproductor de video"
            className="absolute right-5 top-5 md:right-8 md:top-8 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-background/60 text-gold transition-all hover:bg-gold hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
          >
            <X size={20} aria-hidden="true" />
          </button>

          <motion.div
            ref={dialogRef}
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl"
          >
            {title && (
              <p
                id="video-modal-title"
                className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold"
              >
                {title}
              </p>
            )}
            <p id="video-modal-desc" className="sr-only">
              Reproductor de video. Pulsa Escape para cerrar.
            </p>

            <div className="relative aspect-video w-full overflow-hidden rounded-[16px] border border-gold/20 bg-black shadow-[0_30px_120px_-20px_rgba(201,168,76,0.35)]">
              {/* Poster as background while loading */}
              {posterSrc && (loading || error) && (
                <img
                  src={posterSrc}
                  alt=""
                  className="absolute inset-0 h-full w-full object-cover opacity-40"
                />
              )}

              {/* Skeleton loader */}
              {loading && !error && (
                <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                  <div className="absolute inset-0 bg-gradient-to-br from-background/60 via-background/30 to-background/60 animate-pulse" />
                  <div className="relative z-10 flex flex-col items-center gap-3">
                    <div className="h-14 w-14 rounded-full border-2 border-gold/30 border-t-gold animate-spin" />
                    <p className="text-[10px] uppercase tracking-[0.32em] text-gold/70">
                      Cargando video…
                    </p>
                  </div>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 bg-background/80 p-8 text-center">
                  <AlertTriangle className="h-10 w-10 text-gold" aria-hidden="true" />
                  <p className="font-display text-xl text-white">No pudimos cargar el video</p>
                  <p className="max-w-sm text-sm text-white/60">
                    El video puede no estar disponible o tu conexión es inestable. Intenta abrirlo
                    directamente en YouTube.
                  </p>
                  <a
                    href={`https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2 inline-flex items-center gap-2 rounded-full border border-gold px-5 py-2 text-xs uppercase tracking-[0.22em] text-gold transition-all hover:bg-gold hover:text-background focus:outline-none focus-visible:ring-2 focus-visible:ring-gold"
                  >
                    Abrir en YouTube
                  </a>
                </div>
              )}

              {!error && (
                <iframe
                  key={videoId}
                  src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                  title={title || "Video de Gonzalo Acuña Nava"}
                  className="absolute inset-0 h-full w-full"
                  allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                  allowFullScreen
                  onLoad={() => setLoading(false)}
                  onError={() => {
                    setLoading(false);
                    setError(true);
                  }}
                />
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
