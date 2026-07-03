"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { L } from "./landing-ui";
import { Magnetic } from "./interactions";

export function FinalCTA() {
  return (
    <section className="relative overflow-hidden py-36 md:py-48">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 h-[600px] w-[1100px] -translate-x-1/2 -translate-y-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(124,58,237,0.22), rgba(59,130,246,0.05) 55%, transparent 80%)",
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative mx-auto max-w-3xl px-5 text-center md:px-10"
      >
        <h2 className="text-[clamp(2.75rem,7vw,5rem)] font-thin leading-[0.98] tracking-tight text-white">
          Stop working
          <br />
          <span className="font-bold">in AI silos.</span>
        </h2>
        <p className="mx-auto mt-6 max-w-md text-lg" style={{ color: "#666" }}>
          Your whole team. One canvas. One AI brain.
        </p>
        <div className="mt-12">
          <Magnetic strength={0.35}>
            <Link href="/auth/signup">
              <span
                className="animate-pulse-glow inline-flex items-center gap-2.5 rounded-full px-12 py-4.5 text-base font-semibold text-white"
                style={{ background: L.gradient }}
              >
                Start building together
                <ArrowRight size={18} />
              </span>
            </Link>
          </Magnetic>
        </div>
        <p className="mt-6 text-xs" style={{ color: "#444" }}>
          Free 14-day trial · No credit card · 2 minute setup
        </p>
      </motion.div>
    </section>
  );
}
