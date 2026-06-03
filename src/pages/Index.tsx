import { lazy, Suspense } from "react";
import { Nav } from "@/components/Nav";
import { HeroSection } from "@/components/HeroSection";
import { InfiniteAuthorityMarquee } from "@/components/InfiniteAuthorityMarquee";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CustomCursor } from "@/components/CustomCursor";
import { SEO, personJsonLd } from "@/components/SEO";
import { SocialRail } from "@/components/SocialRail";
import { FloatingCTA } from "@/components/FloatingCTA";
import { videos as speakerVideos } from "@/lib/videos";
import { themes } from "@/lib/themes";

// Lazy-load every section below the fold so the initial Hero ships fast.
const RisingLeaderSection = lazy(() =>
  import("@/components/RisingLeaderSection").then((m) => ({ default: m.RisingLeaderSection }))
);
const AchievementsOverview = lazy(() =>
  import("@/components/AchievementsOverview").then((m) => ({ default: m.AchievementsOverview }))
);
const FrameworkFlechas = lazy(() =>
  import("@/components/FrameworkFlechas").then((m) => ({ default: m.FrameworkFlechas }))
);
const SpeakerReel = lazy(() =>
  import("@/components/SpeakerReel").then((m) => ({ default: m.SpeakerReel }))
);
const VentureStack = lazy(() =>
  import("@/components/VentureStack").then((m) => ({ default: m.VentureStack }))
);
const ThemesGrid = lazy(() =>
  import("@/components/ThemesGrid").then((m) => ({ default: m.ThemesGrid }))
);
const MilestonesSection = lazy(() =>
  import("@/components/MilestonesSection").then((m) => ({ default: m.MilestonesSection }))
);
const MasonryGrid = lazy(() =>
  import("@/components/MasonryGrid").then((m) => ({ default: m.MasonryGrid }))
);
const PodcastsSection = lazy(() =>
  import("@/components/PodcastsSection").then((m) => ({ default: m.PodcastsSection }))
);
const LeadCapture = lazy(() =>
  import("@/components/LeadCapture").then((m) => ({ default: m.LeadCapture }))
);
const CTASection = lazy(() =>
  import("@/components/CTASection").then((m) => ({ default: m.CTASection }))
);
const SiteFooter = lazy(() =>
  import("@/components/SiteFooter").then((m) => ({ default: m.SiteFooter }))
);

const SITE = "https://gonzaloacuna.com";

const videoJsonLd = speakerVideos.map((v) => ({
  "@context": "https://schema.org",
  "@type": "VideoObject",
  name: v.title,
  description: `${v.title} — ${v.context}. Keynote de Gonzalo Acuña Nava (CEO PropMatch).`,
  thumbnailUrl: [`https://img.youtube.com/vi/${v.id}/maxresdefault.jpg`],
  uploadDate: "2025-01-01",
  contentUrl: `https://www.youtube.com/watch?v=${v.id}`,
  embedUrl: `https://www.youtube.com/embed/${v.id}`,
  publisher: { "@type": "Person", name: "Gonzalo Acuña Nava", url: SITE },
  inLanguage: "es",
}));

const ventureOrgs = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CALLII",
    description: "Agentes de voz con IA para automatizar ventas, cobranza y atención. Fundada por Gonzalo Acuña Nava.",
    founder: { "@type": "Person", name: "Gonzalo Acuña Nava", url: SITE },
    industry: "Inteligencia Artificial / Voice AI",
    areaServed: "LATAM",
  },
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Finple",
    description: "Plataforma fintech de inclusión financiera con IA. Parte del ecosistema fundado por Gonzalo Acuña Nava.",
    founder: { "@type": "Person", name: "Gonzalo Acuña Nava", url: SITE },
    industry: "FinTech",
    areaServed: "LATAM",
  },
];

const speakingItemList = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Catálogo de keynotes — Gonzalo Acuña Nava",
  itemListOrder: "https://schema.org/ItemListOrderAscending",
  numberOfItems: themes.length,
  itemListElement: themes.slice(0, 33).map((t, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "CreativeWork",
      name: t.title,
      about: t.category,
      description: t.logline,
      author: { "@type": "Person", name: "Gonzalo Acuña Nava", url: SITE },
      url: `${SITE}/speaking#${t.id}`,
    },
  })),
};

const SectionFallback = () => (
  <div aria-hidden className="min-h-[60vh] w-full bg-background" />
);

const Index = () => {
  return (
    <main className="relative bg-background text-foreground">
      <SEO
        title="Gonzalo Acuña Nava — CEO PropMatch · Speaker PropTech & IA"
        description="CEO de un ecosistema de $200M (PropMatch · CALLII · Finple). Forbes 30U30 nominee, ganador Talent Land 2026. 200+ keynotes, 2.8M de audiencia global, $195M en LOIs."
        path="/"
        jsonLd={[personJsonLd, speakingItemList, ...ventureOrgs, ...videoJsonLd]}
        ogImage="https://storage.googleapis.com/gpt-engineer-file-uploads/MBD99GyTQSdZybfYIUXId9PrW6t2/social-images/social-1777519428256-Generated_Image_April_28,_2026_-_1_31AM.webp"
      />
      <ScrollProgressBar />
      <CustomCursor />
      <Nav />
      <SocialRail />
      <HeroSection />
      <InfiniteAuthorityMarquee />
      <Suspense fallback={<SectionFallback />}>
        <RisingLeaderSection />
        <AchievementsOverview />
        <FrameworkFlechas />
        <SpeakerReel />
        <VentureStack />
        <ThemesGrid compact />
        <LeadCapture />
        <MilestonesSection />
        <MasonryGrid />
        <PodcastsSection />
        <CTASection />
        <SiteFooter />
      </Suspense>
      <FloatingCTA />
    </main>
  );
};

export default Index;
