import { motion } from "framer-motion";
import { ArrowRight, BookOpen, Check, GraduationCap, Users, Sparkles, Download } from "lucide-react";
import { Link } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { SiteFooter } from "@/components/SiteFooter";
import { SEO } from "@/components/SEO";
import maestroCover from "@/assets/blog-maestro-universidad-cover.jpg";

const SITE = "https://gonzaloacuna.com";

const PACKAGES = [
  {
    name: "Charla Magistral",
    duration: "45–90 min",
    audience: "Hasta 1,500 estudiantes",
    desc: "Keynote curada para universidades y prepas sobre emprendimiento, PropTech, IA y resiliencia founder. Q&A en vivo.",
    items: [
      "Presencial o híbrido",
      "Slides + recursos descargables",
      "Sesión de fotos opcional",
      "Difusión cruzada en redes",
    ],
  },
  {
    name: "Workshop Founder",
    duration: "2–4 h",
    audience: "20–60 estudiantes",
    desc: "Taller práctico: 95 rechazos, teoría de las mil flechas, primer MVP y pitch real frente al grupo.",
    items: [
      "Templates impresos y digitales",
      "Mentorías relámpago 1:1",
      "Pitch final con retroalimentación",
      "Material para profesor titular",
    ],
  },
  {
    name: "Semestre Founder",
    duration: "12 sesiones",
    audience: "Cohort de 15–30 alumnos",
    desc: "Programa completo de un semestre con currículo founder, mentores invitados, demo day y posible pipeline a fondos LATAM.",
    items: [
      "Currículo en 4 trimestres",
      "Faculty operador + académicos",
      "Casos reales con NDA",
      "Demo day con inversionistas",
    ],
  },
];

const TESTIMONIES = [
  {
    quote:
      "Gonzalo dejó al campus encendido. Más que una charla, fue una llamada a operar. Los alumnos siguen citándolo seis meses después.",
    author: "Coordinación Académica · CETI Tonalá",
  },
  {
    quote:
      "Era difícil encontrar un speaker con tracción operativa real y a la vez con vocación docente. Gonzalo es las dos cosas.",
    author: "Dirección de Innovación · IMEF Universitarios",
  },
  {
    quote:
      "El workshop convirtió ideas en pitches reales el mismo día. Tres equipos empezaron a operar al mes siguiente.",
    author: "Director de Carrera · Universidad privada LATAM",
  },
];

const FAQS = [
  {
    q: "¿Trabajan con universidades públicas y privadas por igual?",
    a: "Sí. Tenemos paquetes específicos con fees adaptados al sector educativo, tanto para públicas como privadas en México y LATAM.",
  },
  {
    q: "¿Pueden viajar fuera de Guadalajara?",
    a: "Sí. Cubrimos México, Estados Unidos, España y resto de LATAM. Travel y hospedaje se cotizan aparte según la sede.",
  },
  {
    q: "¿Qué materiales se quedan con la universidad?",
    a: "Slides, plantillas, libreta de trabajo del alumno, syllabus para el profesor titular y grabación editada para uso académico interno.",
  },
  {
    q: "¿Cuánto cuesta?",
    a: "Charla magistral desde MXN 80,000 + travel. Workshop completo desde MXN 180,000. Semestre founder con propuesta a la medida. Becas posibles para instituciones públicas con justificación.",
  },
];

const Educacion = () => {
  const jsonLd: any[] = [
    {
      "@context": "https://schema.org",
      "@type": "EducationalOccupationalProgram",
      name: "Programas educativos Gonzalo Acuña Nava",
      provider: {
        "@type": "Person",
        name: "Gonzalo Acuña Nava",
        url: SITE,
      },
      url: `${SITE}/educacion`,
      description:
        "Charlas magistrales, workshops founder y semestre completo para universidades y escuelas en LATAM, México, US y EU.",
      educationalProgramMode: ["onsite", "hybrid"],
      programType: "Speaker Series & Founder Curriculum",
    },
    {
      "@context": "https://schema.org",
      "@type": "Service",
      serviceType: "Programa académico de emprendimiento e innovación",
      provider: { "@type": "Person", name: "Gonzalo Acuña Nava", url: SITE },
      areaServed: ["MX", "US", "ES", "BR", "CO", "AR", "CL", "PE"],
      audience: { "@type": "EducationalAudience", educationalRole: "student" },
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Paquetes para universidades y escuelas",
        itemListElement: PACKAGES.map((p) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: p.name, description: p.desc },
        })),
      },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQS.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE },
        { "@type": "ListItem", position: 2, name: "Educación", item: `${SITE}/educacion` },
      ],
    },
  ];

  return (
    <main className="relative min-h-screen bg-background text-foreground">
      <SEO
        title="Educación · Charlas y workshops para universidades — Gonzalo Acuña Nava"
        description="Paquetes de charla magistral, workshop founder y semestre completo para universidades y escuelas en LATAM. Gonzalo Acuña Nava: CEO PropMatch, autor de Fracasa hasta ganar."
        path="/educacion"
        ogImage="https://gonzaloacuna.com/og-gonzalo.jpg"
        jsonLd={jsonLd}
      />
      <Nav />

      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16 sm:pt-40">
        <div className="aurora absolute inset-0 -z-10 opacity-60" />
        <div className="mx-auto grid max-w-content gap-10 px-6 md:grid-cols-[1.2fr_1fr] md:px-20">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/30 bg-gold/10 px-4 py-1.5 text-[10px] uppercase tracking-[0.28em] text-gold">
              <GraduationCap size={12} /> Para universidades y escuelas
            </span>
            <h1 className="mt-6 font-display text-4xl leading-[1.05] text-white sm:text-6xl">
              Educación founder con <span className="italic text-gold">cicatriz operativa</span>
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              Charlas magistrales, workshops y semestres completos diseñados para rectorías,
              direcciones de carrera y coordinaciones académicas que quieren formar founders reales — no
              estudiantes con plan de negocio en PDF.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="inline-flex items-center gap-2 rounded-full bg-gold px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-background hover:shadow-[0_0_30px_rgba(201,168,76,0.5)]"
              >
                Solicitar propuesta <ArrowRight size={13} />
              </Link>
              <a
                href="/bonus-guia-estudiante-ceti.pdf"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-white/85 transition hover:border-gold/50 hover:text-gold"
              >
                <Download size={12} /> Descargar guía estudiante
              </a>
            </div>
            <ul className="mt-8 grid grid-cols-2 gap-y-2 text-xs text-white/55 sm:max-w-md sm:text-sm">
              <li>· CETI Tonalá</li>
              <li>· IMEF Universitarios</li>
              <li>· Talent Land Plai</li>
              <li>· Universidades LATAM</li>
            </ul>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7 }}
            className="relative overflow-hidden rounded-3xl border border-white/10"
          >
            <img
              src={maestroCover}
              alt="Gonzalo Acuña dando clase en una universidad LATAM"
              loading="lazy"
              decoding="async"
              width={1536}
              height={864}
              className="h-full w-full object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Packages */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Tres paquetes · escala según tu institución</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-5xl">
            Cómo trabajamos con universidades
          </h2>
          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {PACKAGES.map((p, i) => (
              <motion.div
                key={p.name}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.08 }}
                className="flex flex-col rounded-3xl border border-white/10 bg-white/[0.02] p-7 transition-colors hover:border-gold/40"
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-display text-2xl text-white">{p.name}</h3>
                  <Sparkles size={16} className="text-gold/80" />
                </div>
                <p className="mt-1 text-[10px] uppercase tracking-[0.22em] text-gold/80">
                  {p.duration} · {p.audience}
                </p>
                <p className="mt-4 flex-1 text-sm leading-relaxed text-white/65">{p.desc}</p>
                <ul className="mt-5 space-y-2">
                  {p.items.map((it) => (
                    <li key={it} className="flex items-start gap-2 text-sm text-white/75">
                      <Check size={14} className="mt-0.5 shrink-0 text-gold" /> {it}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/booking"
                  className="mt-7 inline-flex items-center gap-2 self-start rounded-full border border-gold/40 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-gold transition hover:bg-gold/10"
                >
                  Solicitar <ArrowRight size={12} />
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonies */}
      <section className="border-t border-white/5 bg-white/[0.015] py-20">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Lo que dicen las instituciones</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-5xl">
            Confianza académica probada
          </h2>
          <div className="mt-10 grid gap-6 md:grid-cols-3">
            {TESTIMONIES.map((t) => (
              <figure
                key={t.author}
                className="rounded-3xl border border-white/10 bg-background/40 p-7 backdrop-blur"
              >
                <BookOpen size={18} className="text-gold/80" />
                <blockquote className="mt-4 text-sm leading-relaxed text-white/80">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-5 text-[11px] uppercase tracking-[0.22em] text-white/55">
                  {t.author}
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-3xl px-6 md:px-0">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Preguntas de coordinaciones académicas</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-4xl">Preguntas frecuentes</h2>
          <dl className="mt-8 divide-y divide-white/10">
            {FAQS.map((f) => (
              <div key={f.q} className="py-5">
                <dt className="font-display text-lg text-white">{f.q}</dt>
                <dd className="mt-2 text-sm leading-relaxed text-white/65">{f.a}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t border-gold/20 bg-gradient-to-b from-gold/[0.05] to-transparent py-20">
        <div className="mx-auto max-w-3xl px-6 text-center md:px-0">
          <Users size={28} className="mx-auto text-gold" />
          <h2 className="mt-5 font-display text-3xl text-white sm:text-5xl">
            Solicita propuesta para tu institución
          </h2>
          <p className="mt-4 text-base leading-relaxed text-white/65">
            Cuéntanos el contexto: número de alumnos, fechas tentativas, formato y presupuesto.
            Te responde una persona del equipo en menos de 48 horas hábiles.
          </p>
          <Link
            to="/booking"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-gold px-7 py-3.5 text-[11px] uppercase tracking-[0.22em] text-background hover:shadow-[0_0_40px_rgba(201,168,76,0.5)]"
          >
            Solicitar propuesta <ArrowRight size={13} />
          </Link>
        </div>
      </section>

      <SiteFooter />
    </main>
  );
};

export default Educacion;