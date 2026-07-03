"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check } from "lucide-react";

export type ToastProps = {
  message: string;
  show: boolean;
  onDone: () => void;
  duration?: number;
};

/** Fixed-position auto-dismissing confirmation toast. */
export function Toast({ message, show, onDone, duration = 3000 }: ToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = window.setTimeout(onDone, duration);
    return () => window.clearTimeout(timer);
  }, [show, onDone, duration]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.15 }}
          className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm text-white shadow-card"
        >
          <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/15">
            <Check size={12} className="text-success" />
          </span>
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
