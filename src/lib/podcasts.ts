export type PodcastEpisode = {
  id: string;
  title: string;
  show: string;
  date: string; // ISO
  duration: string; // e.g. "48:12"
  summary: string;
  cover?: string;
  spotifyUrl?: string;
  appleUrl?: string;
  youtubeUrl?: string;
};

// Placeholders — reemplazar con episodios reales cuando estén disponibles.
export const PODCASTS: PodcastEpisode[] = [
  {
    id: "ep-01",
    title: "Construir un ecosistema PropTech de $200M desde Guadalajara",
    show: "Cracks Podcast",
    date: "2026-02-14",
    duration: "01:12:40",
    summary:
      "Cómo PropMatch, CALLII y Finple se conectan para tokenizar el real estate latinoamericano bajo ERC-3643.",
    spotifyUrl: "https://open.spotify.com/",
    appleUrl: "https://podcasts.apple.com/",
    youtubeUrl: "https://youtube.com/",
  },
  {
    id: "ep-02",
    title: "95 Rechazos al Éxito: la disciplina del fundador resiliente",
    show: "Founders Stories LATAM",
    date: "2026-01-20",
    duration: "54:08",
    summary:
      "El método detrás del libro: cómo convertir cada NO en data accionable para iterar tracción y cap table.",
    spotifyUrl: "https://open.spotify.com/",
    appleUrl: "https://podcasts.apple.com/",
  },
  {
    id: "ep-03",
    title: "IA Operativa: el playbook para escalar sin quemar runway",
    show: "Tech Leaders MX",
    date: "2025-11-09",
    duration: "47:55",
    summary:
      "Agentes, automatización de back-office y la arquitectura de CALLII aplicada a operaciones reales.",
    spotifyUrl: "https://open.spotify.com/",
    youtubeUrl: "https://youtube.com/",
  },
];