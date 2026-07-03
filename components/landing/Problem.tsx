"use client";

import { motion } from "framer-motion";
import { GitFork, MessagesSquare, Unlink } from "lucide-react";
import { L, SectionHeading } from "./landing-ui";

const PROBLEMS = [
  {
    icon: <GitFork size={20} />,
    title: "3 founders. 3 AI tools. 0 shared context.",
    body: "You're on Claude. Co-founder on ChatGPT. Third on Gemini. Every AI session is isolated.",
  },
  {
    icon: <MessagesSquare size={20} />,
    title: "WhatsApp is not a knowledge base.",
    body: "Pasting AI outputs into group chats. Copy-pasting between tabs. Losing context every day.",
  },
  {
    icon: <Unlink size={20} />,
    title: "Decisions made on different AI outputs.",
    body: "Your AI said one thing. Theirs said another. Nobody knows why you're misaligned.",
  },
];

export function Problem() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          eyebrow="The problem"
          title="AI made us productive individually."
          subtitle="It made founding teams less aligned."
        />
        <div className="grid gap-5 md:grid-cols-3">
          {PROBLEMS.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.1, ease: "easeOut" }}
              className="rounded-xl border p-7"
              style={{
                backgroundColor: L.surface,
                borderColor: L.border,
                borderLeft: "3px solid rgba(239,68,68,0.6)",
              }}
            >
              <div
                className="mb-5 inline-flex rounded-xl border p-2.5 text-[#EF4444]"
                style={{ borderColor: "rgba(239,68,68,0.25)", backgroundColor: "rgba(239,68,68,0.08)" }}
              >
                {p.icon}
              </div>
              <h3 className="mb-2.5 text-lg font-semibold text-white">
                {p.title}
              </h3>
              <p className="text-sm leading-relaxed" style={{ color: L.text2 }}>
                {p.body}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
