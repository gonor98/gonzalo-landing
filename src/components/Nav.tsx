import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { SOCIALS } from "@/lib/socials";
import { trackCTAClick, trackSocialClick } from "@/lib/track";

const links = [
  { label: "Inicio", to: "/" },
  { label: "Speaking", to: "/speaking" },
  { label: "Audit OS", to: "/audit-os" },
  { label: "Investors", to: "/investors" },
  { label: "Blog", to: "/blog" },
  { label: "Prensa", to: "/prensa" },
];

export const Nav = () => {
  const [hidden, setHidden] = useState(false);
  const [open, setOpen] = useState(false);
  const [lastY, setLastY] = useState(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setHidden(y > 100 && y > lastY);
      setLastY(y);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [lastY]);

  return (
    <motion.header
      initial={{ y: 0 }}
      animate={{ y: hidden ? -100 : 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-[80] backdrop-blur-xl bg-background/60 border-b border-white/5"
    >
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-5 md:px-20">
        <Link to="/" className="font-display text-base md:text-lg tracking-[0.18em] text-gold">
          GONZALO ACUÑA NAVA
        </Link>
        <ul className="hidden items-center gap-10 md:flex">
          {links.map((l) => {
            const active = pathname === l.to;
            return (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className={`text-[13px] uppercase tracking-[0.18em] transition-colors ${
                    active ? "text-gold" : "text-white/70 hover:text-gold"
                  }`}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              to="/booking"
              onClick={() => trackCTAClick("reservar_keynote", "nav_desktop")}
              className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-2.5 text-[11px] uppercase tracking-[0.22em] text-background transition-all hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
            >
              <Sparkles size={12} /> Reservar Keynote
            </Link>
          </li>
        </ul>
        <button
          aria-label="Menú"
          onClick={() => setOpen((v) => !v)}
          className="md:hidden text-white"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden overflow-hidden border-t border-white/5 bg-background/95"
          >
            <ul className="flex flex-col gap-1 px-6 py-6">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    onClick={() => setOpen(false)}
                    to={l.to}
                    className="block py-3 text-sm uppercase tracking-[0.2em] text-white/80 hover:text-gold"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
              <li className="mt-4">
                <Link
                  to="/booking"
                  onClick={() => {
                    trackCTAClick("reservar_keynote", "nav_mobile");
                    setOpen(false);
                  }}
                  className="inline-flex items-center gap-2 rounded-full bg-gold px-5 py-3 text-[11px] uppercase tracking-[0.22em] text-background"
                >
                  <Sparkles size={12} /> Reservar Keynote
                </Link>
              </li>
              <li className="mt-6 border-t border-white/5 pt-5">
                <p className="mb-3 text-[10px] uppercase tracking-[0.28em] text-white/40">Conecta directo</p>
                <div className="flex flex-wrap gap-2">
                  {SOCIALS.map(({ name, href, icon: Icon, external }) => (
                    <a
                      key={name}
                      href={href}
                      target={external ? "_blank" : undefined}
                      rel={external ? "noopener noreferrer" : undefined}
                      onClick={() => {
                        trackSocialClick(name, "nav_mobile");
                        setOpen(false);
                      }}
                      aria-label={name}
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/70 transition-colors hover:border-gold/40 hover:text-gold"
                    >
                      <Icon size={15} />
                    </a>
                  ))}
                </div>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
};
