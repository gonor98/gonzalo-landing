import { Map, Presentation, type LucideIcon } from "lucide-react";

export type BonusMaterial = {
  id: string;
  tag: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  filename: string;
  trackId: string;
  icon: LucideIcon;
};

export const BONUS_MATERIALS: BonusMaterial[] = [
  {
    id: "guia",
    tag: "Bonus Guía",
    title: "Tu Mapa de Inicio (Bonus Guía)",
    description:
      "Finanzas personales, IA práctica, mentalidad founder y red de contactos. Sin teoría vacía, solo herramientas reales para estudiantes de 17 a 29 años.",
    cta: "Descargar Guía (PDF)",
    href: "/bonus-guia-estudiante-ceti.pdf",
    filename: "bonus-guia-estudiante-ceti.pdf",
    trackId: "descarga_guia_ceti",
    icon: Map,
  },
  {
    id: "slides",
    tag: "Slides Conferencia",
    title: "95 Rechazos (Slides de Conferencia)",
    description:
      "Cómo pasar de lavar autos a liderar PropMatch, CALLII y Finple. El mapa de acción y las notas completas de la conferencia.",
    cta: "Descargar Presentación (PDF)",
    href: "/conferencia-ceti-gonzalo.pdf",
    filename: "conferencia-ceti-gonzalo.pdf",
    trackId: "descarga_slides_ceti",
    icon: Presentation,
  },
];

// Conference video — set when ready (YouTube/Vimeo embed URL or local /videos/foo.mp4)
// Example YouTube: "https://www.youtube.com/embed/VIDEO_ID"
export const CONFERENCE_VIDEO: {
  url: string | null;
  provider: "youtube" | "vimeo" | "file" | null;
  title: string;
  poster?: string;
} = {
  url: null,
  provider: null,
  title: "Conferencia CETI — 95 Rechazos · Gonzalo Acuña Nava",
};

export const FINPLE_URL = "https://gonzaloacuna.com/ceti";