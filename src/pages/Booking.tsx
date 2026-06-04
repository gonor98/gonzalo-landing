import { Nav } from "@/components/Nav";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { SEO, personJsonLd } from "@/components/SEO";
import { BookingSelector } from "@/components/BookingSelector";
import { SiteFooter } from "@/components/SiteFooter";
import { SpeakerReel } from "@/components/SpeakerReel";
import { Globe2, Languages, Clock3 } from "lucide-react";

const FEES = [
  {
    region: "LATAM",
    keynote45: "MXN 180,000",
    keynote60: "MXN 240,000",
    keynote90: "MXN 320,000",
    masterclass: "MXN 480,000",
    notes: "México, Colombia, Argentina, Chile, Perú",
  },
  {
    region: "US & Canada",
    keynote45: "USD 18,000",
    keynote60: "USD 24,000",
    keynote90: "USD 32,000",
    masterclass: "USD 48,000",
    notes: "NYC, Miami, Austin, SF, Toronto",
  },
  {
    region: "EU & UK",
    keynote45: "EUR 18,000",
    keynote60: "EUR 24,000",
    keynote90: "EUR 32,000",
    masterclass: "EUR 48,000",
    notes: "Madrid, Lisboa, Berlín, Londres",
  },
];

const Booking = () => {
  return (
    <main className="relative bg-background text-foreground">
      <SEO
        title="Reservar Keynote — Gonzalo Acuña Nava"
        description="Solicita disponibilidad de Gonzalo Acuña Nava para tu evento, conferencia o sesión corporativa. Atención en 48 horas hábiles para bureaus, organizadores y empresas."
        path="/booking"
        ogImage="https://gonzaloacuna.com/og-gonzalo.jpg"
        jsonLd={personJsonLd}
      />
      <ScrollProgressBar />
      <Nav />

      <section className="relative overflow-hidden pt-40 pb-12 md:pt-52 md:pb-16">
        <div className="absolute inset-0 radial-gold opacity-60" />
        <div className="relative mx-auto max-w-content px-6 md:px-20">
          <p className="text-[11px] uppercase tracking-[0.32em] text-gold">Booking · Q2–Q4 2026</p>
          <h1 className="mt-4 font-display text-5xl leading-[0.98] text-white md:text-7xl">
            Reservar <span className="italic text-gold">Keynote</span>
          </h1>
          <p className="mt-6 max-w-2xl text-base text-white/65 md:text-lg">
            Tres rutas según quién organiza. Recibirás respuesta del equipo en menos de 48 horas hábiles
            con disponibilidad, fee y rider técnico.
          </p>
          <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.22em] text-white/65">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <Languages size={12} className="text-gold" /> Español · Inglés · Portugués conversacional
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <Clock3 size={12} className="text-gold" /> 45 · 60 · 90 min · Masterclass 2h
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5">
              <Globe2 size={12} className="text-gold" /> LATAM · US · EU
            </span>
          </div>
        </div>
      </section>

      {/* Reel above the fold */}
      <SpeakerReel />

      {/* Fee table by region */}
      <section className="border-t border-white/5 py-20">
        <div className="mx-auto max-w-content px-6 md:px-20">
          <p className="text-[10px] uppercase tracking-[0.28em] text-gold">Tarifas referenciales · Q2–Q4 2026</p>
          <h2 className="mt-3 font-display text-3xl text-white sm:text-5xl">
            Fee por región y formato
          </h2>
          <p className="mt-4 max-w-2xl text-sm text-white/60">
            Las tarifas listadas son referenciales y no incluyen viáticos, hospedaje ni impuestos.
            Para universidades, instituciones públicas y ONGs hay propuestas adaptadas vía {" "}
            <a href="/educacion" className="text-gold hover:underline">/educacion</a>.
          </p>

          <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10">
            <table className="w-full min-w-[640px] text-left text-sm">
              <thead className="bg-white/[0.04] text-[10px] uppercase tracking-[0.22em] text-white/55">
                <tr>
                  <th className="px-5 py-4">Región</th>
                  <th className="px-5 py-4">Keynote 45 min</th>
                  <th className="px-5 py-4">Keynote 60 min</th>
                  <th className="px-5 py-4">Keynote 90 min</th>
                  <th className="px-5 py-4">Masterclass 2h</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {FEES.map((f) => (
                  <tr key={f.region} className="text-white/85">
                    <td className="px-5 py-5">
                      <p className="font-display text-base text-white">{f.region}</p>
                      <p className="mt-1 text-[11px] text-white/45">{f.notes}</p>
                    </td>
                    <td className="px-5 py-5 text-gold">{f.keynote45}</td>
                    <td className="px-5 py-5 text-gold">{f.keynote60}</td>
                    <td className="px-5 py-5 text-gold">{f.keynote90}</td>
                    <td className="px-5 py-5 text-gold">{f.masterclass}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-4 text-[11px] uppercase tracking-[0.22em] text-white/35">
            Idiomas disponibles: Español (nativo) · Inglés (keynote-level) · Portugués (conversacional)
          </p>
        </div>
      </section>

      <section className="bg-background pb-32 pt-4">
        <div className="px-6 md:px-20">
          <BookingSelector />
        </div>
      </section>
      <SiteFooter />
    </main>
  );
};

export default Booking;
