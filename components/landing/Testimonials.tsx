"use client";

import { motion } from "framer-motion";
import { L } from "./landing-ui";

export function Testimonials() {
  return (
    <section className="relative overflow-hidden py-28 md:py-36">
      <div className="mx-auto max-w-5xl px-5 md:px-10">
        {/* watermark quote */}
        <span
          aria-hidden
          className="pointer-events-none absolute -top-10 left-0 select-none font-serif text-[20rem] leading-none"
          style={{ color: "rgba(124,58,237,0.05)" }}
        >
          &ldquo;
        </span>

        <motion.blockquote
          initial={{ opacity: 0, scale: 0.98, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="relative"
        >
          <p className="text-[clamp(1.75rem,4vw,3rem)] font-thin leading-tight tracking-tight text-white">
            We used to paste Claude outputs into WhatsApp all day.{" "}
            <span className="font-normal">Nebula changed everything.</span>
          </p>
          <footer className="mt-8 text-sm" style={{ color: "#666" }}>
            — Rohan M., Co-founder at BuildFast
          </footer>
        </motion.blockquote>

        <div className="mt-20 grid gap-12 border-t pt-12 md:grid-cols-2" style={{ borderColor: L.border }}>
          {[
            {
              quote:
                "The shared AI context is the whole thing. My CTO and I finally work off the same information.",
              name: "Priya S., CEO at DataLayer",
            },
            {
              quote:
                "Shipped our MVP two weeks faster because we stopped syncing AI outputs by hand.",
              name: "Alex K., Founder at Loopcast",
            },
          ].map((t, i) => (
            <motion.blockquote
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.12 }}
            >
              <p className="text-lg leading-relaxed text-white/85">{t.quote}</p>
              <footer className="mt-4 text-sm" style={{ color: "#666" }}>
                — {t.name}
              </footer>
            </motion.blockquote>
          ))}
        </div>
      </div>
    </section>
  );
}
