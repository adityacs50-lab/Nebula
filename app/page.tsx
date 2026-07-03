import { SmoothScroll } from "@/components/landing/SmoothScroll";
import { CustomCursor } from "@/components/landing/CustomCursor";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Ticker } from "@/components/landing/Ticker";
import { SocialProof } from "@/components/landing/SocialProof";
import { Problem } from "@/components/landing/Problem";
import { Product } from "@/components/landing/Product";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Testimonials } from "@/components/landing/Testimonials";
import { Pricing } from "@/components/landing/Pricing";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { Footer } from "@/components/landing/Footer";

export default function LandingPage() {
  return (
    <SmoothScroll>
      <CustomCursor />
      <div className="min-h-screen overflow-x-clip bg-[#0A0A0A] font-sans">
        <Navbar />
        <main>
          <Hero />
          <Ticker />
          <SocialProof />
          <Problem />
          <Product />
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
