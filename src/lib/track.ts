// Lightweight, provider-agnostic event tracking.
// Pushes to window.dataLayer (GA4 / GTM compatible) and logs in dev.
// Plug a real provider later by reading window.dataLayer or replacing push().

type EventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export const track = (event: string, params: EventParams = {}) => {
  try {
    const payload = { event, ts: Date.now(), ...params };
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(payload);
    }
    if (import.meta.env.DEV) {
      // Safe log: no PII, just event name + non-sensitive params
      // eslint-disable-next-line no-console
      console.debug("[track]", event, params);
    }
  } catch {
    // Never break UX because of analytics
  }
};

export const trackSocialClick = (network: string, location: string) =>
  track("social_click", { network, location });

export const trackCTAClick = (cta: string, location: string) =>
  track("cta_click", { cta, location });

export const trackWhatsAppClick = (location: string) =>
  track("whatsapp_click", { location });

export const trackDownload = (file: string, location: string, action: "preview" | "download" = "download") =>
  track("file_download", { file, location, action });

export const trackPreviewOpen = (file: string, location: string) =>
  track("file_preview_open", { file, location });

export const trackVideo = (
  action: "play" | "pause" | "ended" | "progress",
  video: string,
  location: string,
  extra: EventParams = {},
) => track("video_event", { action, video, location, ...extra });

export const trackNewsletter = (
  action: "view" | "submit" | "success" | "dismiss" | "error",
  location: string,
  extra: EventParams = {},
) => track("newsletter_event", { action, location, ...extra });

export const trackScrollDepth = (percent: 25 | 50 | 75 | 100, path: string) =>
  track("scroll_depth", { percent, path });

/**
 * Attach a global scroll-depth tracker.
 * Fires once per threshold per pathname.
 */
export const initScrollDepth = () => {
  if (typeof window === "undefined") return () => {};
  const fired = new Set<string>();
  const thresholds: Array<25 | 50 | 75 | 100> = [25, 50, 75, 100];

  const onScroll = () => {
    const doc = document.documentElement;
    const max = Math.max(1, doc.scrollHeight - window.innerHeight);
    const pct = Math.min(100, Math.round((window.scrollY / max) * 100));
    const path = window.location.pathname;
    for (const t of thresholds) {
      const key = `${path}:${t}`;
      if (pct >= t && !fired.has(key)) {
        fired.add(key);
        trackScrollDepth(t, path);
      }
    }
  };

  let raf = 0;
  const onScrollRaf = () => {
    if (raf) return;
    raf = window.requestAnimationFrame(() => {
      raf = 0;
      onScroll();
    });
  };

  window.addEventListener("scroll", onScrollRaf, { passive: true });
  return () => window.removeEventListener("scroll", onScrollRaf);
};