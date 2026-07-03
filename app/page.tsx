import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Problem } from "@/components/landing/Problem";
import { Solution } from "@/components/landing/Solution";
import { Demo } from "@/components/landing/Demo";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <div className="min-h-screen overflow-x-clip bg-[#0A0A0A] font-sans">
        <Navbar />
        <main>
          <Hero />
          <Problem />
          <Solution />
          <Demo />
          <Features />
          <HowItWorks />
          <Testimonials />
          <Pricing />
          <FinalCTA />
        </main>
        <Footer />
      </div>
    </SmoothScroll>
  );
}
