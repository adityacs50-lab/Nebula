"use client";

import { useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  type MotionValue,
} from "framer-motion";
import { ArrowRight, MessageSquare, Code2, GitBranch } from "lucide-react";
import { L, CURSOR_TEAM } from "./landing-ui";
import { Magnetic } from "./interactions";

/**
 * Editorial split hero. Left: oversized headline mixing thin + bold
 * weights. Right: a product mockup that parallaxes to the cursor — the
 * "you're already in Nebula" moment. Moving the mouse nudges the card,
 * shifts the glow, and pushes the three teammate cursors, each at a
 * different rate.
 */
export function Hero() {
  const section = useRef<HTMLElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 90, damping: 18 });
  const sy = useSpring(my, { stiffness: 90, damping: 18 });

  const [glow, setGlow] = useState({ x: 50, y: 45 });

  const cardX = useMotionValue(0);
  const cardY = useMotionValue(0);
  const rotX = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const rotY = useSpring(useMotionValue(0), { stiffness: 120, damping: 18 });
  const scardX = useSpring(cardX, { stiffness: 120, damping: 18 });
  const scardY = useSpring(cardY, { stiffness: 120, damping: 18 });

  function onMove(e: MouseEvent<HTMLElement>) {
    const rect = section.current?.getBoundingClientRect();
    if (!rect) return;
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    mx.set(px);
    my.set(py);
    cardX.set(px * 26);
    cardY.set(py * 22);
    rotY.set(px * 8);
    rotX.set(-py * 6);
    setGlow({ x: 50 + px * 40, y: 45 + py * 40 });
  }

  const glowBg = useMotionTemplate`radial-gradient(45% 45% at ${glow.x}% ${glow.y}%, rgba(124,58,237,0.4), transparent 70%)`;

  return (
    <section
      ref={section}
      onMouseMove={onMove}
      className="relative flex min-h-[100svh] items-center overflow-hidden px-5 pb-16 pt-32 md:px-10 md:pt-28"
    >
      {/* ambient corner glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute -right-40 -top-40 h-[560px] w-[560px] rounded-full opacity-40 blur-[120px]"
        style={{ background: "rgba(124,58,237,0.28)" }}
      />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 lg:grid-cols-[1.15fr_1fr]">
        {/* ── Left: headline ── */}
        <div>
          <motion.h1
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.08 } } }}
            className="text-[clamp(3rem,9vw,6rem)] leading-[0.95] tracking-[-0.03em] text-white"
          >
            <HeadingLine>
              <span className="font-thin">The</span>
            </HeadingLine>
            <HeadingLine>
              <span
                className="bg-clip-text font-bold text-transparent"
                style={{ backgroundImage: L.gradient }}
              >
                shared
              </span>
            </HeadingLine>
            <HeadingLine>
              <span className="font-thin">AI brain</span>
            </HeadingLine>
            <HeadingLine>
              <span className="font-bold">for founders.</span>
            </HeadingLine>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="mt-8 max-w-[380px] text-base leading-relaxed"
            style={{ color: "#666" }}
          >
            Three co-founders. Three AI tools. Zero shared context.
            <br />
            <br />
            <span className="text-white/80">
              Nebula puts your whole team on one canvas, one AI.
            </span>
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.65, duration: 0.6 }}
            className="mt-10 flex items-center gap-7"
          >
            <Magnetic strength={0.4}>
              <Link href="/auth/signup">
                <span
                  className="inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-semibold text-white"
                  style={{
                    background: L.gradient,
                    boxShadow: "0 0 30px rgba(124,58,237,0.35)",
                  }}
                >
                  Start free
                </span>
              </Link>
            </Magnetic>
            <a
              href="#product"
              className="group inline-flex items-center gap-2 text-sm font-medium text-white/80 transition-colors hover:text-white"
            >
              See it live
              <ArrowRight
                size={15}
                className="transition-transform duration-300 group-hover:translate-x-1"
              />
            </a>
          </motion.div>
        </div>

        {/* ── Right: parallax product mockup ── */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35, duration: 0.9, ease: "easeOut" }}
          className="relative"
          style={{ perspective: 1200 }}
        >
          <motion.div
            aria-hidden
            className="pointer-events-none absolute -inset-16 -z-10"
            style={{ background: glowBg }}
          />
          <motion.div
            style={{
              x: scardX,
              y: scardY,
              rotateX: rotX,
              rotateY: rotY,
              transformStyle: "preserve-3d",
            }}
            className="rotate-[-4deg]"
          >
            <ProductMock sx={sx} sy={sy} />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

function HeadingLine({ children }: { children: React.ReactNode }) {
  return (
    <span className="block overflow-hidden">
      <motion.span
        variants={{
          hidden: { y: "110%" },
          show: { y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } },
        }}
        className="block"
      >
        {children}
      </motion.span>
    </span>
  );
}

function ProductMock({
  sx,
  sy,
}: {
  sx: MotionValue<number>;
  sy: MotionValue<number>;
}) {
  return (
    <div
      className="relative overflow-hidden rounded-xl border shadow-2xl"
      style={{
        borderColor: "rgba(124,58,237,0.35)",
        backgroundColor: "rgba(17,17,17,0.9)",
        boxShadow: "0 40px 80px -20px rgba(0,0,0,0.8), 0 0 40px rgba(124,58,237,0.2)",
      }}
    >
      <div
        className="flex items-center gap-1.5 border-b px-3 py-2.5"
        style={{ borderColor: L.border }}
      >
        <span className="h-2 w-2 rounded-full" style={{ background: "#ff5f57" }} />
        <span className="h-2 w-2 rounded-full" style={{ background: "#febc2e" }} />
        <span className="h-2 w-2 rounded-full" style={{ background: "#28c840" }} />
        <span className="ml-2 text-[10px]" style={{ color: "#666" }}>
          Project Nebula — 3 online
        </span>
      </div>

      <div
        className="relative p-4"
        style={{
          backgroundImage: "radial-gradient(#222 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      >
        <div className="space-y-3">
          <MockRow color="#7C3AED" icon={<MessageSquare size={11} />} title="AI Chat">
            <p className="text-white/80">Maya: B2B or B2C for launch?</p>
            <p style={{ color: "#666" }}>Nebula AI: Your flow targets teams — go B2B.</p>
          </MockRow>
          <MockRow color="#3B82F6" icon={<Code2 size={11} />} title="Generate Code" mono>
            <p style={{ color: "#666" }}>def onboard(team):</p>
            <p style={{ color: "#666" }}>&nbsp;&nbsp;return invite(team)</p>
          </MockRow>
          <MockRow color="#F59E0B" icon={<GitBranch size={11} />} title="User Flow">
            <p style={{ color: "#666" }}>Sign up → Workspace → Invite</p>
          </MockRow>
        </div>

        {/* teammate cursors that drift with the mouse, each differently */}
        <FloatCursor member={CURSOR_TEAM[0]} sx={sx} sy={sy} depth={30} className="left-[22%] top-[28%]" />
        <FloatCursor member={CURSOR_TEAM[1]} sx={sx} sy={sy} depth={-22} className="left-[64%] top-[54%]" />
        <FloatCursor member={CURSOR_TEAM[2]} sx={sx} sy={sy} depth={16} className="left-[46%] top-[76%]" />
      </div>
    </div>
  );
}

function MockRow({
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
      className="rounded-xl border"
      style={{
        borderColor: L.border,
        borderLeft: `3px solid ${color}`,
        backgroundColor: "rgba(10,10,10,0.9)",
      }}
    >
      <div
        className="flex items-center gap-2 border-b px-3 py-1.5 text-[11px] font-medium text-white"
        style={{ borderColor: L.border }}
      >
        <span style={{ color }}>{icon}</span>
        {title}
      </div>
      <div className={`space-y-0.5 px-3 py-2 text-[10px] leading-relaxed ${mono ? "font-mono" : ""}`}>
        {children}
      </div>
    </div>
  );
}

function FloatCursor({
  member,
  sx,
  sy,
  depth,
  className,
}: {
  member: { name: string; color: string };
  sx: MotionValue<number>;
  sy: MotionValue<number>;
  depth: number;
  className: string;
}) {
  // sx/sy are normalized cursor offsets (-0.5..0.5); scale by depth so
  // each teammate cursor drifts a different amount and direction.
  const x = useTransform(sx, (v) => v * depth);
  const y = useTransform(sy, (v) => v * depth);
  return (
    <motion.div className={`absolute ${className}`} style={{ x, y }}>
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 1.5L13.5 7L8 8.5L6 14L2 1.5Z"
          fill={member.color}
          stroke="#0A0A0A"
          strokeWidth="1"
        />
      </svg>
      <span
        className="ml-3 rounded-md px-1.5 py-0.5 text-[9px] font-medium text-white"
        style={{ backgroundColor: member.color }}
      >
        {member.name}
      </span>
    </motion.div>
  );
}
