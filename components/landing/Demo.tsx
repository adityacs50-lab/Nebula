"use client";

import { motion } from "framer-motion";
import {
  MessageSquare,
  Code2,
  GitBranch,
  Plug,
  Zap,
  Brain,
  Lock,
  Search,
  Home,
  Clock,
  Folder,
  Share2,
  Sparkles,
} from "lucide-react";
import { L, CURSOR_TEAM, fadeUp } from "./landing-ui";
import { Cursor } from "./Hero";

const blockIn = (delay: number) =>
  ({
    initial: { opacity: 0, y: 18, scale: 0.97 },
    whileInView: { opacity: 1, y: 0, scale: 1 },
    viewport: { once: true, margin: "-60px" },
    transition: { duration: 0.5, delay, ease: "easeOut" },
  }) as const;

export function Demo() {
  return (
    <section className="relative py-28">
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <motion.div
          {...fadeUp}
          className="relative overflow-hidden rounded-xl border"
          style={{
            borderColor: "rgba(124,58,237,0.4)",
            backgroundColor: L.surface,
            boxShadow: L.glow,
          }}
        >
          {/* Top bar */}
          <div
            className="flex items-center gap-3 border-b px-4 py-2.5"
            style={{ borderColor: L.border }}
          >
            <span className="flex items-center gap-2 text-xs font-semibold text-white">
              <Sparkles size={13} style={{ color: L.primary }} />
              Project Nebula
            </span>
            <span
              className="rounded-md border px-1.5 py-0.5 text-[9px]"
              style={{ borderColor: L.border, color: L.text2 }}
            >
              Free
            </span>
            <span className="ml-auto flex -space-x-1.5">
              {CURSOR_TEAM.slice(0, 4).map((m) => (
                <span
                  key={m.name}
                  title={m.name}
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
              <Share2 size={10} />
              Share
            </span>
          </div>

          <div className="flex">
            {/* Sidebar */}
            <div
              className="hidden w-44 shrink-0 flex-col gap-1 border-r p-3 md:flex"
              style={{ borderColor: L.border }}
            >
              <div
                className="mb-2 flex items-center gap-2 rounded-lg border px-2 py-1.5 text-[10px]"
                style={{ borderColor: L.border, color: L.text2 }}
              >
                <Search size={10} />
                Search…
              </div>
              {[
                { icon: <Home size={11} />, label: "Home", active: true },
                { icon: <Clock size={11} />, label: "Recent" },
                { icon: <MessageSquare size={11} />, label: "AI Chat" },
                { icon: <Folder size={11} />, label: "My Files" },
              ].map((item) => (
                <span
                  key={item.label}
                  className={`flex items-center gap-2 rounded-lg px-2 py-1.5 text-[10px] ${
                    item.active ? "text-white" : ""
                  }`}
                  style={{
                    color: item.active ? "#fff" : L.text2,
                    backgroundColor: item.active ? "rgba(124,58,237,0.12)" : undefined,
                  }}
                >
                  {item.icon}
                  {item.label}
                </span>
              ))}
            </div>

            {/* Canvas */}
            <div
              className="relative flex-1 p-5 md:p-7"
              style={{
                backgroundImage: "radial-gradient(#232323 1px, transparent 1px)",
                backgroundSize: "22px 22px",
              }}
            >
              {/* connections */}
              <svg
                aria-hidden
                className="pointer-events-none absolute inset-0 h-full w-full"
                preserveAspectRatio="none"
                viewBox="0 0 100 100"
              >
                {[
                  "M 46 30 C 54 32, 56 40, 52 52",
                  "M 30 52 C 34 66, 44 70, 52 72",
                  "M 78 46 C 82 56, 78 64, 72 70",
                ].map((d, i) => (
                  <motion.path
                    key={d}
                    d={d}
                    fill="none"
                    stroke="#7C3AED"
                    strokeWidth="0.35"
                    animate={{ opacity: [0.3, 1, 0.3] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.55 }}
                  />
                ))}
              </svg>

              <div className="relative grid gap-4 md:grid-cols-2">
                <motion.div {...blockIn(0.1)}>
                  <DemoBlock color="#7C3AED" icon={<MessageSquare size={12} />} title="AI Chat">
                    <p className="text-white/90">
                      Maya: Help us decide between B2B and B2C
                    </p>
                    <div className="mt-1.5 space-y-1" style={{ color: L.text2 }}>
                      <p>Nebula AI: Given your canvas so far —</p>
                      <p>· Sam&apos;s user flow targets teams, not consumers</p>
                      <p>· Your API block integrates with Slack &amp; Linear</p>
                      <p>· Recommendation: B2B, land-and-expand</p>
                    </div>
                  </DemoBlock>
                </motion.div>

                <motion.div {...blockIn(0.2)}>
                  <DemoBlock color="#3B82F6" icon={<Code2 size={12} />} title="Generate Code" mono>
                    <p style={{ color: "#f472b6" }}>def <span className="text-white">churn_risk</span>(usage):</p>
                    <p style={{ color: L.text2 }}>&nbsp;&nbsp;score = model.predict(usage)</p>
                    <p style={{ color: L.text2 }}>&nbsp;&nbsp;return score &gt; THRESHOLD</p>
                  </DemoBlock>
                </motion.div>

                <motion.div {...blockIn(0.3)}>
                  <DemoBlock color="#F59E0B" icon={<GitBranch size={12} />} title="User Flow">
                    <div className="flex flex-wrap items-center gap-1.5 text-[10px]">
                      {["Sign up", "→", "Create workspace", "→", "Invite team", "→", "First block"].map(
                        (step, i) =>
                          step === "→" ? (
                            <span key={`a-${i}`} style={{ color: L.text3 }}>→</span>
                          ) : (
                            <span
                              key={step}
                              className="rounded-md border px-2 py-1 text-white/90"
                              style={{ borderColor: "rgba(245,158,11,0.4)" }}
                            >
                              {step}
                            </span>
                          ),
                      )}
                    </div>
                  </DemoBlock>
                </motion.div>

                <motion.div {...blockIn(0.4)}>
                  <DemoBlock color="#10B981" icon={<Plug size={12} />} title="API Integration" mono>
                    <p style={{ color: "#f472b6" }}>export async function <span className="text-white">syncLinear</span>() {"{"}</p>
                    <p style={{ color: L.text2 }}>&nbsp;&nbsp;const issues = await linear.issues()</p>
                    <p style={{ color: L.text2 }}>&nbsp;&nbsp;return canvas.pin(issues)</p>
                    <p style={{ color: "#f472b6" }}>{"}"}</p>
                  </DemoBlock>
                </motion.div>
              </div>

              <Cursor member={CURSOR_TEAM[0]} className="left-[24%] top-[24%]" path={[[0, 0], [30, 14], [-8, 26], [0, 0]]} duration={9} delay={0.5} />
              <Cursor member={CURSOR_TEAM[1]} className="left-[60%] top-[58%]" path={[[0, 0], [-26, -12], [18, 10], [0, 0]]} duration={10} delay={1} />
              <Cursor member={CURSOR_TEAM[2]} className="left-[78%] top-[26%]" path={[[0, 0], [-16, 20], [8, -10], [0, 0]]} duration={8.4} delay={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Callouts */}
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {[
            { icon: <Zap size={17} />, text: "Real-time multiplayer — see your team working live" },
            { icon: <Brain size={17} />, text: "Shared AI context — the AI knows what everyone asked" },
            { icon: <Lock size={17} />, text: "One workspace — no more tab switching" },
          ].map((c, i) => (
            <motion.div
              key={c.text}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="flex items-center gap-3.5 rounded-xl border px-5 py-4"
              style={{ borderColor: L.border, backgroundColor: L.surface }}
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-white"
                style={{ background: L.gradient }}
              >
                {c.icon}
              </span>
              <p className="text-sm text-white/90">{c.text}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function DemoBlock({
  color,
  icon,
  title,
  children,
  mono,
}: {
  color: string;
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div
      className="h-full rounded-xl border text-left"
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
      <div className={`px-3 py-3 text-[11px] leading-relaxed ${mono ? "font-mono" : ""}`}>
        {children}
      </div>
    </div>
  );
}
