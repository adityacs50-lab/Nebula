"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { GradientButton, L, SectionHeading } from "./landing-ui";

const INCLUDED = [
  "Unlimited AI blocks",
  "Real-time multiplayer canvas",
  "Shared AI context across team",
  "All 6 block types",
  "Unlimited workspaces",
  "Invite links",
  "Priority support",
];

const FAQ = [
  {
    q: "What happens after the free trial?",
    a: "After 14 days you pick up the $49/month plan or your workspace becomes read-only. Nothing is deleted — your canvas, blocks, and history stay exactly where you left them.",
  },
  {
    q: "Can I add more than 5 team members?",
    a: "The Team plan covers 5 members. Need more seats? Reach out and we'll set up a custom plan — pricing stays flat and predictable, never per-seat surprise math.",
  },
  {
    q: "Which AI model does Nebula use?",
    a: "Nebula runs on Google's Gemini family — Gemini Flash for chat and code, and Gemini image models for visuals — with the full canvas context injected into every call.",
  },
  {
    q: "Is my data private?",
    a: "Yes. Your workspaces are protected by row-level security — only invited members can see them. Canvas content is sent to the AI provider only when you make a request, and never used to train models.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Anytime, one click, no emails to support. You keep access until the end of your billing period and can export your work before you go.",
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28">
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-20 h-[420px] w-[680px] -translate-x-1/2"
        style={{
          background:
            "radial-gradient(50% 50% at 50% 50%, rgba(124,58,237,0.12), transparent 75%)",
        }}
      />
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <SectionHeading
          eyebrow="Pricing"
          title="Simple pricing. No surprises."
          subtitle="One plan. Everything included. Cancel anytime."
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="mx-auto w-full max-w-[480px] rounded-xl border p-8"
          style={{
            backgroundColor: L.surface,
            borderColor: "rgba(124,58,237,0.45)",
            boxShadow: L.glow,
          }}
        >
          <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-white">
            <Sparkles size={14} style={{ color: L.primary }} />
            Nebula Team
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-6xl font-bold tracking-tight text-white">$49</span>
            <span style={{ color: L.text2 }}>/ month</span>
          </div>
          <p className="mt-1 text-sm" style={{ color: L.text2 }}>
            per team · up to 5 members
          </p>

          <ul className="mb-8 mt-7 space-y-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm">
                <Check size={15} className="mt-0.5 shrink-0" style={{ color: "#10B981" }} />
                <span className="text-white/90">{item}</span>
              </li>
            ))}
          </ul>

          <Link href="/auth/signup" className="block">
            <GradientButton className="w-full !py-3.5 !text-base">
              Start free trial
              <ArrowRight size={16} />
            </GradientButton>
          </Link>
          <p className="mt-4 text-center text-xs" style={{ color: L.text3 }}>
            No credit card required · 14-day free trial
          </p>
        </motion.div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
          <motion.h3
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-6 text-center text-xl font-semibold text-white"
          >
            Frequently asked questions
          </motion.h3>
          <div className="divide-y rounded-xl border" style={{ borderColor: L.border, backgroundColor: L.surface }}>
            {FAQ.map((item) => (
              <FaqRow key={item.q} q={item.q} a={item.a} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FaqRow({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ borderColor: L.border }}>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: L.text2 }}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: L.text2 }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
