import gonzaloAmericaDigital from "@/assets/gonzalo-america-digital.webp";
import stage from "@/assets/gonzalo-talentland-stage.jpg";
import propTech from "@/assets/gonzalo-proptech-latam.webp";
import speaking from "@/assets/gonzalo-talentland-speaking.jpg";
import panel from "@/assets/gonzalo-talentland-panel.jpg";
import bbva from "@/assets/gonzalo-bbva-spark.webp";
import interview from "@/assets/gonzalo-talentland-interview.jpg";
import presenting from "@/assets/gonzalo-talentland-presenting.jpg";
import propmatch from "@/assets/propmatch-app-mockup.webp";

export type SpeakerVideo = {
  id: string;
  title: string;
  context: string;
  poster: string;
};

export const videos: SpeakerVideo[] = [
  { id: "cmGTwjjw-kw", title: "Construyendo una Empresa de $162.5M desde Cero", context: "Founder · Inspirational", poster: stage },
  { id: "IxpNirVNaeA", title: "Tokenización y Blockchain en Bienes Raíces", context: "PropTech & Web3", poster: propTech },
  { id: "ogxPivoX_78", title: "El Futuro del PropTech en Latinoamérica", context: "PropTech LATAM", poster: presenting },
  { id: "3j9FIxzT__A", title: "Cómo PropMatch Revoluciona la Inversión Inmobiliaria", context: "Producto", poster: propmatch },
  { id: "dRUZS2rTe8Q", title: "Innovación PropTech y Transformación Inmobiliaria", context: "Keynote · America Digital", poster: gonzaloAmericaDigital },
];

const fallbackById: Record<string, string> = {
  "cmGTwjjw-kw": stage,
  "IxpNirVNaeA": propTech,
  "ogxPivoX_78": panel,
  "3j9FIxzT__A": propmatch,
  "dRUZS2rTe8Q": gonzaloAmericaDigital,
  "kJQP7kiw5Fk": bbva,
};

export const posterFor = (id: string, fallback?: string) =>
  fallback || fallbackById[id] || `https://img.youtube.com/vi/${id}/maxresdefault.jpg`;

export const thumb = (v: SpeakerVideo, _size: "max" | "mq" = "max") => v.poster;

export const heroVideo = videos[0];
