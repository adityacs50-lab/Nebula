"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropdownOption<T extends string> = {
  value: T;
  label: string;
};

export type DropdownProps<T extends string> = {
  options: Array<DropdownOption<T>>;
  value: T;
  onChange: (value: T) => void;
  className?: string;
  size?: "sm" | "md";
};

export function Dropdown<T extends string>({
  options,
  value,
  onChange,
  className,
  size = "md",
}: DropdownProps<T>) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-surface text-text-primary transition-colors hover:border-primary/60",
          size === "sm" ? "h-7 px-2 text-xs" : "h-9 px-3 text-sm",
        )}
      >
        <span className="truncate">{selected?.label ?? value}</span>
        <ChevronDown
          size={size === "sm" ? 12 : 14}
          className={cn("text-text-secondary transition-transform", open && "rotate-180")}
        />
      </button>
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 top-full z-30 mt-1 w-full min-w-[120px] overflow-hidden rounded-lg border border-border bg-surface py-1 shadow-card"
          >
            {options.map((option) => (
              <li key={option.value}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "w-full px-3 py-1.5 text-left text-xs transition-colors hover:bg-surface-hover",
                    option.value === value
                      ? "text-primary"
                      : "text-text-primary",
                  )}
                >
                  {option.label}
                </button>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </div>
  );
}

export type MenuDropdownProps = {
  trigger: ReactNode;
  children: ReactNode;
  align?: "left" | "right";
  className?: string;
};

/** Freeform dropdown panel anchored to an arbitrary trigger. */
export function MenuDropdown({
  trigger,
  children,
  align = "right",
  className,
}: MenuDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} className="relative">
      <div onClick={() => setOpen((v) => !v)}>{trigger}</div>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className={cn(
              "absolute top-full z-40 mt-2 w-72 rounded-xl border border-border bg-surface p-4 shadow-card",
              align === "right" ? "right-0" : "left-0",
              className,
            )}
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
