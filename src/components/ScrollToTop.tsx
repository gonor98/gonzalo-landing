import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Scrolls window to the top whenever the route pathname changes.
 * Respects browser-restored scroll for back/forward via history.scrollRestoration.
 */
export const ScrollToTop = () => {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
  }, []);

  useEffect(() => {
    if (hash) return; // let in-page anchors work
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  }, [pathname, hash]);

  return null;
};

export default ScrollToTop;