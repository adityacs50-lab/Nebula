"use client";

import { motion } from "framer-motion";
import { PlusCircle, Users, Sparkles } from "lucide-react";
import { L, SectionHeading } from "./landing-ui";

const STEPS = [
  {
    icon: <PlusCircle size={20} />,
    title: "Create a workspace",
    body: "One click. Your infinite canvas is ready before your coffee is.",
  },
  {
    icon: <Users size={20} />,
    title: "Invite your co-founders",
    body: "Share one link. They land on the canvas with cursors live.",
  },
  {
    icon: <Sparkles size={20} />,
    title: "Build together with AI",
    body: "Chat, code, flows, and images — with the AI seeing everything.",
  },
];

export function HowItWorks() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          eyebrow="How it works"
          title="From chaos to clarity in 3 steps."
        />
        <div className="relative grid gap-12 md:grid-cols-3 md:gap-6">
          {/* animated dotted connector */}
          <svg
            aria-hidden
            className="absolute left-[16%] right-[16%] top-7 hidden h-px w-[68%] md:block"
            preserveAspectRatio="none"
            viewBox="0 0 100 1"
          >
            <motion.line
              x1="0"
              y1="0.5"
              x2="100"
              y2="0.5"
              stroke="#7C3AED"
              strokeWidth="1.5"
              strokeDasharray="3 4"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 0.7 }}
              viewport={{ once: true }}
              transition={{ duration: 1.4, delay: 0.5, ease: "easeInOut" }}
            />
          </svg>

          {STEPS.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: 0.25 + i * 0.25, ease: "easeOut" }}
              className="relative text-center"
            >
              <div
                className="relative z-10 mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-xl text-white"
                style={{ background: L.gradient, boxShadow: L.glow }}
              >
                {step.icon}
              </div>
              <p className="mb-1 text-xs font-medium" style={{ color: L.primary }}>
                Step {i + 1}
              </p>
              <h3 className="mb-2 text-lg font-semibold text-white">
                {step.title}
              </h3>
              <p className="mx-auto max-w-[260px] text-sm leading-relaxed" style={{ color: L.text2 }}>
                {step.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
