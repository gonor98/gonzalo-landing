import { useSyncExternalStore } from "react";
import { type LucideIcon, GraduationCap, Sparkles, Calendar, Star, Gift } from "lucide-react";

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
  /** Optional uploaded assets (Lovable Cloud Storage public URLs). */
  pdfUrl?: string;
  videoUrl?: string;
  thumbnailUrl?: string;
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

// ---------------------------------------------------------------------------
// Runtime overrides (admin CRUD)
// ---------------------------------------------------------------------------
const LS_BENEFITS = "benefits_overrides_v1";
const EVT = "benefits-overrides-changed";

export type BenefitOverride = Omit<BenefitEntry, "icon"> & { iconKey?: string };
export type BenefitsBundle = {
  edits?: Record<string, Partial<BenefitOverride>>;
  added?: BenefitOverride[];
  removed?: string[];
};

export const ICONS: Record<string, LucideIcon> = {
  GraduationCap, Sparkles, Calendar, Star, Gift,
};

const safeParse = <T,>(raw: string | null, fb: T): T => {
  if (!raw) return fb;
  try { return JSON.parse(raw) as T; } catch { return fb; }
};

export const readBenefitsBundle = (): BenefitsBundle =>
  typeof window === "undefined" ? {} : safeParse(localStorage.getItem(LS_BENEFITS), {} as BenefitsBundle);

export const writeBenefitsBundle = (b: BenefitsBundle) => {
  localStorage.setItem(LS_BENEFITS, JSON.stringify(b));
  window.dispatchEvent(new Event(EVT));
};

export const resetBenefits = () => {
  localStorage.removeItem(LS_BENEFITS);
  window.dispatchEvent(new Event(EVT));
};

const subscribe = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => { window.removeEventListener(EVT, cb); window.removeEventListener("storage", cb); };
};

const applyBundle = (bundle: BenefitsBundle): BenefitEntry[] => {
  const removed = new Set(bundle.removed ?? []);
  const edits = bundle.edits ?? {};
  const base = BENEFITS.filter((b) => !removed.has(b.id)).map((b) => {
    const e = edits[b.id];
    if (!e) return b;
    const { iconKey, ...rest } = e as BenefitOverride & { iconKey?: string };
    return { ...b, ...rest, icon: iconKey && ICONS[iconKey] ? ICONS[iconKey] : b.icon };
  });
  const added = (bundle.added ?? []).map((a) => ({
    ...a, icon: (a.iconKey && ICONS[a.iconKey]) || GraduationCap,
  })) as BenefitEntry[];
  return [...base, ...added];
};

export const useBenefits = (): BenefitEntry[] => {
  const raw = useSyncExternalStore(
    subscribe,
    () => (typeof window === "undefined" ? "" : localStorage.getItem(LS_BENEFITS) ?? ""),
    () => "",
  );
  const bundle = safeParse<BenefitsBundle>(raw || null, {});
  return applyBundle(bundle);
};

export const exportBenefits = (): BenefitsBundle => readBenefitsBundle();
export const importBenefits = (b: BenefitsBundle) => writeBenefitsBundle(b);

/** Used by build-time validator: list of all asset paths referenced. */
export const collectBenefitAssetPaths = (entries: BenefitEntry[] = BENEFITS): string[] => {
  const out = new Set<string>();
  entries.forEach((b) => {
    [b.landingPath, b.downloadsPath].forEach((p) => {
      // landingPath/downloadsPath are app routes, not files — skip
    });
  });
  return Array.from(out);
};