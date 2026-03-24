import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import PlansSection from "@/components/PlansSection";
import BenefitsSection from "@/components/BenefitsSection";
import ServicesSection from "@/components/ServicesSection";
import ChipInstructionsSection from "@/components/ChipInstructionsSection";
import CoverageSection from "@/components/CoverageSection";
import SelfServiceSection from "@/components/SelfServiceSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <StatsSection />
      <PlansSection />
      <BenefitsSection />
      <ServicesSection />
      <ChipInstructionsSection />
      <CoverageSection />
      <SelfServiceSection />
      <ContactSection />
      <Footer />
      <WhatsAppButton />
    </div>
  );
};

export default Index;
