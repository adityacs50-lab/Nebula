"use client";

import { type ReactNode } from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

type MotionButtonProps = Omit<HTMLMotionProps<"button">, "children"> & {
  children: ReactNode;
};

/* Design tokens for the landing page (kept separate from the app UI). */
export const L = {
  bg: "#0A0A0A",
  surface: "#111111",
  border: "#1F1F1F",
  primary: "#7C3AED",
  secondary: "#3B82F6",
  gradient: "linear-gradient(135deg, #7C3AED, #3B82F6)",
  text2: "#888888",
  text3: "#444444",
  glow: "0 0 40px rgba(124, 58, 237, 0.3)",
} as const;

export const CURSOR_TEAM = [
  { name: "Maya", color: "#7C3AED" },
  { name: "Sam", color: "#EC4899" },
  { name: "Alex", color: "#3B82F6" },
  { name: "Taylor", color: "#10B981" },
  { name: "David", color: "#F59E0B" },
] as const;

export function GradientButton({
  children,
  className = "",
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`group relative inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-semibold text-white transition-shadow duration-300 ${className}`}
      style={{ background: L.gradient, boxShadow: "0 0 24px rgba(124,58,237,0.25)" }}
      {...props}
    >
      <span
        aria-hidden
        className="absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{ boxShadow: L.glow }}
      />
      <span className="relative flex items-center gap-2">{children}</span>
    </motion.button>
  );
}

export function OutlineButton({
  children,
  className = "",
  ...props
}: MotionButtonProps) {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.98 }}
      className={`inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 px-6 py-3 text-sm font-semibold text-white transition-colors hover:border-white/50 hover:bg-white/[0.04] ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

/** Standard scroll-into-view fade-up. */
export const fadeUp = {
  initial: { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.6, ease: "easeOut" },
} as const;

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow?: string;
  title: ReactNode;
  subtitle?: ReactNode;
}) {
  return (
    <motion.div {...fadeUp} className="mx-auto mb-16 max-w-2xl text-center">
      {eyebrow && (
        <p className="mb-3 text-sm font-medium" style={{ color: L.primary }}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-4xl font-bold tracking-tight text-white md:text-5xl">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-lg leading-relaxed" style={{ color: L.text2 }}>
          {subtitle}
        </p>
      )}
    </motion.div>
  );
}
