import { useSyncExternalStore } from "react";
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

// Hero loop video (muted, autoplay) — shown in the homepage hero.
// Default uses one of Gonzalo's existing keynote videos. Override via admin.
export const HERO_LOOP_VIDEO: {
  provider: "youtube" | "vimeo" | "file";
  // For YouTube: just the videoId. For Vimeo: just the numeric id. For file: full URL.
  source: string;
  title: string;
} = {
  provider: "youtube",
  source: "cmGTwjjw-kw",
  title: "Gonzalo Acuña Nava — Conferencia en vivo",
};

// ---------------------------------------------------------------------------
// Runtime overrides (localStorage) — powers the /bonus-ceti-admin panel.
// Defaults above stay as the canonical source. Admin edits override at runtime
// without redeploying. Cleared by clicking "Restablecer" in admin.
// ---------------------------------------------------------------------------

const LS_MATERIALS = "bonus_materials_overrides_v1";
const LS_VIDEO = "conference_video_override_v1";
const LS_HERO = "hero_loop_video_override_v1";
const EVT = "bonus-overrides-changed";

type MaterialOverride = Partial<Pick<BonusMaterial, "title" | "description" | "cta" | "href" | "filename" | "tag">>;
type MaterialsOverrides = Record<string, MaterialOverride>;
type VideoOverride = Partial<typeof CONFERENCE_VIDEO>;
type HeroOverride = Partial<typeof HERO_LOOP_VIDEO>;

const safeParse = <T,>(raw: string | null, fallback: T): T => {
  if (!raw) return fallback;
  try { return JSON.parse(raw) as T; } catch { return fallback; }
};

export const readMaterialsOverrides = (): MaterialsOverrides =>
  typeof window === "undefined" ? {} : safeParse(localStorage.getItem(LS_MATERIALS), {} as MaterialsOverrides);

export const readVideoOverride = (): VideoOverride =>
  typeof window === "undefined" ? {} : safeParse(localStorage.getItem(LS_VIDEO), {} as VideoOverride);

export const readHeroOverride = (): HeroOverride =>
  typeof window === "undefined" ? {} : safeParse(localStorage.getItem(LS_HERO), {} as HeroOverride);

export const writeMaterialsOverrides = (next: MaterialsOverrides) => {
  localStorage.setItem(LS_MATERIALS, JSON.stringify(next));
  window.dispatchEvent(new Event(EVT));
};

export const writeVideoOverride = (next: VideoOverride) => {
  localStorage.setItem(LS_VIDEO, JSON.stringify(next));
  window.dispatchEvent(new Event(EVT));
};

export const writeHeroOverride = (next: HeroOverride) => {
  localStorage.setItem(LS_HERO, JSON.stringify(next));
  window.dispatchEvent(new Event(EVT));
};

export const resetOverrides = () => {
  localStorage.removeItem(LS_MATERIALS);
  localStorage.removeItem(LS_VIDEO);
  localStorage.removeItem(LS_HERO);
  window.dispatchEvent(new Event(EVT));
};

const subscribe = (cb: () => void) => {
  if (typeof window === "undefined") return () => {};
  window.addEventListener(EVT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(EVT, cb);
    window.removeEventListener("storage", cb);
  };
};

export const useBonusMaterials = (): BonusMaterial[] => {
  const overrides = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(LS_MATERIALS) ?? "",
    () => "",
  );
  const parsed = safeParse<MaterialsOverrides>(overrides || null, {});
  return BONUS_MATERIALS.map((m) => ({ ...m, ...(parsed[m.id] ?? {}) }));
};

export const useConferenceVideo = (): typeof CONFERENCE_VIDEO => {
  const raw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(LS_VIDEO) ?? "",
    () => "",
  );
  const parsed = safeParse<VideoOverride>(raw || null, {});
  return { ...CONFERENCE_VIDEO, ...parsed };
};

export const useHeroLoopVideo = (): typeof HERO_LOOP_VIDEO => {
  const raw = useSyncExternalStore(
    subscribe,
    () => localStorage.getItem(LS_HERO) ?? "",
    () => "",
  );
  const parsed = safeParse<HeroOverride>(raw || null, {});
  return { ...HERO_LOOP_VIDEO, ...parsed };
};

// Bundle of all overrides for export/import in admin
export type BonusOverridesBundle = {
  materials?: MaterialsOverrides;
  video?: VideoOverride;
  hero?: HeroOverride;
  exportedAt?: string;
};

export const exportOverrides = (): BonusOverridesBundle => ({
  materials: readMaterialsOverrides(),
  video: readVideoOverride(),
  hero: readHeroOverride(),
  exportedAt: new Date().toISOString(),
});

export const importOverrides = (b: BonusOverridesBundle) => {
  if (b.materials) writeMaterialsOverrides(b.materials);
  if (b.video) writeVideoOverride(b.video);
  if (b.hero) writeHeroOverride(b.hero);
};