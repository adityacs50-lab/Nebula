"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
  type MouseEvent,
} from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useInView,
  animate,
} from "framer-motion";

/* ── Magnetic: element leans toward the cursor ─────────────── */

export function Magnetic({
  children,
  strength = 0.35,
  className,
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useSpring(useMotionValue(0), { stiffness: 180, damping: 15 });
  const y = useSpring(useMotionValue(0), { stiffness: 180, damping: 15 });

  function onMouseMove(e: MouseEvent<HTMLDivElement>) {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength);
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength);
  }

  function onMouseLeave() {
    x.set(0);
    y.set(0);
  }

  return (
    <motion.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{ x, y }}
      className={`inline-block ${className ?? ""}`}
    >
      {children}
    </motion.div>
  );
}

/* ── ScrambleText: letters randomize then settle ───────────── */

const GLYPHS = "!<>-_\\/[]{}—=+*^?#";

export function ScrambleText({
  text,
  className,
  delay = 0,
  rescrambleOnHover = false,
}: {
  text: string;
  className?: string;
  delay?: number;
  rescrambleOnHover?: boolean;
}) {
  const [display, setDisplay] = useState(text);
  const frame = useRef(0);
  const raf = useRef<number>();

  function scramble() {
    cancelAnimationFrame(raf.current ?? 0);
    frame.current = 0;
    const total = Math.max(text.length * 2.2, 14);
    const step = () => {
      frame.current += 1;
      const progress = frame.current / total;
      const settled = Math.floor(progress * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        if (text[i] === " ") out += " ";
        else if (i < settled) out += text[i];
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setDisplay(out);
      if (progress < 1) raf.current = requestAnimationFrame(step);
      else setDisplay(text);
    };
    raf.current = requestAnimationFrame(step);
  }

  useEffect(() => {
    const t = window.setTimeout(scramble, delay * 1000);
    return () => {
      window.clearTimeout(t);
      cancelAnimationFrame(raf.current ?? 0);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text]);

  return (
    <span
      className={className}
      onMouseEnter={rescrambleOnHover ? scramble : undefined}
      aria-label={text}
    >
      {display}
    </span>
  );
}

/* ── CountUp: number rolls up when scrolled into view ──────── */

export function CountUp({
  to,
  prefix = "",
  suffix = "",
  className,
}: {
  to: number;
  prefix?: string;
  suffix?: string;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.4,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {value}
      {suffix}
    </span>
  );
}
