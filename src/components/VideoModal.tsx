import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

type Props = {
  videoId: string | null;
  title?: string;
  onClose: () => void;
};

export const VideoModal = ({ videoId, title, onClose }: Props) => {
  useEffect(() => {
    if (!videoId) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [videoId, onClose]);

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
        >
          <motion.button
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            onClick={onClose}
            aria-label="Cerrar video"
            className="absolute right-5 top-5 md:right-8 md:top-8 z-10 inline-flex h-12 w-12 items-center justify-center rounded-full border border-gold/40 bg-background/60 text-gold transition-all hover:bg-gold hover:text-background"
          >
            <X size={20} />
          </motion.button>

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 12 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-5xl"
          >
            {title && (
              <p className="mb-4 text-[11px] uppercase tracking-[0.32em] text-gold">
                {title}
              </p>
            )}
            <div className="relative aspect-video w-full overflow-hidden rounded-[16px] border border-gold/20 bg-black shadow-[0_30px_120px_-20px_rgba(201,168,76,0.35)]">
              <iframe
                src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                title={title || "Video"}
                className="absolute inset-0 h-full w-full"
                allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture; fullscreen"
                allowFullScreen
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};