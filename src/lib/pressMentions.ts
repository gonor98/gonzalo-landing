/**
 * Real press mentions of Gonzalo Acuña Nava and PropMatch.
 * All URLs are real, verifiable third-party sources.
 * Used for the /prensa page, blog backlinks, JSON-LD and SEO trust signals.
 */
export type PressMention = {
  outlet: string;
  country: string;
  category: "tier1" | "industry" | "podcast" | "stage";
  title: string;
  date: string; // ISO
  url: string;
  excerpt: string;
};

export const PRESS_MENTIONS: PressMention[] = [
  {
    outlet: "El Economista",
    country: "MX",
    category: "tier1",
    title: "Del campus a CEO de su propia compañía: la historia de éxito de Gonzalo Acuña",
    date: "2025-11-04",
    url: "https://www.eleconomista.com.mx/los-especiales/campus-ceo-propia-compania-historia-exito-gonzalo-acuna-20251104-784903.html",
    excerpt:
      "Desde lavar autos hasta liderar una startup valuada en más de 160 millones de dólares, Gonzalo Acuña inspira a los jóvenes a creer en su potencial.",
  },
  {
    outlet: "NotiPress",
    country: "MX",
    category: "tier1",
    title: "Startup mexicana tokeniza 2,200 hectáreas para que cualquiera sea dueño de propiedades",
    date: "2025-07-26",
    url: "https://notipress.mx/opinion/startup-mexicana-tokeniza-2200-hectareas-para-propiedades-31055",
    excerpt:
      "PropMatch formalizó un acuerdo para tokenizar 2,200 hectáreas en distintas regiones del mundo, primera empresa en aplicar este modelo de propiedad fraccionada a escala global.",
  },
  {
    outlet: "NotiPress",
    country: "MX",
    category: "tier1",
    title: "App mexicana convierte a cualquier usuario en inversionista inmobiliario",
    date: "2025-07-15",
    url: "https://notipress.mx/negocios/app-mexicana-convierte-a-cualquier-usuario-en-inversionista-inmobiliario-30832",
    excerpt:
      "Una aplicación desarrollada por emprendedores mexicanos permite a cualquier persona invertir en inmuebles globales desde 10 dólares.",
  },
  {
    outlet: "Real Estate Market & Lifestyle",
    country: "MX",
    category: "industry",
    title: "Impulsan la tokenización inmobiliaria desde México a través de blockchain",
    date: "2026-05-01",
    url: "https://realestatemarket.com.mx/noticias/mercado-inmobiliario/48576-impulsan-la-tokenizacion-inmobiliaria-desde-mexico-a-traves-de-blockchain",
    excerpt:
      "México se posiciona como hub regional de tokenización inmobiliaria con PropMatch a la cabeza, abriendo un mercado tradicionalmente cerrado a inversionistas institucionales.",
  },
  {
    outlet: "PropTech LATAM Connection",
    country: "LATAM",
    category: "industry",
    title:
      "Del ladrillo al token: PropMatch democratiza la inversión inmobiliaria en América Latina y más allá",
    date: "2025-05-20",
    url: "https://proptechlatamconnection.com/del-ladrillo-al-token-propmatch-democratiza-la-inversion-inmobiliaria-en-america-latina-y-mas-alla/",
    excerpt:
      "Desde Guadalajara hasta el escenario global, PropMatch revoluciona el acceso al real estate, permitiendo invertir desde $10 USD en propiedades premium con blockchain e IA.",
  },
  {
    outlet: "PropTech LATAM Connection",
    country: "LATAM",
    category: "industry",
    title:
      "PropMatch eleva el Real Estate latino: valuación récord, ronda pre-semilla y un pipeline de US $195M",
    date: "2025-06-04",
    url: "https://proptechlatamconnection.com/propmatch-eleva-el-real-estate-latino-valuacion-record-ronda-pre-semilla-y-un-pipeline-de-us-195-m-la-startup-que-quiere-convertir-cada-ladrillo-en-un-activo-global/",
    excerpt:
      "La startup mexicana presenta su tesis de cómo convertir cada ladrillo en un activo global durante el PropTech Latam Summit Week.",
  },
  {
    outlet: "DobleFilo MX",
    country: "MX",
    category: "industry",
    title: "Gana impulso la PropTech mexicana llamada 'Nasdaq inmobiliaria'",
    date: "2025-06-12",
    url: "https://doblefilomx.com/gana-impulso-la-proptech-mexicana-llamada-nasdaq-inmobiliaria/",
    excerpt:
      "PropMatch es el primer Nasdaq global inmobiliario, el primero en su clase: invertir desde una app, desde 10 dólares.",
  },
  {
    outlet: "CodeLaunch",
    country: "US",
    category: "industry",
    title: "From CodeLaunch Finalist to a $21M Raise: Inside PropMatch's Breakout Journey",
    date: "2026-01-12",
    url: "https://codelaunch.com/inside-propmatch-breakout-journey/",
    excerpt:
      "Just months after competing as a CodeLaunch LATAM finalist, PropMatch closed a $21 million funding round.",
  },
  {
    outlet: "Talent Land MX 2026",
    country: "MX",
    category: "stage",
    title: "Gonzalo Acuña Nava — Speaker oficial Talent Land 2026",
    date: "2026-04-20",
    url: "https://agenda.talent-land.mx/speakers/1f0c7464-d4ce-40f1-8336-f35e0ed9433f",
    excerpt:
      "Speaker confirmado en la edición 2026 de Talent Land, el festival de talento, tecnología y emprendimiento más grande de Latinoamérica.",
  },
  {
    outlet: "Inteligencia Artificial para los Negocios (Podcast)",
    country: "ES",
    category: "podcast",
    title: "#149 Cómo emprender creando tu propio negocio de IA",
    date: "2026-02-22",
    url: "https://podscan.fm/podcasts/inteligencia-artificial-para-los-negocios/episodes/149-como-emprender-creando-tu-propio-negocio-de-ia",
    excerpt:
      "Conversación de 54 minutos sobre cómo construir un negocio con IA desde cero, lecciones de PropMatch y el ecosistema founder LATAM.",
  },
];

export const OUTLET_LIST = Array.from(
  new Set(PRESS_MENTIONS.map((m) => m.outlet))
);
