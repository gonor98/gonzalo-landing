import { motion } from "framer-motion";
import { Headphones, Play, ArrowUpRight } from "lucide-react";
import { PODCASTS } from "@/lib/podcasts";
import { trackCTAClick } from "@/lib/track";

const SpotifyIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} {...props}>
    <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.5 17.34c-.22.36-.69.48-1.05.26-2.88-1.76-6.5-2.16-10.78-1.18-.41.09-.82-.16-.91-.57-.09-.41.16-.82.57-.91 4.66-1.07 8.66-.61 11.86 1.35.36.22.48.69.31 1.05zm1.47-3.27c-.28.45-.86.59-1.31.31-3.3-2.03-8.34-2.62-12.24-1.43-.5.15-1.02-.13-1.17-.62-.15-.5.13-1.02.62-1.17 4.46-1.36 9.99-.71 13.78 1.6.45.28.59.86.32 1.31zm.13-3.4C15.06 8.46 8.94 8.27 5.36 9.36c-.59.18-1.21-.16-1.39-.75-.18-.59.16-1.21.75-1.39 4.13-1.25 10.86-1.03 15.18 1.55.54.32.71 1.02.39 1.55-.32.54-1.02.71-1.55.39z" />
  </svg>
);

const ApplePodcastIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" width={14} height={14} {...props}>
    <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm0 4.6a3.4 3.4 0 110 6.8 3.4 3.4 0 010-6.8zm0 8.2c2.3 0 4.2 1.4 4.2 3.1 0 1.4-1.6 2.5-4.2 2.5s-4.2-1.1-4.2-2.5c0-1.7 1.9-3.1 4.2-3.1z" />
  </svg>
);

export const PodcastsSection = () => {
  return (
    <section
      id="podcasts"
      className="relative border-t border-white/5 bg-background px-6 py-24 md:px-20 md:py-32"
      aria-label="Podcasts y entrevistas"
    >
      <div className="mx-auto max-w-content">
        <div className="mb-14 flex flex-col items-start gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.28em] text-gold">
              <Headphones size={12} /> Podcasts & Entrevistas
            </p>
            <h2 className="font-display text-4xl leading-[1.05] text-white md:text-6xl">
              Conversaciones que <span className="text-gold">mueven mercados</span>.
            </h2>
            <p className="mt-4 max-w-xl text-sm text-white/60 md:text-base">
              Escucha a Gonzalo en los podcasts más relevantes de PropTech, IA y liderazgo en LATAM.
            </p>
          </div>
        </div>

        <ul className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {PODCASTS.map((ep, i) => (
            <motion.li
              key={ep.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: Math.min(i * 0.08, 0.3) }}
              className="group relative flex flex-col rounded-[18px] border border-white/10 bg-card/40 p-6 backdrop-blur transition-all hover:border-gold/40 hover:shadow-[0_0_50px_-20px_rgba(201,168,76,0.5)]"
            >
              <div className="flex items-center gap-3 text-[10px] uppercase tracking-[0.22em] text-white/40">
                <span className="text-gold">{ep.show}</span>
                <span>·</span>
                <time dateTime={ep.date}>
                  {new Date(ep.date).toLocaleDateString("es-MX", {
                    year: "numeric",
                    month: "short",
                  })}
                </time>
                <span>·</span>
                <span>{ep.duration}</span>
              </div>

              <h3 className="mt-4 font-display text-xl leading-snug text-white">{ep.title}</h3>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-white/60">{ep.summary}</p>

              <div className="mt-6 flex flex-wrap items-center gap-2">
                {ep.spotifyUrl && (
                  <a
                    href={ep.spotifyUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTAClick(`podcast_spotify_${ep.id}`, "podcasts")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    <SpotifyIcon /> Spotify
                  </a>
                )}
                {ep.appleUrl && (
                  <a
                    href={ep.appleUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTAClick(`podcast_apple_${ep.id}`, "podcasts")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    <ApplePodcastIcon /> Apple
                  </a>
                )}
                {ep.youtubeUrl && (
                  <a
                    href={ep.youtubeUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackCTAClick(`podcast_youtube_${ep.id}`, "podcasts")}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[10px] uppercase tracking-[0.18em] text-white/75 transition-colors hover:border-gold/40 hover:text-gold"
                  >
                    <Play size={11} /> YouTube
                  </a>
                )}
                <ArrowUpRight
                  size={14}
                  className="ml-auto text-white/30 transition-colors group-hover:text-gold"
                />
              </div>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
};