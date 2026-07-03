"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { GradientButton, L } from "./landing-ui";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-32 md:py-40">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[1100px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(124,58,237,0.22), rgba(59,130,246,0.06) 55%, transparent 80%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl px-5 text-center md:px-6"
      >
        <h2 className="text-4xl font-bold leading-tight tracking-tight text-white md:text-6xl">
          Stop working in AI silos.
        </h2>
        <p className="mx-auto mt-5 max-w-md text-lg" style={{ color: L.text2 }}>
          Your whole team. One canvas. One AI brain.
        </p>
        <div className="mt-10">
          <Link href="/auth/signup">
            <GradientButton className="!px-10 !py-4 !text-base">
              Start building together
              <ArrowRight size={17} />
            </GradientButton>
          </Link>
        </div>
        <p className="mt-5 text-xs" style={{ color: L.text3 }}>
          Free 14-day trial. No credit card. Setup in 2 minutes.
        </p>
      </motion.div>
    </section>
  );
}
