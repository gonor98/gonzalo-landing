import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";

/**
 * Real history scroll restoration:
 * - PUSH/REPLACE → scroll to top (or to hash anchor if present)
 * - POP (back/forward) → restore the saved scroll position for that entry
 */
const scrollMap = new Map<string, number>();

export const ScrollToTop = () => {
  const location = useLocation();
  const navType = useNavigationType();
  const { pathname, hash, key } = location;

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    const save = () => {
      scrollMap.set(window.history.state?.key ?? "default", window.scrollY);
    };
    window.addEventListener("scroll", save, { passive: true });
    window.addEventListener("beforeunload", save);
    return () => {
      window.removeEventListener("scroll", save);
      window.removeEventListener("beforeunload", save);
    };
  }, []);

  useEffect(() => {
    if (navType === "POP") {
      const y = scrollMap.get(key) ?? 0;
      requestAnimationFrame(() => window.scrollTo({ top: y, left: 0, behavior: "auto" }));
      return;
    }
    if (hash) {
      const el = document.getElementById(hash.slice(1));
      if (el) {
        requestAnimationFrame(() => el.scrollIntoView({ behavior: "auto", block: "start" }));
        return;
      }
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash, key, navType]);

  return null;
};

export default ScrollToTop;