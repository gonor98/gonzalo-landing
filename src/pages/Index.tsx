import { Nav } from "@/components/Nav";
import { HeroSection } from "@/components/HeroSection";
import { RisingLeaderSection } from "@/components/RisingLeaderSection";
import { AchievementsOverview } from "@/components/AchievementsOverview";
import { StickyScrollSection } from "@/components/StickyScrollSection";
import { SpeakerReel } from "@/components/SpeakerReel";
import { KeynoteSpeakerGrid } from "@/components/KeynoteSpeakerGrid";
import { MilestonesSection } from "@/components/MilestonesSection";
import { MasonryGrid } from "@/components/MasonryGrid";
import { KeynotesDetail } from "@/components/KeynotesDetail";
import { CTASection } from "@/components/CTASection";
import { ScrollProgressBar } from "@/components/ScrollProgressBar";
import { CustomCursor } from "@/components/CustomCursor";
import { VideoProvider } from "@/components/VideoContext";

const Index = () => {
  return (
    <VideoProvider>
      <main className="relative bg-background text-foreground">
        <ScrollProgressBar />
        <CustomCursor />
        <Nav />
        <HeroSection />
        <RisingLeaderSection />
        <AchievementsOverview />
        <StickyScrollSection />
        <SpeakerReel />
        <KeynoteSpeakerGrid />
        <MilestonesSection />
        <MasonryGrid />
        <KeynotesDetail />
        <CTASection />
      </main>
    </VideoProvider>
  );
};

export default Index;
