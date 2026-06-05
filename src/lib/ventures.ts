// Single source of truth for Gonzalo Acuña Nava's venture URLs.
// Used across the site so backlinks stay consistent and indexable.

export const VENTURE_URLS = {
  propmatch: {
    landing: "https://www.propmatchapp.com",
    label: "propmatchapp.com",
  },
  finple: {
    landing: "https://www.finple.online",
    app: "https://www.finple.com.mx",
    label: "finple.online",
  },
  callii: {
    // no public landing yet — use email/contact via main site
    landing: "https://gonzaloacuna.com/#ventures",
    label: "callii",
  },
} as const;

export const FINPLE_LANDING = VENTURE_URLS.finple.landing;
export const FINPLE_APP = VENTURE_URLS.finple.app;
export const PROPMATCH_LANDING = VENTURE_URLS.propmatch.landing;
