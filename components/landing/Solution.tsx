"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, MessageSquare, Code2, GitBranch, Sparkles } from "lucide-react";
import { L } from "./landing-ui";

/**
 * Pinned, scrubbed split-screen reveal: the chaotic tab/chat mess fades
 * out on the left while the unified Nebula canvas fades in on the right.
 */
export function Solution() {
  const section = useRef<HTMLElement>(null);
  const chaos = useRef<HTMLDivElement>(null);
  const clean = useRef<HTMLDivElement>(null);
  const divider = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section.current,
          start: "top top",
          end: "+=120%",
          scrub: 0.6,
          pin: true,
        },
      });
      tl.fromTo(
        chaos.current,
        { opacity: 1, x: 0, rotate: 0 },
        { opacity: 0.12, x: -48, rotate: -2, ease: "none" },
        0,
      )
        .fromTo(
          clean.current,
          { opacity: 0.15, x: 48, scale: 0.96 },
          { opacity: 1, x: 0, scale: 1, ease: "none" },
          0,
        )
        .fromTo(
          divider.current,
          { opacity: 0.25 },
          { opacity: 1, ease: "none" },
          0,
        );
      return () => tl.scrollTrigger?.kill();
    });

    return () => mm.revert();
  }, []);

  return (
    <section ref={section} className="relative overflow-hidden py-28 md:min-h-screen md:py-32">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <h2 className="mx-auto mb-16 max-w-3xl text-center text-4xl font-bold tracking-tight text-white md:mb-20 md:text-6xl">
          One canvas. One AI.{" "}
          <span
            className="bg-clip-text text-transparent"
            style={{ backgroundImage: L.gradient }}
          >
            Whole team in sync.
          </span>
        </h2>

        <div className="relative grid items-center gap-10 md:grid-cols-[1fr_auto_1fr]">
          {/* Chaos */}
          <div ref={chaos} className="space-y-3">
            {[
              { app: "ChatGPT — Tab 1 of 14", msg: "…as an AI, here is a 12-step framework…" },
              { app: "Claude — co-founder's laptop", msg: "…actually recommends the opposite approach…" },
              { app: "Gemini — third tab, third answer", msg: "…have you considered pivoting entirely…" },
              { app: "WhatsApp — Founders 🚫", msg: "wait which AI said that?? paste it again" },
            ].map((t) => (
              <div
                key={t.app}
                className="rounded-xl border p-4"
                style={{ borderColor: L.border, backgroundColor: L.surface }}
              >
                <p className="mb-1 text-[10px] font-medium uppercase tracking-wide text-[#EF4444]/80">
                  {t.app}
                </p>
                <p className="truncate text-xs" style={{ color: L.text2 }}>
                  {t.msg}
                </p>
              </div>
            ))}
            <p className="pt-1 text-center text-xs" style={{ color: L.text3 }}>
              Before: four sources of truth, zero alignment
            </p>
          </div>

          {/* Divider */}
          <div ref={divider} className="hidden flex-col items-center gap-3 md:flex">
            <span className="h-24 w-px" style={{ background: L.gradient }} />
            <span
              className="flex h-10 w-10 items-center justify-center rounded-full text-white"
              style={{ background: L.gradient, boxShadow: L.glow }}
            >
              <ArrowRight size={16} />
            </span>
            <span className="h-24 w-px" style={{ background: L.gradient }} />
          </div>

          {/* Clean */}
          <div ref={clean}>
            <div
              className="relative overflow-hidden rounded-xl border"
              style={{
                borderColor: "rgba(124,58,237,0.4)",
                backgroundColor: L.surface,
                boxShadow: L.glow,
              }}
            >
              <div
                className="flex items-center gap-2 border-b px-4 py-2.5 text-xs font-medium text-white"
                style={{ borderColor: L.border }}
              >
                <Sparkles size={12} style={{ color: L.primary }} />
                Project Nebula — everyone&apos;s here
              </div>
              <div
                className="relative space-y-3 p-5"
                style={{
                  backgroundImage: "radial-gradient(#242424 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              >
                {[
                  { icon: <MessageSquare size={12} />, color: "#7C3AED", text: "AI Chat — one thread the whole team sees" },
                  { icon: <Code2 size={12} />, color: "#3B82F6", text: "Generated code, next to the decision" },
                  { icon: <GitBranch size={12} />, color: "#F59E0B", text: "User flow, connected to both" },
                ].map((b) => (
                  <div
                    key={b.text}
                    className="flex items-center gap-2.5 rounded-xl border px-3.5 py-3 text-xs text-white"
                    style={{
                      borderColor: L.border,
                      borderLeft: `3px solid ${b.color}`,
                      backgroundColor: "rgba(10,10,10,0.9)",
                    }}
                  >
                    <span style={{ color: b.color }}>{b.icon}</span>
                    {b.text}
                  </div>
                ))}
              </div>
            </div>
            <p className="pt-4 text-center text-xs" style={{ color: L.text3 }}>
              After: one canvas, one context, one team
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
