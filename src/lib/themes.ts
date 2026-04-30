// 33 keynote themes — Gonzalo Acuña Nava
export type ThemeCategory =
  | "FinTech"
  | "Liderazgo"
  | "Branding & Marketing"
  | "Comunicación"
  | "Ventas"
  | "Mentoría"
  | "Emprendimiento"
  | "Marketing"
  | "Desarrollo Personal"
  | "Cine & Creativo";

export interface KeynoteTheme {
  id: number;
  title: string;
  category: ThemeCategory;
  logline: string;
  description: string;
  whatYouLearn: string[];
  afterState: string;
  duration?: string;
}

export const categories: ThemeCategory[] = [
  "FinTech",
  "Liderazgo",
  "Branding & Marketing",
  "Comunicación",
  "Ventas",
  "Mentoría",
  "Emprendimiento",
  "Marketing",
  "Desarrollo Personal",
  "Cine & Creativo",
];

export const themes: KeynoteTheme[] = [
  // FinTech (1-4)
  { id: 1, category: "FinTech", title: "FinTech Revolution: The New Money Stack",
    logline: "El sistema financiero ya no se está construyendo en bancos.",
    description: "Una panorámica directa de cómo stablecoins, on-chain rails y APIs están reescribiendo la infraestructura financiera de LATAM.",
    whatYouLearn: ["Mapa del nuevo stack: settlement, custodia, identidad y compliance.", "Por qué los rails como SPEI y ACH no compiten con cripto, se integran.", "Casos vivos: cómo CALLII liquida ETH→SPEI en 47 segundos."],
    afterState: "El asistente sale con una hoja de ruta concreta de qué piezas del nuevo stack adoptar este trimestre." },
  { id: 2, category: "FinTech", title: "The Future of Money & Digital Assets",
    logline: "El dinero programable ya no es teoría — es operación.",
    description: "Por qué el dinero programable cambia la forma en que las empresas gestionan tesorería, payroll y pricing.",
    whatYouLearn: ["Stablecoins como capa de tesorería B2B.", "Modelos de pricing dinámico con smart contracts.", "Riesgo regulatorio en LATAM y cómo mitigarlo."],
    afterState: "El equipo identifica un primer flujo de tesorería que puede mover a stablecoins en 60 días." },
  { id: 3, category: "FinTech", title: "Stablecoins & Digital Currencies: Bridging TradFi & Blockchain",
    logline: "El puente entre la banca tradicional y on-chain ya está operativo.",
    description: "Cómo conectar la operación bancaria existente con liquidez on-chain sin tocar volatilidad.",
    whatYouLearn: ["Arquitectura B2B de gateways crypto-to-fiat.", "Compliance por diseño: KYC/AML embebido.", "Por qué Bridge.xyz + ERC-3643 cambian el juego."],
    afterState: "El director financiero entiende exactamente qué prerrequisitos legales y técnicos necesita." },
  { id: 4, category: "FinTech", title: "Financial Inclusion: Technology for Empowerment",
    logline: "La inclusión financiera real no es un PDF de gobierno.",
    description: "Modelos de gamificación, micro-inversión y educación que sí mueven la aguja en LATAM.",
    whatYouLearn: ["Por qué Finple aplica el modelo Duolingo a inversiones.", "Métricas de retención que importan (D14, D30).", "Cómo combinar educación con producto financiero."],
    afterState: "El asistente diseña el primer loop de educación + producto para su base de usuarios." },

  // Branding & Marketing (5-7)
  { id: 5, category: "Branding & Marketing", title: "Building Your Personal Brand: From Invisible to Iconic",
    logline: "Tu marca personal es tu activo más valioso en la era digital.",
    description: "Framework probado para atraer oportunidades y construir confianza duradera.",
    whatYouLearn: ["Definición de propuesta de valor única.", "Estrategia de contenido en LinkedIn que convierte.", "Storytelling de autoridad sin caer en el ego."],
    afterState: "El asistente publica su primer post estratégico basado en su nicho de autoridad en menos de 24 horas." },
  { id: 6, category: "Branding & Marketing", title: "Marca Personal en la Era Digital: Estrategia y Contenido",
    logline: "Sin contenido, no existes.",
    description: "Sistema operativo para producir contenido consistente sin agotarte ni vender humo.",
    whatYouLearn: ["Pillars de contenido + matriz semanal.", "Reciclaje cinético: 1 keynote = 30 piezas.", "Métricas que importan vs vanity metrics."],
    afterState: "El asistente sale con su primer calendario editorial de 30 días." },
  { id: 7, category: "Branding & Marketing", title: "From Zero to Hero: Creating a Brand That Attracts VCs",
    logline: "Los VCs invierten en historias, no en hojas de cálculo.",
    description: "Cómo construir tracción de marca antes de tener métricas de tracción.",
    whatYouLearn: ["El loop founder + producto + comunidad.", "Cuándo usar PR y cuándo no.", "Pitch narrativo vs pitch numérico."],
    afterState: "El founder reescribe el opening de su deck en una sola frase memorable." },

  // Liderazgo (8-10)
  { id: 8, category: "Liderazgo", title: "Visionary Leadership: Leading with Purpose and Strategy",
    logline: "El liderazgo visionario no es carisma, es claridad.",
    description: "Cómo definir y comunicar una visión que el equipo ejecuta sin necesidad de micromanagement.",
    whatYouLearn: ["El framework de visión a 3 capas (10y / 3y / 90d).", "Comunicación cinética en juntas de equipo.", "Cómo medir alineación cultural."],
    afterState: "El líder reescribe su statement de visión en menos de 1 página." },
  { id: 9, category: "Liderazgo", title: "Authentic Leadership: The Power of Honesty in Business",
    logline: "La honestidad editorial supera a la perfección curada.",
    description: "Por qué los equipos siguen a líderes que muestran cicatrices, no a los que muestran trofeos.",
    whatYouLearn: ["Cómo dar feedback brutal con respeto.", "Compartir errores sin perder autoridad.", "Construir cultura post-mortem sin culpa."],
    afterState: "El líder agenda su primer 1:1 de honestidad editorial con su equipo." },
  { id: 10, category: "Liderazgo", title: "Resilience & Comebacks: Turning Setbacks into Strength",
    logline: "El método de los 95 rechazos™.",
    description: "Cómo convertir el 'no' en data accionable para escalar hacia el 'sí'.",
    whatYouLearn: ["Framework matemático del rechazo.", "Cómo iterar el pitch entre cada rechazo.", "Salud mental del founder en escenarios extremos."],
    afterState: "El founder sale con permiso psicológico para disparar las próximas 100 flechas." },

  // Comunicación (11-13)
  { id: 11, category: "Comunicación", title: "Public Speaking: Owning the Stage",
    logline: "El escenario es una herramienta de negocio, no un trofeo.",
    description: "Cómo convertir cada keynote en pipeline real para tu empresa.",
    whatYouLearn: ["Estructura cinética de 3 actos.", "Manejo de Q&A bajo presión.", "Conversión: del aplauso al lead."],
    afterState: "El asistente rediseña su próxima presentación con apertura, climax y CTA claros." },
  { id: 12, category: "Comunicación", title: "Storytelling for Founders: Pitch Like a CEO",
    logline: "Tu deck no convence, tu historia sí.",
    description: "Cómo estructurar la narrativa de tu startup para que VCs e inversionistas la repitan.",
    whatYouLearn: ["El arco héroe aplicado al pitch.", "Pruebas sociales que importan en seed/Series A.", "Demos que cierran ronda."],
    afterState: "El emprendedor tiene un 'Executive Pitch' de 60 segundos grabado y validado." },
  { id: 13, category: "Comunicación", title: "Negotiation Mastery: Getting What You Want",
    logline: "Negociar no es ganar, es diseñar el siguiente movimiento.",
    description: "Tácticas usadas en negociaciones reales con $195M+ en LOIs firmados.",
    whatYouLearn: ["BATNA y anchoring en LATAM.", "Cómo cerrar sin sonar desesperado.", "Negociación con tu propio equipo."],
    afterState: "El asistente identifica su próxima negociación clave y mapea su BATNA." },

  // Mentoría (14-16)
  { id: 14, category: "Mentoría", title: "The Art of Teaching: Facilitating Transformation",
    logline: "Enseñar no es transferir datos; es facilitar la transformación.",
    description: "Diseño de experiencias de aprendizaje que generen cambios reales en individuos.",
    whatYouLearn: ["Principios de aprendizaje para adultos.", "Diseño de currículo de alto impacto.", "Técnicas de engagement activo."],
    afterState: "Los instructores internos rediseñan sus talleres para pasar de 'lectura' a 'acción'." },
  { id: 15, category: "Mentoría", title: "Mentorship & Coaching: Developing Others",
    logline: "El mejor founder es el que multiplica founders.",
    description: "Cómo construir un programa interno de mentoría que retenga y forme talento clave.",
    whatYouLearn: ["Modelo GROW aplicado a startups.", "Diferencia entre mentor, coach y manager.", "Cómo medir el ROI de la mentoría."],
    afterState: "El líder agenda 3 sesiones recurrentes de mentoría con high-potentials." },
  { id: 16, category: "Mentoría", title: "How to Teach Others: From Expert to Educator",
    logline: "Ser experto no te hace educador automáticamente.",
    description: "El puente entre dominio técnico y capacidad de transferir conocimiento masivamente.",
    whatYouLearn: ["Curse of knowledge y cómo combatirlo.", "Estructura de curso de alto retention.", "Plataformas y formatos por audiencia."],
    afterState: "El experto outline-a su primer curso o workshop monetizable." },

  // Emprendimiento (17-20)
  { id: 17, category: "Emprendimiento", title: "Building Your Vision: From Idea to Impact",
    logline: "Todo gran negocio comienza con una visión cristalina.",
    description: "Cómo definir, comunicar y ejecutar una visión que atraiga capital y talento.",
    whatYouLearn: ["Visión vs misión vs estrategia.", "Storytelling para inversores y empleados.", "Roadmap reverso desde el outcome."],
    afterState: "El founder articula su visión en una frase que su equipo puede repetir." },
  { id: 18, category: "Emprendimiento", title: "Startup Founders: The Art of Building Companies",
    logline: "Construir empresa no es construir producto.",
    description: "Las decisiones operativas, legales y de equipo que determinan supervivencia post-Series A.",
    whatYouLearn: ["Cap table sano desde día 1.", "Hiring framework: misión-críticos vs nice-to-have.", "Cuándo levantar y cuándo no."],
    afterState: "El founder identifica las 3 decisiones que está postergando." },
  { id: 19, category: "Emprendimiento", title: "Liderar Antes de Estar Listo (MBAs y futuros líderes)",
    logline: "Nadie está listo. Todos lideran de todas formas.",
    description: "Para MBAs y profesionistas a punto de tomar su primer rol de liderazgo.",
    whatYouLearn: ["El síndrome del impostor como ventaja.", "Cómo ganar autoridad sin pedirla.", "Decisiones bajo incertidumbre extrema."],
    afterState: "El asistente toma una decisión que estaba evitando esa misma semana." },
  { id: 20, category: "Emprendimiento", title: "El Ecosistema LATAM: Capital, Talento y Políticas",
    logline: "Mapa real del ecosistema LATAM en 2026.",
    description: "Para inversionistas y policy-makers: dónde está el capital, dónde el talento y qué falta.",
    whatYouLearn: ["Mapa de fondos activos por etapa.", "Hubs de talento técnico emergente.", "Las 5 políticas públicas que aceleran startups."],
    afterState: "El asistente identifica 1 oportunidad regional aún sin explotar." },

  // Marketing (21-23)
  { id: 21, category: "Marketing", title: "Marketing in the 22nd Century",
    logline: "El marketing post-IA es señal en lugar de ruido.",
    description: "Cómo construir marketing que funciona cuando todos pueden generar contenido infinito.",
    whatYouLearn: ["Distribución como ventaja competitiva.", "Marca como moat anti-IA.", "Comunidades vs audiencias."],
    afterState: "El equipo redefine su métrica norte: de impresiones a confianza." },
  { id: 22, category: "Marketing", title: "Brand Strategy: Designing for Memorability",
    logline: "La memoria es la única métrica real.",
    description: "Diseño de marca operativa: nombre, color, voz y rituales que se queden.",
    whatYouLearn: ["Anatomía de marcas memorables (PropMatch / CALLII).", "Voz de marca con honestidad editorial.", "Sistemas de diseño que no envejecen."],
    afterState: "El equipo audita su marca actual y elimina lo invisible." },
  { id: 23, category: "Marketing", title: "Performance Marketing en LATAM",
    logline: "Performance no es Meta + Google. Es ciencia operativa.",
    description: "Cómo construir motores de adquisición eficientes en mercados con CAC volátil.",
    whatYouLearn: ["Modelos de atribución reales.", "Estructuras de cuenta para LATAM.", "Cuándo y por qué pausar campañas."],
    afterState: "El CMO elimina las 3 campañas que están drenando su presupuesto." },

  // Ventas (24-26)
  { id: 24, category: "Ventas", title: "Sales Velocity for Tech Companies",
    logline: "La velocidad de venta determina la velocidad de empresa.",
    description: "Cómo cerrar ciclos de venta enterprise en 30-60 días en lugar de 6 meses.",
    whatYouLearn: ["Discovery cinético en 30 minutos.", "Cómo compactar el legal-review.", "Pricing tiering que acelera decisión."],
    afterState: "El líder de ventas identifica las 2 etapas más lentas de su pipeline." },
  { id: 25, category: "Ventas", title: "Founder-Led Sales: Por qué el CEO debe vender",
    logline: "Si el CEO no vende, nadie vende.",
    description: "Por qué los primeros 100 clientes los cierra el founder, no el equipo.",
    whatYouLearn: ["Calendario realista del CEO vendiendo.", "Cuándo handover a un VP de ventas.", "Métricas que el CEO debe ver semanalmente."],
    afterState: "El CEO bloquea 5 horas semanales en cierre directo de ventas." },
  { id: 26, category: "Ventas", title: "Enterprise Sales para Startups Pre-Seed",
    logline: "Vender a corporativos sin parecer una startup.",
    description: "Cómo ganar contratos enterprise antes de tener equipo enterprise.",
    whatYouLearn: ["Stack mínimo de seguridad y compliance.", "Cómo manejar procurement.", "Pilots que se convierten en contratos."],
    afterState: "El founder identifica los 3 prospectos enterprise para abordar este Q." },

  // Desarrollo Personal (27-29)
  { id: 27, category: "Desarrollo Personal", title: "El Método de los 95 Rechazos™",
    logline: "Convertir el 'no' en data.",
    description: "El framework matemático que llevó a Gonzalo de la quiebra a un ecosistema de $200M.",
    whatYouLearn: ["La ecuación rechazo→aprendizaje→pivote.", "Salud mental del founder bajo rechazo continuo.", "Cómo mantener equipo motivado entre 'no' y 'no'."],
    afterState: "El asistente diseña su sistema personal para procesar el próximo 'no'." },
  { id: 28, category: "Desarrollo Personal", title: "Productividad Cinética para Founders",
    logline: "El tiempo del CEO es el activo más caro de la empresa.",
    description: "Sistemas operativos personales que sostienen 3 startups simultáneas.",
    whatYouLearn: ["Block scheduling cinético.", "Las 5 reuniones que el CEO nunca debe tomar.", "Energy management vs time management."],
    afterState: "El asistente cancela 3 reuniones recurrentes esta misma semana." },
  { id: 29, category: "Desarrollo Personal", title: "Mentalidad de Atleta para Emprendedores",
    logline: "Emprender es deporte de resistencia, no sprint.",
    description: "Recuperación, sueño, nutrición y entrenamiento aplicados a la operación de empresa.",
    whatYouLearn: ["Protocolos de recovery del founder.", "Sleep como ventaja competitiva.", "Rituales pre-keynote y pre-pitch."],
    afterState: "El founder agenda su primer protocolo de descanso semanal real." },

  // Cine & Creativo (30-33)
  { id: 30, category: "Cine & Creativo", title: "Cine-Empresa: Construir Negocios como Películas",
    logline: "Pre-producción, producción, edición.",
    description: "La metodología original de Gonzalo: estructurar empresas con la disciplina del cine.",
    whatYouLearn: ["Pre-producción: estrategia y casting.", "Producción: ejecución bajo presupuesto.", "Edición: iteración basada en feedback real."],
    afterState: "El founder mapea su empresa actual en las 3 fases cinematográficas." },
  { id: 31, category: "Cine & Creativo", title: "The Power of Visual Storytelling for Brands",
    logline: "El video es el nuevo código.",
    description: "Cómo construir contenido visual que escala marca personal y producto.",
    whatYouLearn: ["Estética de marca premium con presupuesto cero.", "Cómo dirigir a tu equipo de producción.", "Distribución: dónde vive cada formato."],
    afterState: "El equipo de marketing aprueba el primer guion visual de la marca." },
  { id: 32, category: "Cine & Creativo", title: "Artistic Direction & Creative Vision",
    logline: "La dirección creativa es estrategia disfrazada.",
    description: "Cómo decidir el lenguaje visual de tu empresa antes de gastar un peso en producción.",
    whatYouLearn: ["Mood-boards funcionales.", "Cómo briefear creativos sin matar la idea.", "Coherencia entre producto y comunicación."],
    afterState: "El líder define las 3 reglas no-negociables de su lenguaje visual." },
  { id: 33, category: "Cine & Creativo", title: "Branding Through Cinema: Using Video for Scale",
    logline: "Una pieza cinética vale por mil decks.",
    description: "Cómo usar producción audiovisual para acelerar fundraising y partnerships.",
    whatYouLearn: ["Anatomía del brand film de 90 segundos.", "Cuándo invertir en video y cuándo no.", "ROI medible de contenido cinematográfico."],
    afterState: "El founder decide cuál de sus próximas 3 piezas merece tratamiento cinemático." },
];
