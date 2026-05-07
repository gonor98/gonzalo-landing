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
    body: `Te voy a ahorrar 30 minutos de LinkedIn: la mayoría de las "implementaciones de IA" que ves en tu feed son demos. Bonitas, virales, inútiles. Y lo digo desde el cariño, porque yo también caí en esa trampa los primeros seis meses construyendo CALLII.

Este post es lo que hubiera querido leer en 2024, antes de quemar $40K en pilotos que nunca llegaron a producción.

## El problema real: 9 de cada 10 pilotos mueren en la demo

No es que la tecnología no funcione. Es que la tratamos como **experimento** cuando deberíamos tratarla como **proceso**. Una demo te dice "esto es posible". Un proceso te dice "esto va a correr el lunes a las 9am sin que nadie lo supervise". Son cosas distintas.

El founder promedio se obsesiona con el modelo (¿GPT-5? ¿Gemini? ¿Claude?). El founder que escala se obsesiona con **el handoff**: dónde empieza la IA, dónde termina el humano, y qué pasa cuando algo falla a las 3am.

## Audit OS — el framework que usamos en mis tres empresas

Es lo mismo que aplicamos en PropMatch, CALLII y Finple. Cuatro pasos, en este orden, sin saltarse ninguno:

### 1. Mapea procesos repetitivos con costo > $10K/mes
Si no llega a esa línea, no metas IA. Mete un Notion bien hecho. La IA tiene costo de operación, mantenimiento y deuda técnica — sólo paga si el proceso ya te duele en la cuenta de banco.

### 2. Define UNA métrica por proceso
Una. No tres. Una. En CALLII fue "segundos de voz a SPEI". En PropMatch fue "leads calificados por hora-humano". Si no puedes describir el éxito en una métrica, no estás listo para automatizar.

### 3. Construye con humano-en-loop las primeras 4 semanas
El humano no es muleta: es **profesor**. Cada corrección que hace alimenta tu fine-tuning, tu prompt o tu base de evals. Si saltas este paso, vas a estar debuggeando alucinaciones en producción con clientes molestos. Yo ya pagué esa lección.

### 4. Retira al humano cuando el error baje del 3%
Gradual, no de golpe. Pasamos de revisar el 100% de las llamadas, al 50%, al 10%, hasta llegar al spot-check semanal. **El error 0% no existe.** Si lo persigues, no vas a lanzar nunca.

## Casos reales — con los números que normalmente no se cuentan

**CALLII (voz → SPEI en 47 segundos)**
- Antes: 6 minutos promedio, agente humano, 3 errores cada 100 transacciones.
- Después: 47 segundos, agente IA con human-in-loop, error <1%.
- Lo que nadie te cuenta: nos tomó **11 semanas** llegar ahí, no 11 días. Y los primeros prompts eran horribles.

**PropMatch (scoring de leads inmobiliarios)**
- Cierre +35%, pero la métrica que nos cambió la vida fue otra: **el tiempo del broker dejó de irse en filtrar y se fue a cerrar**. La IA no reemplazó al broker, le devolvió el oficio.

**Finple (onboarding de inversionistas)**
- 3 días → 4 minutos. KYC + AML + perfil de riesgo automatizado.
- Truco real: no usamos IA para el KYC. Usamos IA para **explicarle al inversionista por qué le pedimos cada documento**. La fricción no era técnica, era emocional.

## Cinco tips que sólo aprendes en producción

1. **Loguea TODO.** Cada prompt, cada respuesta, cada corrección humana. Tu dataset futuro vale más que tu modelo actual.
2. **Eval antes de prod.** Construye un set de 50–100 ejemplos "de oro" y mide cada cambio contra ellos. Sin esto, vas a ciegas.
3. **El costo no es el token, es la latencia.** Un agente que tarda 9 segundos no se usa, aunque sea perfecto.
4. **Diseña para el día malo.** ¿Qué pasa cuando el modelo está caído? ¿Cuando alucina? ¿Cuando un cliente lo intenta romper a propósito? Si no tienes respuesta, no estás listo.
5. **El founder es el primer prompt engineer.** No lo delegues los primeros 12 meses. Los matices del negocio viven en tu cabeza, no en la del PM.

## El insight con el que me quedo

La IA operativa no es un departamento. No es un "head of AI" que contratas. Es una **capa transversal** que tú, como founder, debes diseñar personalmente — al menos hasta que el sistema corra solo. Después puedes delegar. Antes, no.

Si quieres que pase un día con tu equipo y diagnostiquemos juntos dónde meter IA con ROI real, hay un programa para eso. Y si sólo tienes una pregunta, escríbeme. Respondo.

— Gonzalo`,
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
    body: `Hay un Excel en mi laptop que casi nadie ha visto. Tiene 95 filas. Cada fila es un NO: el inversionista que dijo "estás muy verde", el cliente que firmó con la competencia, el mentor que dejó de contestarme, el partner que me dijo "esto no va a funcionar en LATAM". Lo guardo no por nostalgia. Lo guardo porque cada NO me enseñó algo que un SÍ no me hubiera enseñado nunca.

Si estás leyendo esto y vas en tu rechazo número 12, 30 o 60: respira. No estás roto. Estás en el proceso.

## El número detrás del titular

95 rechazos antes del primer cheque real. Y no eran sólo de fondos: eran de **inversionistas, partners, clientes, mentores y hasta amigos** que dejaron de creer. Cada NO me costó algo distinto: tiempo, ego, dinero, una relación. Pero ninguno me costó lo que de verdad importa: la convicción.

Lo más difícil del founder journey no es el rechazo. Es **seguir presentándote después del rechazo número 40**, cuando ya no tienes argumentos nuevos y empiezas a dudar de los viejos.

## Las 3 cosas que sostienen a un founder cuando todo se cae

### 1. Narrativa interna
Lo que te dices cuando nadie escucha. No es positivismo. Es **una historia coherente** sobre por qué estás haciendo esto y por qué tú. Si tu narrativa interna es "voy a probar a ver", el primer NO te tumba. Si tu narrativa es "esto va a existir y voy a ser yo quien lo construya", el rechazo 95 sigue doliendo, pero no te detiene.

### 2. Hábitos invisibles
El primer hábito antes de las 7am decide tu mes. En mi caso: 20 minutos de escritura, 30 minutos de movimiento, café sin pantalla. No es ritual místico, es **higiene mental**. Cuando llega el día malo (y llegan muchos), los hábitos te cargan por inercia.

### 3. Red de personas verdaderas
No "tu network". **Cinco personas a quienes les puedas llamar a las 11pm.** Sin agenda, sin pitch, sin máscara. Si no las tienes, deja de hacer eventos y consigue una. Es más importante que tu próxima ronda.

## El error más común que veo en founders early-stage

Confundir resiliencia con aguantar. No son lo mismo. **Resiliencia es decidir mejor más rápido**, no apretar los dientes y seguir empujando una piedra que no se mueve. A veces lo más resiliente es matar la idea, pivotar, despedir a tu mejor amigo del equipo, devolver el cheque. Aguantar sin pensar es necedad, no resiliencia.

## Cinco tips concretos para tu próximo NO

1. **Pide feedback, no validación.** "¿Qué tendría que ser cierto para que invirtieras?" abre conversaciones. "¿Qué te pareció?" cierra puertas.
2. **Llévate un dato de cada rechazo.** Si sales con las manos vacías, perdiste doble: el cheque y la lección.
3. **No pitchees triste.** Si vienes de tres NOs seguidos, **cancela la siguiente reunión**. La energía del founder es parte del producto.
4. **Documenta el proceso.** Yo escribo después de cada reunión clave. En tres años, ese archivo se vuelve tu mejor activo de marca personal.
5. **No te endeudes emocionalmente con el SÍ.** Mientras no haya wire transfer, no hay deal. Punto.

## Lo que le diría hoy a mi yo de 22 años

- **Habla menos de la idea, ejecuta más rápido.** Nadie te va a copiar. Y si te copian, ya perdieron porque tú llevas la narrativa.
- **Documenta todo desde el día 1.** Vas a necesitar la historia más adelante. Para inversionistas, para tu equipo, para ti mismo cuando dudes.
- **El dinero no resuelve problemas de equipo. Nunca.** Si la cultura está rota, el cheque la rompe más rápido.
- **Lavar autos no fue tiempo perdido.** Fue tu primera lección de servicio al cliente. Honra los capítulos pequeños — son los que sostienen los grandes.
- **Llama a tu mamá más seguido.** En serio.

## Para los estudiantes que me escuchan en CETI, Talent Land y otras escuelas

No empieces buscando "tu pasión". Empieza buscando un problema que te incomode. La pasión llega cuando llevas 18 meses peleándote con el problema y todavía no te quieres rendir. Eso es lo más cerca que tendrás de una vocación real.

Y por favor: **deja de esperar el momento perfecto**. No existe. Existe el momento que decides convertir en perfecto trabajando como loco.

## El mensaje con el que me quedo

No hay atajos. Pero hay método. Y el método se enseña — por eso construí PropMatch, CALLII y Finple, y por eso doy keynotes a estudiantes y founders en LATAM. Si quieres vivir la conferencia completa de "95 Rechazos" con todo el material que me hubiera gustado tener a tu edad, te dejo el acceso abajo.

Nos vemos del otro lado del próximo NO.

— Gonzalo`,
    cta: { label: "Vive la conferencia 95 Rechazos", to: "/bonus-ceti" },
  },
];

export const getPostBySlug = (slug: string) => BLOG_POSTS.find((p) => p.slug === slug);