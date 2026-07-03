"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  MessageSquare,
  Code2,
  Image as ImageIcon,
  GitBranch,
  Plug,
  Sparkles,
  Share2,
} from "lucide-react";
import { L, CURSOR_TEAM, TeamCursor } from "./landing-ui";
import { CountUp } from "./interactions";

/** Full-bleed product section: the mockup scales 0.85 → 1 as it enters. */
export function Product() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.85", "start 0.25"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.85, 1]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0.4, 1]);

  return (
    <section id="product" className="relative overflow-hidden py-28 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mx-auto mb-16 text-center text-[clamp(2.5rem,6vw,4rem)] font-thin leading-tight tracking-tight text-white"
        >
          One canvas.{" "}
          <span className="font-bold">Everything.</span>
        </motion.h2>

        <motion.div ref={ref} style={{ scale, opacity }} className="relative">
          {/* center glow */}
          <div
            aria-hidden
            className="pointer-events-none absolute -inset-10 -z-10"
            style={{
              background:
                "radial-gradient(50% 50% at 50% 50%, rgba(124,58,237,0.24), transparent 70%)",
            }}
          />
          <ProductCanvas />
          {/* vignette */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 rounded-xl"
            style={{ boxShadow: "inset 0 0 120px 40px rgba(10,10,10,0.9)" }}
          />
        </motion.div>

        {/* stats */}
        <div className="mx-auto mt-16 grid max-w-3xl grid-cols-3 gap-8 text-center">
          {[
            { value: <CountUp to={6} />, label: "block types" },
            { value: "Live", label: "multiplayer canvas" },
            { value: <CountUp to={49} prefix="$" />, label: "per team / month" },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
            >
              <p className="text-5xl font-bold tracking-tight text-white md:text-6xl">
                {s.value}
              </p>
              <p className="mt-2 text-xs" style={{ color: "#666" }}>
                {s.label}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ProductCanvas() {
  return (
    <div
      className="relative overflow-hidden rounded-xl border"
      style={{
        borderColor: "rgba(124,58,237,0.35)",
        backgroundColor: L.surface,
        boxShadow: "0 0 60px rgba(124,58,237,0.2)",
      }}
    >
      {/* top bar */}
      <div className="flex items-center gap-3 border-b px-4 py-2.5" style={{ borderColor: L.border }}>
        <span className="flex items-center gap-2 text-xs font-semibold text-white">
          <Sparkles size={13} style={{ color: L.primary }} />
          Project Nebula
        </span>
        <span className="ml-auto flex -space-x-1.5">
          {CURSOR_TEAM.slice(0, 4).map((m) => (
            <span
              key={m.name}
              className="flex h-5 w-5 items-center justify-center rounded-full border text-[8px] font-bold text-white"
              style={{ backgroundColor: m.color, borderColor: L.surface }}
            >
              {m.name[0]}
            </span>
          ))}
        </span>
        <span
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-[10px] font-semibold text-white"
          style={{ background: L.gradient }}
        >
          <Share2 size={10} /> Share
        </span>
      </div>

      {/* canvas */}
      <div
        className="relative p-5 md:p-8"
        style={{
          backgroundImage: "radial-gradient(#1c1c1c 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      >
        <svg aria-hidden className="pointer-events-none absolute inset-0 h-full w-full" preserveAspectRatio="none" viewBox="0 0 100 100">
          {["M 34 32 C 44 34, 46 44, 52 50", "M 30 54 C 40 62, 52 62, 60 66", "M 74 40 C 80 50, 76 60, 68 64"].map((d, i) => (
            <motion.path
              key={d}
              d={d}
              fill="none"
              stroke="#7C3AED"
              strokeWidth="0.3"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{ duration: 2, repeat: Infinity, delay: i * 0.5 }}
            />
          ))}
        </svg>

        <div className="relative grid gap-4 md:grid-cols-3">
          <PBlock color="#7C3AED" icon={<MessageSquare size={12} />} title="AI Chat" className="md:col-span-2">
            <p className="text-white/85">Maya: Help us decide — B2B or B2C for launch?</p>
            <div className="mt-1.5 space-y-1" style={{ color: "#666" }}>
              <p>Nebula AI: Based on the canvas —</p>
              <p>· Sam&apos;s user flow targets teams, not consumers</p>
              <p>· Your API block wires into Slack &amp; Linear</p>
              <p className="text-white/70">→ Recommend B2B, land-and-expand</p>
            </div>
          </PBlock>
          <PBlock color="#3B82F6" icon={<Code2 size={12} />} title="Generate Code" mono>
            <p style={{ color: "#f472b6" }}>def <span className="text-white">churn</span>(u):</p>
            <p style={{ color: "#666" }}>&nbsp;&nbsp;return score(u) &gt; T</p>
          </PBlock>
          <PBlock color="#F59E0B" icon={<GitBranch size={12} />} title="User Flow">
            <p style={{ color: "#666" }}>Sign up → Workspace → Invite → Build</p>
          </PBlock>
          <PBlock color="#EC4899" icon={<ImageIcon size={12} />} title="AI Image">
            <div className="mt-1 h-10 rounded-md" style={{ background: "linear-gradient(135deg,#7C3AED33,#EC489933)" }} />
          </PBlock>
          <PBlock color="#10B981" icon={<Plug size={12} />} title="API Integration" mono>
            <p style={{ color: "#666" }}>await linear.sync()</p>
          </PBlock>
        </div>

        <TeamCursor member={CURSOR_TEAM[0]} className="left-[26%] top-[22%]" path={[[0, 0], [28, 14], [-8, 24], [0, 0]]} duration={9} delay={0.4} />
        <TeamCursor member={CURSOR_TEAM[1]} className="left-[58%] top-[56%]" path={[[0, 0], [-24, -12], [16, 12], [0, 0]]} duration={10} delay={0.8} />
        <TeamCursor member={CURSOR_TEAM[2]} className="left-[78%] top-[30%]" path={[[0, 0], [-16, 20], [8, -12], [0, 0]]} duration={8.4} delay={1.2} />
        <TeamCursor member={CURSOR_TEAM[3]} className="left-[36%] top-[70%]" path={[[0, 0], [22, -14], [-12, -18], [0, 0]]} duration={11} delay={1.6} />
      </div>
    </div>
  );
}

function PBlock({
  color,
  icon,
  title,
  children,
  mono,
  className = "",
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  mono?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border text-left ${className}`}
      style={{ borderColor: L.border, borderLeft: `3px solid ${color}`, backgroundColor: "rgba(10,10,10,0.9)" }}
    >
      <div className="flex items-center gap-2 border-b px-3 py-2 text-xs font-medium text-white" style={{ borderColor: L.border }}>
        <span style={{ color }}>{icon}</span>
        {title}
      </div>
      <div className={`px-3 py-2.5 text-[10px] leading-relaxed ${mono ? "font-mono" : ""}`}>
        {children}
      </div>
    </div>
  );
}
