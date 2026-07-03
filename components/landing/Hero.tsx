"use client";

import { useState, useRef, type MouseEvent } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  motion,
  AnimatePresence,
  useMotionValue,
  useSpring,
  useMotionTemplate,
} from "framer-motion";
import {
  ArrowRight,
  Play,
  MessageSquare,
  Code2,
  GitBranch,
  Sparkles,
  X,
} from "lucide-react";
import { GradientButton, OutlineButton, L, CURSOR_TEAM } from "./landing-ui";

const NebulaScene = dynamic(() => import("./NebulaScene"), {
  ssr: false,
  loading: () => null,
});

const HEADLINE_TOP = ["The", "shared"];
const HEADLINE_GRADIENT = ["AI", "brain"];
const HEADLINE_BOTTOM = ["for", "founding", "teams."];

export function Hero() {
  const [demoOpen, setDemoOpen] = useState(false);
  let wordIndex = 0;
  const word = (w: string, gradient = false) => {
    const i = wordIndex++;
    return (
      <motion.span
        key={`${w}-${i}`}
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.15 + i * 0.09, ease: "easeOut" }}
        className={`inline-block ${
          gradient
            ? "bg-clip-text text-transparent"
            : "text-white"
        }`}
        style={gradient ? { backgroundImage: L.gradient } : undefined}
      >
        {w}&nbsp;
      </motion.span>
    );
  };

  return (
    <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-20 pt-32">
      {/* Galaxy backdrop */}
      <div className="absolute inset-0 opacity-80">
        <NebulaScene />
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 75% 55% at 50% 40%, transparent 25%, #0A0A0A 100%)",
        }}
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-5 text-center md:px-6">
        {/* Headline, word by word */}
        <h1 className="mx-auto max-w-4xl text-[48px] font-bold leading-[1.04] tracking-tight md:text-[80px]">
          <span className="block">
            {HEADLINE_TOP.map((w) => word(w))}
            {HEADLINE_GRADIENT.map((w) => word(w, true))}
          </span>
          <span className="block">{HEADLINE_BOTTOM.map((w) => word(w))}</span>
        </h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mx-auto mt-7 max-w-[600px] text-lg leading-relaxed md:text-xl"
          style={{ color: L.text2 }}
        >
          Your co-founder is on ChatGPT. You&apos;re on Claude. Your third is
          on Gemini. Nobody knows what the AI told who.{" "}
          <span className="text-white">Nebula fixes that.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200, damping: 16 }}
          className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row"
        >
          <Link href="/auth/signup">
            <GradientButton className="!px-8 !py-3.5 !text-base">
              Start for free
              <ArrowRight size={17} />
            </GradientButton>
          </Link>
          <OutlineButton
            className="!px-8 !py-3.5 !text-base"
            onClick={() => setDemoOpen(true)}
          >
            <Play size={15} />
            Watch demo
          </OutlineButton>
        </motion.div>

        {/* Social proof */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.15, duration: 0.6 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs"
          style={{ color: L.text2 }}
        >
          {[
            "Trusted by 500+ founding teams",
            "Set up in 2 minutes",
            "$49/month flat",
          ].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <Sparkles size={11} style={{ color: L.primary }} />
              {item}
            </span>
          ))}
        </motion.div>

        {/* Workspace canvas */}
        <motion.div
          initial={{ opacity: 0, y: 56 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 1.2, ease: "easeOut" }}
          className="relative mx-auto mt-16 max-w-4xl"
        >
          <div
            aria-hidden
            className="absolute -inset-12 -z-10"
            style={{
              background:
                "radial-gradient(55% 55% at 50% 50%, rgba(124,58,237,0.32), transparent 70%)",
            }}
          />
          <WorkspaceCanvas />
        </motion.div>
      </div>

      {/* Demo modal */}
      <AnimatePresence>
        {demoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
            onClick={() => setDemoOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 24 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 12 }}
              transition={{ type: "spring", stiffness: 220, damping: 22 }}
              className="relative w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setDemoOpen(false)}
                aria-label="Close demo"
                className="absolute -top-11 right-0 flex h-9 w-9 items-center justify-center rounded-xl border text-white"
                style={{ borderColor: L.border, backgroundColor: L.surface }}
              >
                <X size={16} />
              </button>
              <WorkspaceCanvas large />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ── Animated workspace canvas ─────────────────────────────── */

function WorkspaceCanvas({ large = false }: { large?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const gridX = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const gridY = useSpring(useMotionValue(0), { stiffness: 60, damping: 20 });
  const gridTransform = useMotionTemplate`translate(${gridX}px, ${gridY}px)`;

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    gridX.set(((e.clientX - rect.left) / rect.width - 0.5) * -10);
    gridY.set(((e.clientY - rect.top) / rect.height - 0.5) * -10);
  }

  return (
    <div
      ref={ref}
      onMouseMove={onMouseMove}
      className="relative overflow-hidden rounded-xl border"
      style={{
        borderColor: "rgba(124,58,237,0.35)",
        backgroundColor: "rgba(17,17,17,0.92)",
        boxShadow: L.glow,
      }}
    >
      {/* parallax dot grid */}
      <motion.div
        aria-hidden
        className="absolute -inset-4"
        style={{
          transform: gridTransform,
          backgroundImage: "radial-gradient(#242424 1px, transparent 1px)",
          backgroundSize: "22px 22px",
        }}
      />
      {/* center glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(45% 45% at 50% 50%, rgba(124,58,237,0.12), transparent 75%)",
        }}
      />

      {/* connection lines */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
        preserveAspectRatio="none"
        viewBox="0 0 100 100"
      >
        {[
          "M 30 38 C 42 38, 46 52, 56 55",
          "M 56 62 C 66 66, 70 50, 78 44",
        ].map((d, i) => (
          <motion.path
            key={d}
            d={d}
            fill="none"
            stroke="#7C3AED"
            strokeWidth="0.4"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.7 }}
          />
        ))}
      </svg>

      <div
        className={`relative grid gap-4 p-6 md:grid-cols-3 md:p-8 ${
          large ? "md:p-12" : ""
        }`}
      >
        <FloatingBlock
          color="#7C3AED"
          icon={<MessageSquare size={13} />}
          title="AI Chat"
          delay={0}
          lines={[
            "Maya: Help us decide between B2B and B2C",
            "Nebula AI: Based on Sam's user flow, B2B fits…",
          ]}
        />
        <FloatingBlock
          color="#3B82F6"
          icon={<Code2 size={13} />}
          title="Generate Code"
          delay={0.6}
          mono
          lines={["def onboard_team(team):", "    workspace = create()", "    return invite(team)"]}
        />
        <FloatingBlock
          color="#F59E0B"
          icon={<GitBranch size={13} />}
          title="User Flow"
          delay={1.2}
          lines={["Start → Sign Up → Onboarding", "→ Canvas → Invite Team"]}
        />
      </div>

      {/* five cursors on organic paths */}
      <Cursor member={CURSOR_TEAM[0]} className="left-[16%] top-[28%]" path={[[0, 0], [34, -12], [12, 18], [0, 0]]} duration={8} delay={1.5} />
      <Cursor member={CURSOR_TEAM[1]} className="left-[48%] top-[60%]" path={[[0, 0], [-22, -18], [26, 8], [0, 0]]} duration={9.5} delay={1.9} />
      <Cursor member={CURSOR_TEAM[2]} className="left-[76%] top-[30%]" path={[[0, 0], [-30, 16], [10, -14], [0, 0]]} duration={8.6} delay={2.3} />
      <Cursor member={CURSOR_TEAM[3]} className="left-[30%] top-[68%]" path={[[0, 0], [28, -10], [-14, -20], [0, 0]]} duration={10.4} delay={2.7} />
      <Cursor member={CURSOR_TEAM[4]} className="left-[62%] top-[20%]" path={[[0, 0], [14, 22], [-24, 10], [0, 0]]} duration={9} delay={3.1} />
    </div>
  );
}

function FloatingBlock({
  color,
  icon,
  title,
  lines,
  mono,
  delay,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  lines: string[];
  mono?: boolean;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ y: [0, -4, 0, 4, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay }}
      className="rounded-xl border text-left"
      style={{
        borderColor: L.border,
        borderLeft: `3px solid ${color}`,
        backgroundColor: "rgba(10,10,10,0.92)",
      }}
    >
      <div
        className="flex items-center gap-2 border-b px-3 py-2 text-xs font-medium text-white"
        style={{ borderColor: L.border }}
      >
        <span style={{ color }}>{icon}</span>
        {title}
      </div>
      <div
        className={`space-y-1.5 px-3 py-3 text-[11px] leading-relaxed ${
          mono ? "font-mono" : ""
        }`}
        style={{ color: L.text2 }}
      >
        {lines.map((line) => (
          <p key={line} className="truncate">
            {line}
          </p>
        ))}
      </div>
    </motion.div>
  );
}

export function Cursor({
  member,
  className,
  path,
  duration,
  delay,
}: {
  member: { name: string; color: string };
  className: string;
  path: Array<[number, number]>;
  duration: number;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      initial={{ opacity: 0 }}
      animate={{
        opacity: 1,
        x: path.map((p) => p[0]),
        y: path.map((p) => p[1]),
      }}
      transition={{
        opacity: { duration: 0.4, delay },
        x: { duration, repeat: Infinity, ease: "easeInOut", delay },
        y: { duration, repeat: Infinity, ease: "easeInOut", delay },
      }}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 1.5L13.5 7L8 8.5L6 14L2 1.5Z"
          fill={member.color}
          stroke="#0A0A0A"
          strokeWidth="1"
        />
      </svg>
      <span
        className="ml-3 rounded-md px-2 py-0.5 text-[10px] font-medium text-white"
        style={{ backgroundColor: member.color }}
      >
        {member.name}
      </span>
    </motion.div>
  );
}
