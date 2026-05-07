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
    body: `Voy a empezar con una confesión: la primera vez que un notario en Guadalajara me dijo que necesitaba 47 días para cerrar una escritura, pensé que estaba bromeando. No bromeaba. Y ese fue el momento exacto en el que entendí que el real estate en LATAM no necesita "más tecnología": necesita una arquitectura completamente nueva.

Si llevas tiempo en PropTech, este post no te va a vender humo. Te voy a contar lo que hemos visto operando PropMatch en México, hablando con la CNBV, peleándonos con custodios y firmando LOIs por $195M con desarrolladores que hace dos años pensaban que blockchain era una moda.

## El elefante de $2T que nadie quiere mover

El inmobiliario LATAM mueve más de **$2 trillones de dólares**. Y sigue corriendo sobre tres supuestos que ya no resisten el 2026:

1. Que la escritura física es la única forma de demostrar propiedad.
2. Que un ticket mínimo de $50,000 USD es "razonable".
3. Que la liquidez del activo es un problema del comprador, no del emisor.

Cualquier founder que haya intentado vender un departamento en Polanco a un inversionista de Bogotá entiende lo absurdo del sistema. **No es un problema de UX. Es un problema de infraestructura.**

## ¿Por qué ERC-3643 y no otro estándar?

Probamos ERC-20 (no sirve, no entiende identidad). Probamos ERC-1400 (mejor, pero los reguladores no lo entienden). Llegamos a **ERC-3643** porque es el único estándar permissioned que mete tres cosas dentro del token mismo:

- **Identidad on-chain (ONCHAINID):** sabes quién está del otro lado sin romper la privacidad.
- **Control de transferibilidad:** puedes bloquear, restringir o pausar transferencias por jurisdicción.
- **Compliance embebido:** las reglas viven en el contrato, no en una capa externa que se puede saltar.

En PropMatch lo elegimos porque nos permite **operar bajo CNBV en México y registrar el mismo activo bajo Reg D en Estados Unidos** sin reescribir el smart contract. Para un founder eso significa: una sola base de código, dos mercados, cero retrabajo regulatorio.

## Tres oportunidades concretas (con números, no con vibes)

### 1. Marketplaces fraccionados desde $500 USD
No es teoría. Estamos viendo conversiones de 4.2% en landing pages que ofrecen entrar a un edificio AAA con el equivalente a una cena para dos. **Tip práctico:** no compitas en cap rate, compite en accesibilidad.

### 2. Liquidez secundaria intra-edificio
El secreto sucio: los inversionistas no quieren rendimiento, quieren **poder salirse**. Diseñar un mercado secundario donde tenedores del mismo edificio se compran entre sí resuelve más fricción que cualquier yield del 12%.

### 3. Renta tokenizada con pagos automáticos
Smart contract paga el 1° de cada mes. Sin cobranza, sin intermediario, sin "déjame revisar con mi contador". **Si vas a construir esto:** integra primero con SPEI vía un PSP regulado. La pureza on-chain mata adopción.

## El error que veo en 8 de cada 10 founders PropTech

Empezar por el token y dejar el compliance para "después". El compliance no es un módulo que enchufas: **es la columna vertebral del producto**. Si tu identidad on-chain, tu KYC y tu reporte regulatorio no están diseñados desde el día 1, vas a tener que tirar el MVP.

## Tres tips antes de cerrar

- **Habla con tu regulador antes de levantar capital.** Una carta de no objeción vale más que un term sheet.
- **Custodio primero, exchange después.** Si no tienes custodia institucional, no tienes producto vendible a un fondo.
- **Mide trust, no TVL.** En tokenización el KPI real es: ¿el inversionista deja entrar a su mamá? Si no, te falta narrativa.

## El timing es ahora — y no lo digo para vender FOMO

México, Brasil y Colombia abrieron sandboxes este año. La SEC publicó guías nuevas sobre tokens permissioned. Los family offices de LATAM por primera vez tienen mandato para invertir en tokenización. **Si estás construyendo aquí, los próximos 18 meses son los que más van a importar de la década.**

Si quieres que aterrice este framework en tu equipo o en un evento corporativo, abajo te dejo cómo. Y si me escribes, dime en qué etapa estás — respondo personalmente.

— Gonzalo`,
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