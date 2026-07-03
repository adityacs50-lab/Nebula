"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Code2,
  Image as ImageIcon,
  GitBranch,
  Plug,
  Network,
} from "lucide-react";
import { L, SectionHeading } from "./landing-ui";

const FEATURES = [
  {
    icon: <MessageSquare size={18} />,
    color: "#7C3AED",
    title: "AI Chat",
    body: "Ask anything. Everyone sees the answer. AI remembers the full conversation history of your team.",
  },
  {
    icon: <Code2 size={18} />,
    color: "#3B82F6",
    title: "Generate Code",
    body: "Describe what you need. Get production-ready code. In Python, TypeScript, Rust, Go — any language.",
  },
  {
    icon: <ImageIcon size={18} />,
    color: "#EC4899",
    title: "AI Image",
    body: "Describe a visual. Generate it instantly. Product mockups, diagrams, marketing assets — all on canvas.",
  },
  {
    icon: <GitBranch size={18} />,
    color: "#F59E0B",
    title: "User Flow",
    body: "Map your product flow visually. Drag nodes, connect steps, share with your team instantly.",
  },
  {
    icon: <Plug size={18} />,
    color: "#10B981",
    title: "API Integration",
    body: "Generate, test, and document API integrations. TypeScript-first, copy-paste ready.",
  },
  {
    icon: <Network size={18} />,
    color: "#06B6D4",
    title: "Mind Map",
    body: "Brainstorm as a team. AI clusters your ideas. Connections emerge automatically.",
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 h-[420px] w-[820px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 0%, rgba(124,58,237,0.09), transparent 75%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          eyebrow="Features"
          title="Every tool your team needs. In one place."
        />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.5, delay: i * 0.05, ease: "easeOut" }}
              whileHover={{ scale: 1.02, y: -4 }}
              className="group rounded-xl border p-7 transition-shadow duration-300"
              style={{
                backgroundColor: L.surface,
                borderColor: L.border,
                borderLeft: `3px solid ${f.color}`,
              }}
            >
              <div
                className="mb-5 inline-flex rounded-xl p-2.5 transition-shadow duration-300"
                style={{
                  color: f.color,
                  backgroundColor: `${f.color}14`,
                  boxShadow: `0 0 0px ${f.color}00`,
                }}
              >
                {f.icon}
              </div>
              <h3 className="mb-2.5 text-lg font-semibold text-white">
                {f.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: L.text2 }}>
                {f.body}
              </p>
              <span
                aria-hidden
                className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                style={{ boxShadow: `0 0 32px ${f.color}22 inset` }}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
