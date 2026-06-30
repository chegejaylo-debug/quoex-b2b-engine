"use client";

import SiteHeader from "@/app/components/SiteHeader";
import HeroSection from "@/app/components/HeroSection";
import ServicesSection from "@/app/components/ServicesSection";
import PortfolioSection from "@/app/components/PortfolioSection";
import TestimonialsSection from "@/app/components/TestimonialsSection";
import PricingSection from "@/app/components/PricingSection";
import AboutSection from "@/app/components/AboutSection";
import FAQSection from "@/app/components/FAQSection";
import ContactSection from "@/app/components/ContactSection";
import SiteFooter from "@/app/components/SiteFooter";
import AIAssistant from "@/app/components/AIAssistant";

export default function HomePage() {
  const scrollToContact = () => {
    const el = document.querySelector("#contact");
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#05060F] text-[#F0F0FF]">
      <SiteHeader />
      <main>
        <HeroSection onCTAClick={scrollToContact} />
        <ServicesSection />
        <PortfolioSection />
        <TestimonialsSection />
        <PricingSection onCTAClick={scrollToContact} />
        <AboutSection />
        <FAQSection />
        <ContactSection />
      </main>
      <SiteFooter />
      <AIAssistant />
    </div>
  );
}
