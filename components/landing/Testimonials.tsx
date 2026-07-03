"use client";

import { motion } from "framer-motion";
import { L, SectionHeading, fadeUp } from "./landing-ui";

const TESTIMONIALS = [
  {
    quote:
      "We used to paste Claude outputs into WhatsApp. Now our whole team works on one canvas. Game changer.",
    name: "Rohan M.",
    role: "Co-founder at BuildFast",
    initial: "R",
    color: "#7C3AED",
  },
  {
    quote:
      "The shared AI context is insane. My CTO and I are finally working with the same information.",
    name: "Priya S.",
    role: "CEO at DataLayer",
    initial: "P",
    color: "#EC4899",
  },
  {
    quote:
      "Shipped our MVP 2 weeks faster because we stopped wasting time syncing AI outputs manually.",
    name: "Alex K.",
    role: "Founder at Loopcast",
    initial: "A",
    color: "#3B82F6",
  },
];

const LOGOS = ["BuildFast", "DataLayer", "Loopcast", "Hyperdrive", "Stackline", "Orbital"];

export function Testimonials() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading eyebrow="Social proof" title="Founding teams love Nebula." />
        <div className="grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              whileHover={{ scale: 1.01 }}
              className="flex flex-col justify-between rounded-xl border p-7"
              style={{ backgroundColor: L.surface, borderColor: L.border }}
            >
              <blockquote className="text-sm leading-relaxed text-white/90">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <span
                  className="flex h-9 w-9 items-center justify-center rounded-full text-xs font-bold text-white"
                  style={{ backgroundColor: t.color }}
                >
                  {t.initial}
                </span>
                <div>
                  <p className="text-sm font-medium text-white">{t.name}</p>
                  <p className="text-xs" style={{ color: L.text2 }}>
                    {t.role}
                  </p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>

        {/* Logo strip */}
        <motion.div {...fadeUp} className="mt-16 text-center">
          <p className="mb-6 text-xs uppercase tracking-widest" style={{ color: L.text3 }}>
            Trusted by teams from
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-4">
            {LOGOS.map((logo) => (
              <span
                key={logo}
                className="text-base font-semibold tracking-tight transition-colors hover:text-white/70"
                style={{ color: L.text3 }}
              >
                {logo}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
