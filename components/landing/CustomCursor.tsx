"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

/**
 * Branded two-part cursor: a small filled purple dot that tracks the
 * pointer exactly, and a larger hollow ring that lags behind (spring).
 * Over interactive elements the dot hides and the ring grows. Disabled
 * on touch / coarse pointers, where a custom cursor is just overhead.
 */
export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);
  const dotX = useMotionValue(-100);
  const dotY = useMotionValue(-100);
  const ringX = useSpring(dotX, { stiffness: 220, damping: 24, mass: 0.4 });
  const ringY = useSpring(dotY, { stiffness: 220, damping: 24, mass: 0.4 });
  const raf = useRef<number>();

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");

    const move = (e: PointerEvent) => {
      cancelAnimationFrame(raf.current ?? 0);
      raf.current = requestAnimationFrame(() => {
        dotX.set(e.clientX);
        dotY.set(e.clientY);
        const el = e.target as HTMLElement | null;
        setHovering(Boolean(el?.closest("a, button, [data-cursor-hover]")));
      });
    };
    window.addEventListener("pointermove", move);
    return () => {
      window.removeEventListener("pointermove", move);
      document.documentElement.classList.remove("has-custom-cursor");
      cancelAnimationFrame(raf.current ?? 0);
    };
  }, [dotX, dotY]);

  if (!enabled) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-[999] hidden md:block">
      <motion.div
        className="absolute h-2 w-2 rounded-full"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          backgroundColor: "#7C3AED",
          opacity: hovering ? 0 : 1,
        }}
      />
      <motion.div
        className="absolute rounded-full border"
        animate={{ width: hovering ? 48 : 32, height: hovering ? 48 : 32 }}
        transition={{ type: "spring", stiffness: 300, damping: 22 }}
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: hovering
            ? "rgba(124,58,237,0.8)"
            : "rgba(255,255,255,0.3)",
        }}
      />
    </div>
  );
}
