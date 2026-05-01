import { Nav } from "@/components/Nav";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { SEO, personJsonLd } from "@/components/SEO";
import { BookingSelector } from "@/components/BookingSelector";
import { SiteFooter } from "@/components/SiteFooter";

const Booking = () => {
  return (
    <main className="relative bg-background text-foreground">
      <SEO
        title="Reservar Keynote — Gonzalo Acuña Nava"
        description="Solicita disponibilidad de Gonzalo Acuña Nava para tu evento, conferencia o sesión corporativa. Atención en 48 horas hábiles para bureaus, organizadores y empresas."
        path="/booking"
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
