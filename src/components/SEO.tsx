import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  path?: string;
  jsonLd?: Record<string, any> | Record<string, any>[];
  ogImage?: string;
}

const SITE_URL = "https://gonzaloacuna.com";

const upsert = (selector: string, attrs: Record<string, string>) => {
  let el = document.head.querySelector(selector) as HTMLElement | null;
  if (!el) {
    el = document.createElement(selector.split("[")[0]);
    document.head.appendChild(el);
  }
  Object.entries(attrs).forEach(([k, v]) => el!.setAttribute(k, v));
};

export const SEO = ({ title, description, path = "/", jsonLd, ogImage }: SEOProps) => {
  useEffect(() => {
    const url = `${SITE_URL}${path}`;
    document.title = title;

    upsert(`meta[name="description"]`, { name: "description", content: description });
    upsert(`link[rel="canonical"]`, { rel: "canonical", href: url });

    upsert(`meta[property="og:title"]`, { property: "og:title", content: title });
    upsert(`meta[property="og:description"]`, { property: "og:description", content: description });
    upsert(`meta[property="og:url"]`, { property: "og:url", content: url });
    upsert(`meta[property="og:type"]`, { property: "og:type", content: "website" });
    upsert(`meta[property="og:site_name"]`, { property: "og:site_name", content: "Gonzalo Acuña Nava" });
    upsert(`meta[property="og:locale"]`, { property: "og:locale", content: "es_MX" });
    if (ogImage) upsert(`meta[property="og:image"]`, { property: "og:image", content: ogImage });

    upsert(`meta[name="twitter:card"]`, { name: "twitter:card", content: "summary_large_image" });
    upsert(`meta[name="twitter:site"]`, { name: "twitter:site", content: "@gonzaloacuna" });
    upsert(`meta[name="twitter:creator"]`, { name: "twitter:creator", content: "@gonzaloacuna" });
    upsert(`meta[name="twitter:title"]`, { name: "twitter:title", content: title });
    upsert(`meta[name="twitter:description"]`, { name: "twitter:description", content: description });
    if (ogImage) upsert(`meta[name="twitter:image"]`, { name: "twitter:image", content: ogImage });

    // JSON-LD
    document.querySelectorAll('script[data-seo-jsonld]').forEach((n) => n.remove());
    if (jsonLd) {
      const blocks = Array.isArray(jsonLd) ? jsonLd : [jsonLd];
      blocks.forEach((b) => {
        const s = document.createElement("script");
        s.type = "application/ld+json";
        s.setAttribute("data-seo-jsonld", "true");
        s.text = JSON.stringify(b);
        document.head.appendChild(s);
      });
    }
  }, [title, description, path, ogImage, JSON.stringify(jsonLd)]);

  return null;
};

export const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Gonzalo Acuña Nava",
  url: SITE_URL,
  image: `${SITE_URL}/og-gonzalo.jpg`,
  jobTitle: "CEO & Keynote Speaker",
  description:
    "CEO de PropMatch, CALLII y Finple. Speaker global de PropTech, IA Operativa y Liderazgo. Forbes 30U30 nominee, ganador Talent Land 2026.",
  email: "mailto:gonzalo@propmatchapp.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Guadalajara",
    addressRegion: "Jalisco",
    addressCountry: "MX",
  },
  sameAs: [
    "https://www.linkedin.com/in/gonzaloacuna",
    "https://www.instagram.com/gonavacu",
    "https://twitter.com/gonzaloacuna",
  ],
  worksFor: [
    { "@type": "Organization", name: "PropMatch" },
    { "@type": "Organization", name: "CALLII" },
    { "@type": "Organization", name: "Finple" },
  ],
  knowsAbout: ["PropTech", "Tokenización Inmobiliaria", "ERC-3643", "IA Operativa", "FinTech", "Liderazgo", "Resiliencia"],
  award: [
    "Talent Land 2026 — Startup Revelación",
    "Forbes 30 Under 30 Nominee 2025",
    "PropTech LATAM Award 2025",
    "Web Summit Lisboa Finalist",
    "TNW Amsterdam Finalist",
  ],
};
