"use client";

import { useRef, type ReactNode, type MouseEvent } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
} from "framer-motion";
import {
  MessageSquare,
  Code2,
  Image as ImageIcon,
  GitBranch,
  Plug,
  Network,
} from "lucide-react";
import { L } from "./landing-ui";

type Feature = {
  n: string;
  title: string;
  lines: string[];
  color: string;
  icon: ReactNode;
  span: string;
  from: number;
};

const FEATURES: Feature[] = [
  {
    n: "01",
    title: "AI Chat",
    lines: ["Ask anything as a team.", "Everyone sees the answer.", "AI remembers your full history."],
    color: "#7C3AED",
    icon: <MessageSquare size={16} />,
    span: "md:col-span-3",
    from: -1,
  },
  {
    n: "02",
    title: "Generate Code",
    lines: ["Describe it. Get production code.", "Python, TypeScript, Rust, Go.", "Syntax highlighted. Copy-ready."],
    color: "#3B82F6",
    icon: <Code2 size={16} />,
    span: "md:col-span-2",
    from: 1,
  },
  {
    n: "03",
    title: "AI Image",
    lines: ["Describe a visual. See it instantly.", "Product mockups. Diagrams. Assets.", "All on your shared canvas."],
    color: "#EC4899",
    icon: <ImageIcon size={16} />,
    span: "md:col-span-2",
    from: -1,
  },
  {
    n: "04",
    title: "User Flow",
    lines: ["Map your product visually.", "Drag, connect, share instantly.", "Your whole team sees it live."],
    color: "#F59E0B",
    icon: <GitBranch size={16} />,
    span: "md:col-span-3",
    from: 1,
  },
  {
    n: "05",
    title: "API Integration",
    lines: ["Generate, test, document.", "TypeScript-first. Copy-paste ready.", "No more Postman tab switching."],
    color: "#10B981",
    icon: <Plug size={16} />,
    span: "md:col-span-3",
    from: -1,
  },
  {
    n: "06",
    title: "Mind Map",
    lines: ["Brainstorm as a team.", "AI clusters your ideas.", "Connections emerge automatically."],
    color: "#06B6D4",
    icon: <Network size={16} />,
    span: "md:col-span-2",
    from: 1,
  },
];

export function Features() {
  return (
    <section id="features" className="relative py-28 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-16 max-w-2xl text-[clamp(2rem,4.5vw,3rem)] font-thin leading-tight tracking-tight text-white"
        >
          Every tool your team needs.{" "}
          <span className="font-bold">In one place.</span>
        </motion.h2>

        <div className="grid gap-5 md:grid-cols-5">
          {FEATURES.map((f, i) => (
            <TiltFeature key={f.n} feature={f} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function TiltFeature({ feature, index }: { feature: Feature; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });
  const ry = useSpring(useMotionValue(0), { stiffness: 150, damping: 18 });

  function onMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    ry.set(((e.clientX - rect.left) / rect.width - 0.5) * 8);
    rx.set(-((e.clientY - rect.top) / rect.height - 0.5) * 8);
  }
  function reset() {
    rx.set(0);
    ry.set(0);
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: feature.from * 40 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.55, delay: (index % 2) * 0.08, ease: "easeOut" }}
      className={feature.span}
      style={{ perspective: 1000 }}
    >
      <motion.div
        ref={ref}
        onMouseMove={onMove}
        onMouseLeave={reset}
        whileHover={{ y: -4 }}
        style={{ rotateX: rx, rotateY: ry, transformStyle: "preserve-3d" }}
        data-cursor-hover
        className="group relative h-full overflow-hidden rounded-xl border p-7 transition-colors duration-300"
      >
        {/* top accent line */}
        <span
          className="absolute inset-x-0 top-0 h-0.5"
          style={{ background: feature.color }}
        />
        <div
          className="absolute inset-0 rounded-xl border transition-colors duration-300 group-hover:border-white/20"
          style={{ borderColor: L.border, backgroundColor: L.surface }}
        />
        <div className="relative">
          <div className="mb-6 flex items-start justify-between">
            <span style={{ color: feature.color }}>{feature.icon}</span>
            <span
              className="font-mono text-sm transition-colors duration-300 group-hover:text-[#7C3AED]"
              style={{ color: "#444" }}
            >
              {feature.n}
            </span>
          </div>
          <h3 className="mb-3 text-2xl font-bold tracking-tight text-white">
            {feature.title}
          </h3>
          <div className="space-y-1">
            {feature.lines.map((line) => (
              <p key={line} className="text-sm leading-relaxed" style={{ color: "#666" }}>
                {line}
              </p>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
