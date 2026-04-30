// Booking flow data (Bureau / Organizer / Enterprise)
export type BookingType = "bureau" | "organizer" | "enterprise";

export interface BookingTypeConfig {
  id: BookingType;
  label: string;
  oneLiner: string;
  description: string;
  fields: Array<{
    name: string;
    label: string;
    type: "text" | "email" | "tel" | "date" | "textarea" | "select";
    required?: boolean;
    placeholder?: string;
    options?: string[];
  }>;
}

const sharedTopics = [
  "PropTech & IA",
  "Resiliencia Fundadora",
  "IA Operativa",
  "Ecosistema LATAM",
  "Liderazgo",
  "Otro",
];

export const bookingTypes: BookingTypeConfig[] = [
  {
    id: "bureau",
    label: "Speaker Bureau",
    oneLiner: "Para agencias y bureaus representando a tu cliente.",
    description:
      "Procesos rápidos: enviamos fee, demo reel y disponibilidad por slot. Trabajamos con bureaus en LATAM, US y EU.",
    fields: [
      { name: "full_name", label: "Tu nombre", type: "text", required: true },
      { name: "email", label: "Email del bureau", type: "email", required: true },
      { name: "organization", label: "Bureau / Agencia", type: "text", required: true },
      { name: "phone", label: "Teléfono / WhatsApp", type: "tel" },
      { name: "event_name", label: "Nombre del cliente final", type: "text" },
      { name: "event_date", label: "Fecha tentativa", type: "date" },
      { name: "event_city", label: "Ciudad / País", type: "text" },
      {
        name: "audience_size",
        label: "Tamaño de audiencia",
        type: "select",
        options: ["< 200", "200 – 1,000", "1,000 – 5,000", "5,000+"],
      },
      { name: "topic_interest", label: "Tema de interés", type: "select", options: sharedTopics },
      { name: "message", label: "Notas para el equipo", type: "textarea" },
    ],
  },
  {
    id: "organizer",
    label: "Event Organizer",
    oneLiner: "Para conferencias, summits y eventos corporativos.",
    description:
      "Llenamos formato, fee y rider técnico para que tu producción avance sin fricción.",
    fields: [
      { name: "full_name", label: "Tu nombre completo", type: "text", required: true },
      { name: "email", label: "Email del organizador", type: "email", required: true },
      { name: "organization", label: "Empresa / Comité organizador", type: "text", required: true },
      { name: "role", label: "Tu rol", type: "text", placeholder: "Ej. Director de contenidos" },
      { name: "event_name", label: "Nombre del evento", type: "text", required: true },
      { name: "event_date", label: "Fecha del evento", type: "date", required: true },
      { name: "event_city", label: "Ciudad / Sede", type: "text", required: true },
      {
        name: "audience_size",
        label: "Tamaño esperado de audiencia",
        type: "select",
        required: true,
        options: ["< 500", "500 – 2,000", "2,000 – 5,000", "5,000 – 15,000", "15,000+"],
      },
      {
        name: "budget_range",
        label: "Rango de presupuesto (MXN)",
        type: "select",
        options: ["< $50K", "$50K – $150K", "$150K – $400K", "$400K+"],
      },
      { name: "topic_interest", label: "Tema deseado", type: "select", options: sharedTopics },
      { name: "message", label: "Brief del evento", type: "textarea" },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise / Brand",
    oneLiner: "Para empresas que quieren un keynote, taller o consultoría in-house.",
    description:
      "Diseñamos formato y contenido a la medida: keynote, masterclass o sprint estratégico con dirección de Gonzalo.",
    fields: [
      { name: "full_name", label: "Tu nombre", type: "text", required: true },
      { name: "email", label: "Email corporativo", type: "email", required: true },
      { name: "organization", label: "Empresa", type: "text", required: true },
      { name: "role", label: "Tu cargo", type: "text", required: true },
      { name: "phone", label: "Teléfono", type: "tel" },
      {
        name: "audience_size",
        label: "Tamaño del equipo / audiencia interna",
        type: "select",
        required: true,
        options: ["10 – 50", "50 – 250", "250 – 1,000", "1,000+"],
      },
      { name: "event_city", label: "Ciudad", type: "text" },
      { name: "event_date", label: "Fecha objetivo", type: "date" },
      {
        name: "budget_range",
        label: "Presupuesto disponible (MXN)",
        type: "select",
        options: ["$50K – $150K", "$150K – $400K", "$400K – $1M", "Open"],
      },
      { name: "topic_interest", label: "Objetivo de negocio", type: "select", options: sharedTopics },
      { name: "message", label: "Contexto del proyecto", type: "textarea" },
    ],
  },
];
