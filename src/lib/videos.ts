import gonzaloAmericaDigital from "@/assets/gonzalo-america-digital.webp";

export type SpeakerVideo = {
  id: string;
  title: string;
  context: string;
  customThumbnail?: string;
};

export const videos: SpeakerVideo[] = [
  { id: "cmGTwjjw-kw", title: "Construyendo una Empresa de $162.5M desde Cero", context: "Founder · Inspirational" },
  { id: "IxpNirVNaeA", title: "Tokenización y Blockchain en Bienes Raíces", context: "PropTech & Web3" },
  { id: "ogxPivoX_78", title: "El Futuro del PropTech en Latinoamérica", context: "PropTech LATAM" },
  { id: "3j9FIxzT__A", title: "Cómo PropMatch Revoluciona la Inversión Inmobiliaria", context: "Producto" },
  { id: "dRUZS2rTe8Q", title: "Innovación PropTech y Transformación Inmobiliaria", context: "Keynote · America Digital", customThumbnail: gonzaloAmericaDigital },
];

export const thumb = (v: SpeakerVideo, size: "max" | "mq" = "max") =>
  v.customThumbnail || `https://img.youtube.com/vi/${v.id}/${size === "max" ? "maxresdefault" : "mqdefault"}.jpg`;

export const heroVideo = videos[0];