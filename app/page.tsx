"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import {
  Sparkles,
  ArrowRight,
  MessageSquare,
  Code2,
  GitBranch,
  Image as ImageIcon,
  Plug,
  Network,
  Check,
  Brain,
  Link2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { TiltCard } from "@/components/landing/TiltCard";

const NebulaScene = dynamic(
  () => import("@/components/landing/NebulaScene"),
  {
    ssr: false,
    loading: () => (
      <div
        className="h-full w-full"
        style={{
          background:
            "radial-gradient(560px 320px at 50% 42%, rgba(124,58,237,0.28), transparent 70%)",
        }}
      />
    ),
  },
);

const fadeUp = {
  initial: { opacity: 0, y: 22 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-90px" },
  transition: { duration: 0.55, ease: "easeOut" },
} as const;

const BLOCKS = [
  { icon: <MessageSquare size={13} />, label: "AI Chat", color: "#7C3AED" },
  { icon: <Code2 size={13} />, label: "Generate Code", color: "#3B82F6" },
  { icon: <ImageIcon size={13} />, label: "AI Image", color: "#EC4899" },
  { icon: <GitBranch size={13} />, label: "User Flow", color: "#F59E0B" },
  { icon: <Plug size={13} />, label: "API Integration", color: "#10B981" },
  { icon: <Network size={13} />, label: "Mind Map", color: "#06B6D4" },
];

const MARQUEE = [
  "One canvas",
  "Every prompt",
  "Every teammate",
  "Full AI context",
  "Live cursors",
  "Zero silos",
  "Ship faster",
];

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-clip bg-background">
      {/* ── Nav ─────────────────────────────────────────────── */}
      <header className="fixed inset-x-0 top-0 z-50">
        <div className="mx-auto mt-4 flex h-14 max-w-6xl items-center justify-between rounded-2xl border border-white/[0.08] bg-background/60 px-5 shadow-card backdrop-blur-xl md:px-6 mx-4 lg:mx-auto">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles size={19} className="text-primary" />
            <span className="text-lg font-semibold tracking-tight">Nebula</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-text-secondary md:flex">
            <a href="#product" className="transition-colors hover:text-white">
              Product
            </a>
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-white">
              Pricing
            </a>
            <Link href="/auth/login" className="transition-colors hover:text-white">
              Log in
            </Link>
          </nav>
          <Link href="/auth/signup">
            <Button size="sm">Start for free</Button>
          </Link>
        </div>
      </header>

      {/* ── Hero ────────────────────────────────────────────── */}
      <section className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-24 pt-36">
        {/* Live WebGL galaxy */}
        <div className="absolute inset-0">
          <NebulaScene />
        </div>
        {/* Bloom at the galaxy's core so it glows like gas, not dust */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 340px at 50% 44%, rgba(124,58,237,0.16), transparent 70%), radial-gradient(300px 180px at 50% 44%, rgba(236,72,153,0.12), transparent 70%)",
          }}
        />
        {/* Vignettes so text stays readable and the section fades out */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 42%, transparent 30%, #0D0D0D 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background" />

        <div className="relative z-10 mx-auto max-w-6xl px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="mx-auto mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-1.5 text-xs text-text-secondary backdrop-blur">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-60" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-success" />
              </span>
              Live multiplayer AI canvas — built for founding teams
            </div>

            <h1 className="mx-auto max-w-4xl text-5xl font-bold leading-[1.05] tracking-tight md:text-7xl">
              Your team&apos;s second brain,
              <br />
              <span className="animate-gradient-pan bg-gradient-to-r from-primary via-[#EC4899] to-secondary bg-clip-text text-transparent">
                floating in space
              </span>
            </h1>

            <p className="mx-auto mt-7 max-w-xl text-lg leading-relaxed text-text-secondary md:text-xl">
              One infinite canvas where every AI conversation, every line of
              generated code, and every idea lives together — and the AI sees
              all of it.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link href="/auth/signup">
                <Button size="lg" className="h-13 px-8 text-base">
                  Start building free
                  <ArrowRight size={17} />
                </Button>
              </Link>
              <a href="#product">
                <Button size="lg" variant="outline" className="h-13 px-8 text-base">
                  See it in action
                </Button>
              </a>
            </div>
            <p className="mt-5 text-xs text-text-secondary/80">
              Free to start · No credit card · Invite your whole team
            </p>
          </motion.div>

          {/* Product mock floating over the galaxy */}
          <motion.div
            id="product"
            initial={{ opacity: 0, y: 48 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: "easeOut" }}
            className="relative mx-auto mt-20 max-w-4xl"
          >
            {/* glow behind the card */}
            <div
              aria-hidden
              className="absolute -inset-10 -z-10"
              style={{
                background:
                  "radial-gradient(60% 60% at 50% 50%, rgba(124,58,237,0.3), transparent 70%)",
              }}
            />
            <TiltCard>
              <HeroCanvas />
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ── Marquee ─────────────────────────────────────────── */}
      <section className="relative border-y border-white/[0.06] bg-white/[0.015] py-5">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-32 bg-gradient-to-r from-background to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-32 bg-gradient-to-l from-background to-transparent" />
        <div className="flex overflow-hidden">
          <div className="animate-marquee flex shrink-0 items-center gap-12 pr-12">
            {[...MARQUEE, ...MARQUEE].map((item, i) => (
              <span
                key={`${item}-${i}`}
                className="flex items-center gap-3 whitespace-nowrap text-sm font-medium text-text-secondary/80"
              >
                <Sparkles size={12} className="text-primary/70" />
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bento features ──────────────────────────────────── */}
      <section id="features" className="relative py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[500px] w-[900px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 0%, rgba(124,58,237,0.10), transparent 75%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp} className="mb-16 text-center">
            <p className="mb-3 text-sm font-medium text-primary">
              Why teams switch
            </p>
            <h2 className="mx-auto max-w-2xl text-4xl font-bold tracking-tight md:text-5xl">
              Stop working with AI in silos
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-lg text-text-secondary">
              ChatGPT tab here, Gemini tab there, answers pasted into Slack.
              Nebula puts your whole team — and the AI — in one room.
            </p>
          </motion.div>

          <div className="grid gap-5 md:grid-cols-6">
            {/* Canvas-aware AI — wide card with context mock */}
            <motion.div
              {...fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:col-span-4"
            >
              <div
                aria-hidden
                className="absolute -right-20 -top-20 h-64 w-64 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
                style={{ background: "rgba(124,58,237,0.35)" }}
              />
              <Brain size={22} className="mb-4 text-primary" />
              <h3 className="mb-2 text-xl font-semibold">
                AI that sees the whole canvas
              </h3>
              <p className="mb-6 max-w-md text-sm leading-relaxed text-text-secondary">
                Every request is injected with a live snapshot of everything
                your team is building. Ask a question and the AI already knows
                about the user flow your co-founder sketched five minutes ago.
              </p>
              <div className="rounded-xl border border-white/[0.08] bg-background/80 p-4 font-mono text-[11px] leading-relaxed">
                <p className="text-text-secondary">
                  <span className="text-[#f472b6]">const</span>{" "}
                  <span className="text-[#93c5fd]">context</span> ={" "}
                  <span className="text-[#c4b5fd]">buildCanvasContext</span>
                  (blocks, workspace)
                </p>
                <p className="mt-1.5 text-text-secondary/70">
                  {"// → 3 chats · 2 code blocks · 1 user flow · 1 mind map"}
                </p>
                <p className="text-text-secondary/70">
                  {"// → last edited by Sam, 2 min ago"}
                </p>
                <p className="mt-1.5 text-success/90">
                  ✓ injected into every single AI call
                </p>
              </div>
            </motion.div>

            {/* Multiplayer */}
            <motion.div
              {...fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:col-span-2"
            >
              <div
                aria-hidden
                className="absolute -left-16 -bottom-16 h-56 w-56 rounded-full opacity-40 blur-3xl transition-opacity group-hover:opacity-70"
                style={{ background: "rgba(236,72,153,0.3)" }}
              />
              <Zap size={22} className="mb-4 text-[#EC4899]" />
              <h3 className="mb-2 text-xl font-semibold">Truly multiplayer</h3>
              <p className="text-sm leading-relaxed text-text-secondary">
                Live cursors, presence, and shared state. Watch your
                co-founder&apos;s ideas land on the canvas in real time.
              </p>
              <div className="relative mt-6 h-24 overflow-hidden rounded-xl border border-white/[0.08] bg-background/80">
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage:
                      "radial-gradient(#232323 1px, transparent 1px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <MiniCursor name="Maya" color="#7C3AED" className="left-[12%] top-[22%]" delay={0} />
                <MiniCursor name="Sam" color="#EC4899" className="left-[52%] top-[52%]" delay={1.1} />
              </div>
            </motion.div>

            {/* Six block types */}
            <motion.div
              {...fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:col-span-3"
            >
              <h3 className="mb-2 text-xl font-semibold">
                Six blocks. Infinite structure.
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                Chats, generated code, AI images, user flows, API scaffolds,
                and mind maps — connected with edges on one infinite canvas.
              </p>
              <div className="grid grid-cols-2 gap-2.5">
                {BLOCKS.map((b) => (
                  <div
                    key={b.label}
                    className="flex items-center gap-2.5 rounded-lg border border-white/[0.07] bg-background/70 px-3 py-2.5 text-xs font-medium transition-colors hover:border-white/20"
                  >
                    <span style={{ color: b.color }}>{b.icon}</span>
                    {b.label}
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Invite links */}
            <motion.div
              {...fadeUp}
              className="group relative overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02] p-8 md:col-span-3"
            >
              <div
                aria-hidden
                className="absolute -right-16 -bottom-20 h-56 w-56 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-60"
                style={{ background: "rgba(59,130,246,0.35)" }}
              />
              <Link2 size={22} className="mb-4 text-secondary" />
              <h3 className="mb-2 text-xl font-semibold">
                One link. Whole team in.
              </h3>
              <p className="mb-6 text-sm leading-relaxed text-text-secondary">
                Share an invite link and your co-founder lands directly on the
                canvas — cursor live, context loaded, zero setup.
              </p>
              <div className="flex items-center gap-2 rounded-xl border border-white/[0.08] bg-background/80 px-4 py-3 font-mono text-[11px] text-text-secondary">
                <Link2 size={12} className="shrink-0 text-secondary" />
                <span className="truncate">nebula.app/invite/8a6e88ec…</span>
                <span className="ml-auto shrink-0 rounded-md bg-success/15 px-2 py-0.5 text-[10px] font-medium text-success">
                  Copied!
                </span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Stats band ──────────────────────────────────────── */}
      <section className="border-y border-white/[0.06] bg-white/[0.015] py-16">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-10 px-6 text-center md:grid-cols-4">
          {[
            ["6", "block types on one canvas"],
            ["100%", "of AI calls get team context"],
            ["1", "link to onboard your team"],
            ["0", "answers lost in Slack threads"],
          ].map(([stat, label]) => (
            <motion.div key={label} {...fadeUp}>
              <p className="bg-gradient-to-b from-white to-white/50 bg-clip-text text-5xl font-bold tracking-tight text-transparent">
                {stat}
              </p>
              <p className="mt-2 text-xs leading-relaxed text-text-secondary">
                {label}
              </p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ── Pricing ─────────────────────────────────────────── */}
      <section id="pricing" className="relative py-28">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[700px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(50% 50% at 50% 50%, rgba(124,58,237,0.12), transparent 75%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp} className="mb-14 text-center">
            <p className="mb-3 text-sm font-medium text-primary">Pricing</p>
            <h2 className="text-4xl font-bold tracking-tight md:text-5xl">
              One plan. Whole team.
            </h2>
            <p className="mt-4 text-lg text-text-secondary">
              No per-seat math. No usage anxiety.
            </p>
          </motion.div>

          <motion.div {...fadeUp} className="mx-auto max-w-md">
            <TiltCard maxTilt={4}>
              <div className="relative overflow-hidden rounded-2xl border border-primary/40 bg-surface/80 p-8 shadow-glow-soft backdrop-blur">
                <div
                  aria-hidden
                  className="absolute -right-20 -top-24 h-64 w-64 rounded-full opacity-50 blur-3xl"
                  style={{ background: "rgba(124,58,237,0.25)" }}
                />
                <div className="mb-1 text-sm font-medium text-primary">Team</div>
                <div className="mb-6 flex items-baseline gap-2">
                  <span className="text-6xl font-bold tracking-tight">$49</span>
                  <span className="text-text-secondary">/month per team</span>
                </div>
                <ul className="mb-8 space-y-3 text-sm">
                  {[
                    "Up to 5 team members",
                    "Unlimited AI chats with full canvas context",
                    "Unlimited blocks, flows, and mind maps",
                    "Real-time multiplayer canvas",
                    "AI code + image generation included",
                    "Invite links and workspace permissions",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check size={16} className="mt-0.5 shrink-0 text-success" />
                      <span className="text-text-primary/90">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link href="/auth/signup" className="block">
                  <Button className="w-full" size="lg">
                    Start free trial
                  </Button>
                </Link>
              </div>
            </TiltCard>
          </motion.div>
        </div>
      </section>

      {/* ── Final CTA ───────────────────────────────────────── */}
      <section className="relative overflow-hidden py-32">
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 bottom-0 h-[480px] w-[1000px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(55% 65% at 50% 100%, rgba(124,58,237,0.22), rgba(236,72,153,0.06) 55%, transparent 80%)",
          }}
        />
        <motion.div {...fadeUp} className="relative mx-auto max-w-3xl px-6 text-center">
          <Sparkles size={28} className="mx-auto mb-6 animate-float text-primary" />
          <h2 className="text-4xl font-bold leading-tight tracking-tight md:text-6xl">
            Give your team
            <br />
            <span className="animate-gradient-pan bg-gradient-to-r from-primary via-[#EC4899] to-secondary bg-clip-text text-transparent">
              one shared brain
            </span>
          </h2>
          <p className="mx-auto mt-6 max-w-md text-lg text-text-secondary">
            Set up your canvas in under a minute. Your co-founders are one
            invite link away.
          </p>
          <div className="mt-10">
            <Link href="/auth/signup">
              <Button size="lg" className="h-13 px-10 text-base">
                Launch your workspace
                <ArrowRight size={17} />
              </Button>
            </Link>
          </div>
        </motion.div>
      </section>

      {/* ── Footer ──────────────────────────────────────────── */}
      <footer className="border-t border-white/[0.06] py-12">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-6 md:flex-row">
          <div className="flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            <span className="font-semibold">Nebula</span>
            <span className="ml-2 text-xs text-text-secondary">
              The shared AI workspace for founding teams
            </span>
          </div>
          <nav className="flex items-center gap-6 text-sm text-text-secondary">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-white">
              Pricing
            </a>
            <Link href="/auth/login" className="transition-colors hover:text-white">
              Log in
            </Link>
            <Link href="/auth/signup" className="transition-colors hover:text-white">
              Sign up
            </Link>
          </nav>
          <p className="text-xs text-text-secondary">
            © {new Date().getFullYear()} Nebula. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

/* ── Hero product mock ─────────────────────────────────────── */

function HeroCanvas() {
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-surface/90 shadow-card backdrop-blur">
      {/* window chrome */}
      <div className="flex items-center gap-1.5 border-b border-white/[0.06] px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-[#ff5f57]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#febc2e]" />
        <span className="h-2.5 w-2.5 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-[10px] text-text-secondary">
          Project Nebula — 3 online
        </span>
        <span className="ml-auto flex -space-x-1.5">
          {["#7C3AED", "#EC4899", "#3B82F6"].map((c) => (
            <span
              key={c}
              className="h-4 w-4 rounded-full border border-background"
              style={{ backgroundColor: c }}
            />
          ))}
        </span>
      </div>
      {/* dot grid */}
      <div className="relative">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: "radial-gradient(#2a2a2a 1px, transparent 1px)",
            backgroundSize: "22px 22px",
          }}
        />
        <div className="relative grid gap-4 p-8 md:grid-cols-3">
          <MockBlock
            color="#7C3AED"
            icon={<MessageSquare size={13} />}
            title="AI Chat"
            lines={[
              "Aditya: What should onboarding look like?",
              "Nebula AI: Based on the user flow Sam is building…",
            ]}
          />
          <MockBlock
            color="#3B82F6"
            icon={<Code2 size={13} />}
            title="Generate Code"
            lines={["def calculate_metrics(data):", "    results = {}", "    for key, values in …"]}
            mono
          />
          <MockBlock
            color="#F59E0B"
            icon={<GitBranch size={13} />}
            title="User Flow"
            lines={["Start → Sign Up → Onboarding", "→ Dashboard → Invite Team"]}
          />
        </div>
        <MiniCursor name="Maya" color="#7C3AED" className="left-[18%] top-[32%]" delay={0} />
        <MiniCursor name="Sam" color="#EC4899" className="left-[55%] top-[64%]" delay={0.8} />
        <MiniCursor name="Alex" color="#3B82F6" className="left-[78%] top-[28%]" delay={1.6} />
      </div>
    </div>
  );
}

function MockBlock({
  color,
  icon,
  title,
  lines,
  mono,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  lines: string[];
  mono?: boolean;
}) {
  return (
    <div
      className="rounded-xl border border-white/[0.08] bg-background/90 text-left"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      <div className="flex items-center gap-2 border-b border-white/[0.06] px-3 py-2 text-xs font-medium">
        <span style={{ color }}>{icon}</span>
        {title}
      </div>
      <div
        className={`space-y-1.5 px-3 py-3 text-[11px] leading-relaxed text-text-secondary ${
          mono ? "font-mono" : ""
        }`}
      >
        {lines.map((line) => (
          <p key={line} className="truncate">
            {line}
          </p>
        ))}
      </div>
    </div>
  );
}

function MiniCursor({
  name,
  color,
  className,
  delay,
}: {
  name: string;
  color: string;
  className: string;
  delay: number;
}) {
  return (
    <motion.div
      className={`absolute z-10 ${className}`}
      animate={{ x: [0, 22, -12, 0], y: [0, -12, 9, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 1.5L13.5 7L8 8.5L6 14L2 1.5Z"
          fill={color}
          stroke="#0D0D0D"
          strokeWidth="1"
        />
      </svg>
      <span
        className="ml-3 rounded-md px-2 py-0.5 text-[10px] font-medium text-white"
        style={{ backgroundColor: color }}
      >
        {name}
      </span>
    </motion.div>
  );
}
