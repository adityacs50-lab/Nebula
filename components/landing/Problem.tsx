"use client";

import { motion } from "framer-motion";
import { L } from "./landing-ui";

const STATEMENTS = [
  {
    n: "01",
    lead: "You're on Claude. Co-founder on ChatGPT.",
    sub: "Nobody knows what the AI told who.",
  },
  {
    n: "02",
    lead: "Decisions made on different AI context.",
    sub: "Misalignment nobody can explain.",
  },
  {
    n: "03",
    lead: "WhatsApp group chats full of pasted AI outputs.",
    sub: "Every day. Every project.",
  },
];

export function Problem() {
  return (
    <section className="relative py-28 md:py-36">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="grid gap-14 md:grid-cols-[1fr_1fr] md:gap-20">
          {/* Left: editorial statement */}
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="text-[clamp(2.25rem,5vw,3.5rem)] font-thin leading-[1.05] tracking-tight text-white"
          >
            Your team is
            <br />
            working in{" "}
            <span
              className="bg-clip-text font-normal text-transparent"
              style={{ backgroundImage: L.gradient }}
            >
              AI silos.
            </span>
          </motion.h2>

          {/* Right: numbered statements */}
          <div className="flex flex-col justify-center gap-8">
            {STATEMENTS.map((s, i) => (
              <motion.div
                key={s.n}
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: "easeOut" }}
                className="flex gap-5 border-t pt-6"
                style={{ borderColor: L.border }}
              >
                <span className="shrink-0 font-mono text-sm" style={{ color: L.primary }}>
                  {s.n}
                </span>
                <div>
                  <p className="text-base text-white/90">{s.lead}</p>
                  <p className="mt-1 text-sm" style={{ color: "#666" }}>
                    {s.sub}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* diagonal purple divider */}
      <div
        aria-hidden
        className="mt-24 h-px w-full origin-left -rotate-1 md:mt-32"
        style={{ background: "linear-gradient(90deg, transparent, rgba(124,58,237,0.5), transparent)" }}
      />
    </section>
  );
}
