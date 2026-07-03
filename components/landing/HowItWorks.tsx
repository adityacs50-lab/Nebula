"use client";

import { motion } from "framer-motion";
import { L } from "./landing-ui";

const STEPS = [
  { n: "01", title: "Create a workspace", body: "One click. Your infinite canvas is ready before your coffee is." },
  { n: "02", title: "Invite your co-founders", body: "Share one link. They land on the canvas with cursors live." },
  { n: "03", title: "Build together with AI", body: "Chat, code, flows, images — with the AI seeing everything." },
];

export function HowItWorks() {
  return (
    <section className="relative py-28 md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-20 text-[clamp(2rem,4.5vw,3rem)] font-thin tracking-tight text-white"
        >
          From chaos to clarity in{" "}
          <span className="font-bold">3 steps.</span>
        </motion.h2>

        <div className="relative grid gap-14 md:grid-cols-3 md:gap-8">
          {/* animated connector line */}
          <svg
            aria-hidden
            className="absolute left-[8%] right-[8%] top-3 hidden h-1 w-[84%] md:block"
            preserveAspectRatio="none"
            viewBox="0 0 100 1"
          >
            <motion.line
              x1="0" y1="0.5" x2="100" y2="0.5"
              stroke="#7C3AED" strokeWidth="1" strokeDasharray="2 3"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.6 }}
              viewport={{ once: true }}
              transition={{ duration: 1.6, delay: 0.4, ease: "easeInOut" }}
            />
          </svg>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.2 + i * 0.25, ease: "easeOut" }}
              className="relative"
            >
              <span
                className="relative z-10 mb-6 block h-6 w-6 rounded-full"
                style={{ background: L.gradient, boxShadow: L.glow }}
              />
              <p className="mb-2 font-mono text-sm" style={{ color: L.primary }}>
                {step.n}
              </p>
              <h3 className="mb-2 text-xl font-bold text-white">{step.title}</h3>
              <p className="max-w-[260px] text-sm leading-relaxed" style={{ color: "#666" }}>
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
