import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles } from "lucide-react";
import { trackCTAClick } from "@/lib/track";

/**
 * Sticky high-ticket booking button.
 * - Hidden during the Hero (first 70vh).
 * - Fades in once the user scrolls below the fold.
 * - Subtle pulsing gold glow for urgency. Respects prefers-reduced-motion
 *   by falling back to a static glow.
 */
export const FloatingCTA = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY > window.innerHeight * 0.7);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.95 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="fixed bottom-6 right-6 z-[90] hidden sm:block"
        >
          <style>{`@keyframes floatingGlow{0%,100%{box-shadow:0 0 0 0 rgba(201,168,76,0.0),0 14px 40px -10px rgba(201,168,76,0.45)}50%{box-shadow:0 0 0 14px rgba(201,168,76,0.0),0 18px 50px -10px rgba(201,168,76,0.75)}}@media (prefers-reduced-motion: reduce){.floating-cta-pulse{animation:none!important}}`}</style>
          <Link
            to="/booking"
            onClick={() => trackCTAClick("floating_book_keynote", "floating_cta")}
            aria-label="Reservar keynote con Gonzalo Acuña"
            className="floating-cta-pulse group inline-flex items-center gap-2.5 rounded-full bg-gold px-5 py-3 text-[11px] uppercase tracking-[0.24em] text-background transition-transform hover:scale-[1.03] focus:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            style={{ animation: "floatingGlow 2.4s ease-in-out infinite" }}
          >
            <Sparkles size={14} />
            Reservar Keynote
          </Link>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default FloatingCTA;