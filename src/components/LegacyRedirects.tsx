import { useEffect } from "react";
import { Navigate, useLocation } from "react-router-dom";

/**
 * Map of legacy URL paths -> canonical destination.
 * IMPORTANT: /bonus-ceti and /bonus-ceti-descargas are intentionally NOT in
 * this map — those routes stay live and untouched.
 */
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/bonus": "/benefits",
  "/bonuses": "/benefits",
  "/beneficios": "/benefits",
  "/materiales": "/benefits",
  "/materiales-ceti": "/bonus-ceti-descargas",
  "/ceti": "/bonus-ceti",
  "/ceti-descargas": "/bonus-ceti-descargas",
  "/descargas": "/bonus-ceti-descargas",
  "/descargas-ceti": "/bonus-ceti-descargas",
  "/bonus/ceti": "/bonus-ceti",
  "/benefits/ceti": "/bonus-ceti",
  "/benefits/ceti-descargas": "/bonus-ceti-descargas",
};

/**
 * Renders a 301-style redirect (client-side) and emits a meta refresh + canonical
 * so search engines that hit the SPA still see the new URL. Server-side, Lovable's
 * SPA fallback always serves index.html, so this component handles the routing.
 */
export const Redirect301 = ({ to }: { to: string }) => {
  const { search, hash } = useLocation();
  useEffect(() => {
    // emit meta refresh with 0s so crawlers without JS still follow it
    const m = document.createElement("meta");
    m.httpEquiv = "refresh";
    m.content = `0;url=${to}`;
    m.setAttribute("data-legacy-redirect", "true");
    document.head.appendChild(m);
    const c = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
    if (c) c.href = `https://gonzaloacuna.com${to}`;
    return () => {
      document.querySelectorAll('meta[data-legacy-redirect]').forEach((n) => n.remove());
    };
  }, [to]);
  return <Navigate to={`${to}${search}${hash}`} replace />;
};