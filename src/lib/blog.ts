export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  description: string; // SEO meta
  date: string; // ISO
  readMinutes: number;
  keywords: string[];
  audience: string;
  cover?: string;
  body: string; // markdown-ish (rendered with simple parser)
  cta: { label: string; to: string };
};

export const BLOG_POSTS: BlogPost[] = [
  {
    slug: "proptech-latam-tokenizacion-erc3643",
    title:
      "PropTech LATAM 2026: por qué la tokenización ERC-3643 va a cambiar el mercado inmobiliario",
    excerpt:
      "Cómo la tokenización inmobiliaria con estándares regulados (ERC-3643) abre un mercado de $2T en LATAM y por qué los founders deben moverse este año.",
    description:
      "PropTech LATAM en 2026: tokenización inmobiliaria con ERC-3643, casos reales y oportunidad de $2T para founders y fondos. Análisis de Gonzalo Acuña Nava (CEO PropMatch).",
    date: "2026-04-12",
    readMinutes: 8,
    keywords: [
      "PropTech LATAM",
      "Tokenización inmobiliaria",
      "ERC-3643",
      "Real estate digital",
      "Inversión fraccionada",
    ],
    audience: "Founders PropTech, fondos LATAM, brokers tradicionales en transformación",
    body: `## El cambio silencioso del Real Estate
En LATAM, el mercado inmobiliario mueve más de **$2 trillones** y aún funciona con escrituras en papel, plazos de 90 días y mínimos de inversión imposibles para el 95% de la población. La **tokenización inmobiliaria** no es una promesa: es la actualización lógica del activo más antiguo del mundo.

## ¿Por qué ERC-3643 y no otro estándar?
ERC-3643 es el primer estándar permissioned que entiende lo que un regulador necesita: identidad on-chain, control de transferibilidad y compliance embebido. En PropMatch lo elegimos porque permite operar **bajo CNBV en México y SEC en US** sin reescribir el contrato.

## Tres oportunidades concretas para founders
- **Marketplaces fraccionados:** democratizar tickets desde $500 USD.
- **Liquidez secundaria:** mercados intra-edificio entre tenedores.
- **Renta tokenizada:** pagos automáticos vía smart contracts.

## El timing es ahora
Los reguladores de México, Brasil y Colombia están abriendo sandboxes. Quien construya con compliance desde el día 1 ganará la próxima década.`,
    cta: { label: "Reservar keynote PropTech", to: "/booking" },
  },
  {
    slug: "ia-operativa-founders-roi-real",
    title:
      "IA Operativa para Founders: cómo lograr ROI real sin perderse en demos de ChatGPT",
    excerpt:
      "Un framework probado para implementar IA en operaciones (ventas, ops, soporte) con ROI medible en 60 días. Sin bullshit, con métricas.",
    description:
      "Framework práctico de IA operativa para founders. Cómo lograr ROI medible en 60 días con casos reales de PropMatch, CALLII y Finple.",
    date: "2026-03-22",
    readMinutes: 9,
    keywords: [
      "IA operativa",
      "Inteligencia artificial empresas",
      "Automatización founders",
      "ROI IA",
      "AI agents producción",
    ],
    audience:
      "Founders Seed–Series A, COOs y líderes de operaciones que quieren pasar de pilotos a IA productiva",
    body: `## El problema: 90% de los pilotos de IA mueren en demo
Los founders prueban GPT, hacen una demo bonita y al mes siguen operando manual. La razón es simple: la IA no se diseña como un experimento, se diseña como un proceso.

## Framework Audit OS — 4 pasos
1. **Mapear procesos repetitivos** con costo > $10K/mes.
2. **Definir métrica única** por proceso (ej: minutos por ticket).
3. **Construir agente con humano-en-loop** las primeras 4 semanas.
4. **Retirar el humano gradualmente** cuando el error baje del 3%.

## Casos reales (con números)
- **CALLII:** convertimos voz → SPEI en 47 segundos. Ahorro: 60% en operación.
- **PropMatch:** scoring de leads inmobiliarios con LLM. Cierre +35%.
- **Finple:** onboarding de inversionistas en 4 minutos vs 3 días.

## El insight final
La IA operativa no es un departamento. Es una **capa transversal** que el founder debe diseñar personalmente los primeros 12 meses.`,
    cta: { label: "Aplica el Audit OS a tu empresa", to: "/audit-os" },
  },
  {
    slug: "liderazgo-founder-resiliencia-95-rechazos",
    title:
      "Liderazgo Founder: lo que aprendí de 95 rechazos antes del primer cheque",
    excerpt:
      "De lavar autos a liderar 3 startups. La verdad incómoda sobre resiliencia, narrativa y por qué tu próximo NO es el camino al SÍ que importa.",
    description:
      "Lecciones reales de liderazgo founder y resiliencia emprendedora. Cómo construí PropMatch, CALLII y Finple después de 95 rechazos. Por Gonzalo Acuña Nava.",
    date: "2026-02-18",
    readMinutes: 7,
    keywords: [
      "Liderazgo founder",
      "Resiliencia emprendedora",
      "Mentalidad startup",
      "Levantar capital LATAM",
      "Crecimiento personal CEO",
    ],
    audience:
      "Founders en early stage, estudiantes universitarios y emprendedores LATAM que están en su primer levantamiento",
    body: `## El número detrás del titular
95 rechazos. No de inversionistas: de **inversionistas, partners, clientes, mentores**. Cada NO me costó algo distinto: tiempo, ego, dinero. Pero ninguno me costó la convicción.

## Las 3 cosas que sostienen a un founder
1. **Narrativa interna:** lo que te dices cuando nadie escucha.
2. **Hábitos invisibles:** el primer hábito antes de las 7am decide tu mes.
3. **Red de personas verdaderas:** 5 personas a quienes les puedas llamar a las 11pm.

## El error más común
Confundir resiliencia con aguantar. **Resiliencia es decidir mejor más rápido.**

## Lo que diría a mi yo de 22
- Habla menos de la idea, ejecuta más rápido.
- Documenta todo desde el día 1 (eso construye narrativa).
- El dinero no resuelve problemas de equipo. Nunca.

## El mensaje final
No hay atajos. Pero hay método. Y el método se enseña — para eso construí PropMatch, CALLII y Finple, y para eso doy keynotes a estudiantes en LATAM.`,
    cta: { label: "Vive la conferencia 95 Rechazos", to: "/bonus-ceti" },
  },
];

export const getPostBySlug = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);