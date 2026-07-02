"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  LayoutGrid,
  Brain,
  Users,
  Check,
  ArrowRight,
  MessageSquare,
  Code2,
  GitBranch,
} from "lucide-react";
import { Button } from "@/components/ui/Button";

const fadeUp = {
  initial: { opacity: 0, y: 16 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5 },
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Nav */}
      <header className="sticky top-0 z-40 border-b border-border/60 bg-background/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <Sparkles size={20} className="text-primary" />
            <span className="text-lg font-semibold tracking-tight">Nebula</span>
          </Link>
          <nav className="hidden items-center gap-8 text-sm text-text-secondary md:flex">
            <a href="#features" className="transition-colors hover:text-white">
              Features
            </a>
            <a href="#pricing" className="transition-colors hover:text-white">
              Pricing
            </a>
            <Link
              href="/auth/login"
              className="transition-colors hover:text-white"
            >
              Log in
            </Link>
          </nav>
          <Link href="/auth/signup">
            <Button size="sm">Start for free</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(600px 300px at 50% 0%, rgba(124,58,237,0.18), transparent 70%)",
          }}
        />
        <div className="mx-auto max-w-6xl px-6 pb-20 pt-24 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="mx-auto mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-1.5 text-xs text-text-secondary">
              <span className="h-1.5 w-1.5 rounded-full bg-success" />
              Built for founding teams of 2 to 5
            </div>
            <h1 className="mx-auto max-w-3xl text-5xl font-bold leading-tight tracking-tight md:text-6xl">
              The shared AI brain for{" "}
              <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                founding teams
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-lg text-text-secondary">
              Your co-founder is on ChatGPT. You&apos;re on Gemini. Nobody knows
              what the AI told who. Nebula fixes that.
            </p>
            <div className="mt-10 flex items-center justify-center gap-4">
              <Link href="/auth/signup">
                <Button size="lg">
                  Start for free
                  <ArrowRight size={16} />
                </Button>
              </Link>
              <a href="#features">
                <Button size="lg" variant="outline">
                  See how it works
                </Button>
              </a>
            </div>
          </motion.div>

          {/* Hero canvas mock with multiplayer cursors */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="relative mx-auto mt-16 max-w-4xl"
          >
            <HeroCanvas />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp} className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              Stop working with AI in silos
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-text-secondary">
              Every prompt, every output, every decision — in one canvas your
              whole team and the AI can see.
            </p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-3">
            <FeatureCard
              icon={<LayoutGrid size={22} className="text-primary" />}
              title="One shared canvas"
              body="An infinite canvas where chats, code, flows, and mind maps live side by side. No more pasting AI answers into Slack."
            />
            <FeatureCard
              icon={<Brain size={22} className="text-secondary" />}
              title="AI with full team context"
              body="Every Gemini call is injected with a live snapshot of the whole canvas — the AI knows what your co-founders are building right now."
            />
            <FeatureCard
              icon={<Users size={22} className="text-success" />}
              title="Real-time multiplayer"
              body="Live cursors, presence, and shared state powered by Liveblocks. Join with an invite link and you're in the same room."
            />
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="border-t border-border/60 py-24">
        <div className="mx-auto max-w-6xl px-6">
          <motion.div {...fadeUp} className="mb-14 text-center">
            <h2 className="text-3xl font-bold tracking-tight">
              One plan. Whole team.
            </h2>
            <p className="mt-3 text-text-secondary">
              No per-seat math. No usage anxiety.
            </p>
          </motion.div>
          <motion.div
            {...fadeUp}
            className="mx-auto max-w-md rounded-xl border border-primary/40 bg-surface p-8 shadow-glow-soft"
          >
            <div className="mb-1 text-sm font-medium text-primary">Team</div>
            <div className="mb-6 flex items-baseline gap-2">
              <span className="text-5xl font-bold">$49</span>
              <span className="text-text-secondary">/month per team</span>
            </div>
            <ul className="mb-8 space-y-3 text-sm">
              {[
                "Up to 5 team members",
                "Unlimited AI chats with full canvas context",
                "Unlimited blocks, flows, and mind maps",
                "Real-time multiplayer canvas",
                "Gemini 2.5 Flash included",
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
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/60 py-12">
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
            <Link
              href="/auth/login"
              className="transition-colors hover:text-white"
            >
              Log in
            </Link>
            <Link
              href="/auth/signup"
              className="transition-colors hover:text-white"
            >
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

function FeatureCard({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: string;
}) {
  return (
    <motion.div
      {...fadeUp}
      className="rounded-xl border border-border bg-surface p-6 transition-colors hover:border-primary/40"
    >
      <div className="mb-4 inline-flex rounded-lg border border-border bg-background p-2.5">
        {icon}
      </div>
      <h3 className="mb-2 text-lg font-semibold">{title}</h3>
      <p className="text-sm leading-relaxed text-text-secondary">{body}</p>
    </motion.div>
  );
}

/** A stylized "screenshot" of the canvas with live cursors. */
function HeroCanvas() {
  return (
    <div className="relative overflow-hidden rounded-xl border border-border bg-surface shadow-card">
      {/* dot grid */}
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
            "Aditya: What should our onboarding look like?",
            "Nebula AI: Based on the user flow Sam is building...",
          ]}
        />
        <MockBlock
          color="#3B82F6"
          icon={<Code2 size={13} />}
          title="Generate Code"
          lines={["def calculate_metrics(data):", "    results = {}", "    for key, values in ..."]}
          mono
        />
        <MockBlock
          color="#F59E0B"
          icon={<GitBranch size={13} />}
          title="User Flow"
          lines={["Start -> Sign Up -> Onboarding", "-> Dashboard -> Invite Team"]}
        />
      </div>
      {/* multiplayer cursors */}
      <HeroCursor name="Maya" color="#7C3AED" className="left-[18%] top-[30%]" delay={0} />
      <HeroCursor name="Sam" color="#EC4899" className="left-[55%] top-[62%]" delay={0.8} />
      <HeroCursor name="Alex" color="#3B82F6" className="left-[78%] top-[26%]" delay={1.6} />
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
      className="rounded-xl border border-border bg-background/90 text-left"
      style={{ borderLeft: `4px solid ${color}` }}
    >
      <div className="flex items-center gap-2 border-b border-border px-3 py-2 text-xs font-medium">
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

function HeroCursor({
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
      className={`absolute ${className}`}
      animate={{ x: [0, 24, -12, 0], y: [0, -14, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay }}
    >
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
