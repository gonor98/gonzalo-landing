import { type LucideIcon, GraduationCap, Sparkles, Calendar } from "lucide-react";

/**
 * Benefits catalog — umbrella for events, free materials, premium platform
 * access and perks. To add a new event (CETI-style), append a new entry here.
 * Each entry can link to its own landing page (e.g. /bonus-ceti) and a
 * downloads/share page (e.g. /bonus-ceti-descargas).
 */

export type BenefitStatus = "active" | "upcoming" | "archived";

export type BenefitEntry = {
  id: string;
  kind: "event" | "platform" | "perk";
  status: BenefitStatus;
  badge: string;
  title: string;
  description: string;
  date?: string;
  location?: string;
  landingPath?: string;
  downloadsPath?: string;
  externalUrl?: string;
  icon: LucideIcon;
  highlights?: string[];
};

export const BENEFITS: BenefitEntry[] = [
  {
    id: "ceti-2026",
    kind: "event",
    status: "active",
    badge: "Conferencia CETI · 2026",
    title: "95 Rechazos — Bonus CETI",
    description:
      "Material completo de la conferencia: video, slides, guía de inicio (finanzas, IA práctica, mentalidad founder) y acceso a beneficios para estudiantes.",
    date: "Mayo 2026",
    location: "CETI · Guadalajara",
    landingPath: "/bonus-ceti",
    downloadsPath: "/bonus-ceti-descargas",
    icon: GraduationCap,
    highlights: [
      "Video completo de la conferencia",
      "Slides 95 Rechazos (PDF)",
      "Guía de inicio para estudiantes (PDF)",
      "Acceso al beneficio Finple",
    ],
  },
];

export const getActiveEventBenefits = () =>
  BENEFITS.filter((b) => b.kind === "event" && b.status === "active");

export const getUpcomingBenefits = () =>
  BENEFITS.filter((b) => b.status === "upcoming");

export { Calendar, Sparkles };