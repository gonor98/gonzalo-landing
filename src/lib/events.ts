// Curated upcoming/past keynote events for SEO JSON-LD.
// Keep dates accurate; events past today are still valid for SEO history.

export interface KeynoteEvent {
  name: string;
  startDate: string; // ISO
  endDate?: string;
  city: string;
  country: string;
  venue?: string;
  url?: string;
  description?: string;
  status?: "scheduled" | "completed" | "cancelled";
  attendanceMode?: "offline" | "online" | "mixed";
}

export const upcomingEvents: KeynoteEvent[] = [
  {
    name: "Talent Land 2026 — Keynote",
    startDate: "2026-04-21T17:00:00-06:00",
    endDate: "2026-04-21T18:00:00-06:00",
    city: "Guadalajara",
    country: "MX",
    venue: "Expo Guadalajara",
    description: "Cómo construí un ecosistema de $200M con el método Cine-Empresa.",
    status: "scheduled",
    attendanceMode: "offline",
  },
  {
    name: "PropTech LATAM Summit 2026",
    startDate: "2026-06-10T15:00:00-05:00",
    city: "Ciudad de México",
    country: "MX",
    venue: "WTC CDMX",
    description: "Tokenización inmobiliaria con ERC-3643 en mercados emergentes.",
    status: "scheduled",
    attendanceMode: "offline",
  },
];

export const pastEvents: KeynoteEvent[] = [
  {
    name: "Web Summit Lisboa 2025",
    startDate: "2025-11-12T10:00:00+00:00",
    city: "Lisboa",
    country: "PT",
    status: "completed",
    attendanceMode: "offline",
  },
  {
    name: "TNW Amsterdam 2025",
    startDate: "2025-06-19T10:00:00+02:00",
    city: "Ámsterdam",
    country: "NL",
    status: "completed",
    attendanceMode: "offline",
  },
];