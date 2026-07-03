"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Check, ChevronDown, Sparkles, ArrowRight } from "lucide-react";
import { L } from "./landing-ui";
import { Magnetic } from "./interactions";

const INCLUDED = [
  "Everything. No limits.",
  "All 6 AI block types",
  "Real-time multiplayer",
  "Shared AI context",
  "Unlimited workspaces",
  "Priority support",
];

const FAQ = [
  { q: "What happens after the free trial?", a: "After 14 days you move to the $49/month plan or your workspace goes read-only. Nothing is deleted — your canvas and history stay exactly where you left them." },
  { q: "Can I add more than 5 team members?", a: "The Team plan covers 5. Need more seats? Reach out and we'll set up a custom plan — flat pricing, never per-seat surprise math." },
  { q: "Which AI model does Nebula use?", a: "Google's Gemini family — Flash for chat and code, image models for visuals — with your full canvas context injected into every call." },
  { q: "Is my data private?", a: "Yes. Workspaces are protected by row-level security; only invited members can see them. Canvas content is sent to the AI provider only when you make a request, never to train models." },
  { q: "Can I cancel anytime?", a: "Anytime, one click. You keep access until the end of the billing period and can export your work first." },
];

export function Pricing() {
  return (
    <section id="pricing" className="relative py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-5 md:px-10">
        <p className="mb-3 text-center text-sm" style={{ color: "#666" }}>
          Simple. Transparent. Fair.
        </p>
        <h2 className="mb-16 text-center text-[clamp(2rem,4.5vw,3rem)] font-thin tracking-tight text-white">
          One plan. <span className="font-bold">Everything included.</span>
        </h2>

        <motion.div
          initial={{ opacity: 0, y: -30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 120, damping: 16 }}
          className="mx-auto max-w-[460px]"
        >
          {/* rotating gradient border wrapper */}
          <div
            className="relative rounded-xl p-px"
            style={{ boxShadow: L.glow }}
          >
            <div
              aria-hidden
              className="nebula-rotating-border absolute inset-0 rounded-xl"
              style={{
                background:
                  "conic-gradient(from var(--nebula-angle), transparent 0deg, #7C3AED 90deg, #3B82F6 180deg, transparent 300deg)",
              }}
            />
            <div
              className="relative rounded-xl p-8"
              style={{ backgroundColor: "#0E0E0E" }}
            >
              <div className="mb-6 flex items-center gap-2 text-sm font-semibold text-white">
                <Sparkles size={14} style={{ color: L.primary }} />
                Nebula Team
              </div>
              <div className="flex items-baseline gap-2">
                <span className="text-6xl font-bold tracking-tight text-white">$49</span>
                <span style={{ color: "#666" }}>per month</span>
              </div>
              <p className="mt-1 text-sm" style={{ color: "#666" }}>
                up to 5 members
              </p>

              <ul className="mb-8 mt-7 space-y-3">
                {INCLUDED.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-sm">
                    <Check size={15} className="mt-0.5 shrink-0" style={{ color: "#10B981" }} />
                    <span className="text-white/90">{item}</span>
                  </li>
                ))}
              </ul>

              <Magnetic strength={0.25}>
                <Link href="/auth/signup" className="block">
                  <span
                    className="flex w-full items-center justify-center gap-2 rounded-full py-3.5 text-sm font-semibold text-white"
                    style={{ background: L.gradient, boxShadow: "0 0 26px rgba(124,58,237,0.3)" }}
                  >
                    Start free trial
                    <ArrowRight size={15} />
                  </span>
                </Link>
              </Magnetic>
              <p className="mt-4 text-center text-xs" style={{ color: "#444" }}>
                14-day free trial · No card required
              </p>
            </div>
          </div>
        </motion.div>

        {/* FAQ */}
        <div className="mx-auto mt-20 max-w-2xl">
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
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        data-cursor-hover
        className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
      >
        <span className="text-sm font-medium text-white">{q}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          style={{ color: "#666" }}
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
            <p className="px-6 pb-5 text-sm leading-relaxed" style={{ color: "#666" }}>
              {a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
