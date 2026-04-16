import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import BannersSection from "@/components/BannersSection";
import StatsSection from "@/components/StatsSection";
import PlansSection from "@/components/PlansSection";
import QuickActionsBar from "@/components/QuickActionsBar";
import ServicesSection from "@/components/ServicesSection";
import BenefitsSection from "@/components/BenefitsSection";
import ChipInstructionsSection from "@/components/ChipInstructionsSection";
import CoverageSection from "@/components/CoverageSection";
import SelfServiceSection from "@/components/SelfServiceSection";
import TestemunhosSection from "@/components/TestemunhosSection";
import ContactSection from "@/components/ContactSection";
import Footer from "@/components/Footer";
import WhatsAppButton from "@/components/WhatsAppButton";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main id="main-content">
        <HeroSection />
        <BannersSection />
        <StatsSection />
        <PlansSection />
        <QuickActionsBar />
        <ServicesSection />
        <BenefitsSection />
        <ChipInstructionsSection />
        <CoverageSection />
        <SelfServiceSection />
        <TestemunhosSection />
        <ContactSection />
      </main>
      <Footer />
      <WhatsAppButton />
      <CookieConsent />
    </div>
  );
};

export default Index;
