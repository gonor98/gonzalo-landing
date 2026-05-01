import { Nav } from "@/components/Nav";
import { HeroSection } from "@/components/HeroSection";
import { RisingLeaderSection } from "@/components/RisingLeaderSection";
import { AchievementsOverview } from "@/components/AchievementsOverview";
import { StickyScrollSection } from "@/components/StickyScrollSection";
import { SpeakerReel } from "@/components/SpeakerReel";
import { VentureStack } from "@/components/VentureStack";
import { ThemesGrid } from "@/components/ThemesGrid";
import { MilestonesSection } from "@/components/MilestonesSection";
import { MasonryGrid } from "@/components/MasonryGrid";
import { CTASection } from "@/components/CTASection";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CustomCursor } from "@/components/CustomCursor";
import { SEO, personJsonLd } from "@/components/SEO";
import { SocialRail } from "@/components/SocialRail";
import { SiteFooter } from "@/components/SiteFooter";

const Index = () => {
  return (
    <main className="relative bg-background text-foreground">
      <SEO
        title="Gonzalo Acuña Nava — CEO PropMatch · Speaker PropTech & IA"
        description="CEO de un ecosistema de $200M (PropMatch · CALLII · Finple). Forbes 30U30 nominee, ganador Talent Land 2026. 200+ keynotes, 2.8M de audiencia global, $195M en LOIs."
        path="/"
        jsonLd={personJsonLd}
        ogImage="https://storage.googleapis.com/gpt-engineer-file-uploads/MBD99GyTQSdZybfYIUXId9PrW6t2/social-images/social-1777519428256-Generated_Image_April_28,_2026_-_1_31AM.webp"
      />
      <ScrollProgressBar />
      <CustomCursor />
      <Nav />
      <SocialRail />
      <HeroSection />
      <RisingLeaderSection />
      <AchievementsOverview />
      <StickyScrollSection />
      <SpeakerReel />
      <VentureStack />
      <ThemesGrid compact />
      <MilestonesSection />
      <MasonryGrid />
      <CTASection />
      <SiteFooter />
    </main>
  );
};

export default Index;
