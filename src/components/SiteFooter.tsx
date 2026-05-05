import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { SOCIALS } from "@/lib/socials";
import { trackSocialClick } from "@/lib/track";

export const SiteFooter = () => {
  return (
    <footer className="relative border-t border-white/5 bg-background px-6 py-16 md:px-20">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
      <div className="mx-auto grid max-w-content gap-12 md:grid-cols-[1.2fr_1fr_1fr]">
        <div>
          <Link to="/" className="font-display text-base tracking-[0.18em] text-gold">
            GONZALO ACUÑA NAVA
          </Link>
          <p className="mt-4 max-w-sm text-sm leading-relaxed text-white/55">
            CEO de PropMatch · Speaker global de PropTech, IA Operativa y Liderazgo.
            Guadalajara, México.
          </p>
        </div>

        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-white/40">Conecta directo</p>
          <ul className="space-y-3">
            {SOCIALS.map(({ name, handle, href, icon: Icon, external }) => (
              <li key={name}>
                <a
                  href={href}
                  target={external ? "_blank" : undefined}
                  rel={external ? "noopener noreferrer" : undefined}
                  onClick={() => trackSocialClick(name, "footer")}
                  className="group inline-flex items-center gap-3 text-sm text-white/75 transition-colors hover:text-gold"
                >
                  <span className="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-white/[0.02] transition-all group-hover:border-gold/40 group-hover:bg-gold/10">
                    <Icon size={14} />
                  </span>
                  <span className="flex flex-col leading-tight">
                    <span className="text-[10px] uppercase tracking-[0.22em] text-white/40">{name}</span>
                    <span>{handle}</span>
                  </span>
                  <ArrowUpRight size={14} className="opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="mb-5 text-[11px] uppercase tracking-[0.28em] text-white/40">Navegación</p>
          <ul className="space-y-3 text-sm text-white/75">
            <li><Link to="/speaking" className="hover:text-gold">Speaking</Link></li>
            <li><Link to="/audit-os" className="hover:text-gold">Audit OS</Link></li>
            <li><Link to="/investors" className="hover:text-gold">Investors</Link></li>
            <li><Link to="/booking" className="hover:text-gold">Reservar Keynote</Link></li>
            <li><Link to="/benefits" className="hover:text-gold">Benefits</Link></li>
            <li><Link to="/bonus-ceti" className="hover:text-gold">Bonus CETI</Link></li>
            <li><Link to="/bonus-ceti-descargas" className="hover:text-gold">Descargas CETI</Link></li>
            <li><Link to="/blog" className="hover:text-gold">Blog</Link></li>
          </ul>
        </div>
      </div>

      <div className="mx-auto mt-12 flex max-w-content flex-col items-start justify-between gap-4 border-t border-white/5 pt-6 text-[11px] uppercase tracking-[0.24em] text-white/35 md:flex-row md:items-center">
        <span>© 2026 Gonzalo Acuña Nava</span>
        <span>Guadalajara · México</span>
      </div>
    </footer>
  );
};