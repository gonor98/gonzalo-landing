import { motion } from "framer-motion";
import { SOCIALS } from "@/lib/socials";

export const SocialRail = () => {
  return (
    <motion.aside
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.4, ease: "easeOut" }}
      className="fixed left-4 top-1/2 z-[70] hidden -translate-y-1/2 lg:block"
      aria-label="Redes sociales"
    >
      <ul className="flex flex-col items-center gap-3 rounded-full border border-white/10 bg-background/40 px-2 py-4 backdrop-blur-xl">
        {SOCIALS.map(({ name, href, icon: Icon, external }) => (
          <li key={name}>
            <a
              href={href}
              target={external ? "_blank" : undefined}
              rel={external ? "noopener noreferrer" : undefined}
              aria-label={name}
              title={name}
              className="group relative flex h-10 w-10 items-center justify-center rounded-full text-white/60 transition-all hover:text-gold hover:bg-gold/10 hover:shadow-[0_0_20px_rgba(201,168,76,0.35)]"
            >
              <Icon size={16} />
              <span className="pointer-events-none absolute left-full ml-3 whitespace-nowrap rounded-md border border-white/10 bg-background/90 px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] text-white/80 opacity-0 transition-opacity group-hover:opacity-100">
                {name}
              </span>
            </a>
          </li>
        ))}
        <li className="mt-1 h-8 w-px bg-gradient-to-b from-transparent via-gold/40 to-transparent" />
      </ul>
    </motion.aside>
  );
};