"use client";

import { motion } from "framer-motion";
import { LayoutGrid, Activity, Brain } from "lucide-react";

const LOGOS = ["BuildFast", "DataLayer", "Loopcast", "Hyperdrive", "Stackline", "Orbital"];

const PILLARS = [
  {
    icon: <LayoutGrid size={16} />,
    title: "Personal Workspace",
    body: "Each member has their own AI canvas. Work freely.",
  },
  {
    icon: <Activity size={16} />,
    title: "Team Feed",
    body: "Everything your team does appears here in real time.",
  },
  {
    icon: <Brain size={16} />,
    title: "Team AI",
    body: "Ask anything. Get real answers about your team.",
  },
];

export function SocialProof() {
  return (
    <section className="py-16">
      {/* The three pillars of Nebula OS */}
      <div className="mx-auto mb-16 grid max-w-5xl gap-10 px-5 md:grid-cols-3 md:px-10">
        {PILLARS.map((p, i) => (
          <motion.div
            key={p.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
          >
            <span className="mb-3 inline-block" style={{ color: "#7C3AED" }}>
              {p.icon}
            </span>
            <h3 className="mb-1.5 text-lg font-semibold text-white">{p.title}</h3>
            <p className="text-sm leading-relaxed" style={{ color: "#666" }}>
              {p.body}
            </p>
          </motion.div>
        ))}
      </div>
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 md:flex-row md:justify-center md:gap-12 md:px-10">
        <p className="whitespace-nowrap text-xs uppercase tracking-widest" style={{ color: "#444" }}>
          Trusted by founding teams from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {LOGOS.map((logo, i) => (
            <motion.span
              key={logo}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              data-cursor-hover
              className="cursor-default text-base font-semibold tracking-tight transition-colors duration-300 hover:text-white"
              style={{ color: "#333" }}
            >
              {logo}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
