import { PageLayout } from "@/components/layout/PageLayout";
import { HeroSection } from "@/components/home/HeroSection";
import { ServicesPreview } from "@/components/home/ServicesPreview";
import { TrainingPreview } from "@/components/home/TrainingPreview";
import { CTASection } from "@/components/home/CTASection";

const Index = () => {
  return (
    <PageLayout>
      <HeroSection />
      <ServicesPreview />
      <TrainingPreview />
      <CTASection />
    </PageLayout>
  );
};

export default Index;
