"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { L } from "./landing-ui";
import { Magnetic, ScrambleText } from "./interactions";
import { scrollToAnchor } from "./SmoothScroll";

const LINKS = [
  { label: "Features", hash: "#features" },
  { label: "Pricing", hash: "#pricing" },
  { label: "Changelog", hash: "#footer" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (v) => setScrolled(v > 24));

  function go(hash: string) {
    setOpen(false);
    scrollToAnchor(hash);
  }

  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-[100] transition-colors duration-300"
      style={{
        backgroundColor: scrolled ? "rgba(10,10,10,0.72)" : "transparent",
        backdropFilter: scrolled ? "blur(12px)" : "none",
        borderBottom: `1px solid ${scrolled ? L.border : "transparent"}`,
      }}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 md:px-10">
        <Link href="/" className="flex items-center gap-2" data-cursor-hover>
          <Sparkles size={18} style={{ color: L.primary }} />
          <span className="text-base font-semibold tracking-tight text-white">
            Nebula
          </span>
        </Link>

        <nav className="hidden items-center gap-9 md:flex">
          {LINKS.map((link) => (
            <button
              key={link.label}
              onClick={() => go(link.hash)}
              data-cursor-hover
              className="text-sm transition-colors hover:text-white"
              style={{ color: "#888" }}
            >
              <ScrambleText text={link.label} rescrambleOnHover />
            </button>
          ))}
        </nav>

        <div className="hidden items-center gap-5 md:flex">
          <Link
            href="/auth/login"
            data-cursor-hover
            className="text-sm transition-colors hover:text-white"
            style={{ color: "#888" }}
          >
            Sign in
          </Link>
          <Magnetic strength={0.4}>
            <Link href="/auth/signup">
              <span
                className="inline-flex items-center gap-2 rounded-full px-5 py-2 text-sm font-semibold text-white"
                style={{ background: L.gradient, boxShadow: "0 0 20px rgba(124,58,237,0.3)" }}
              >
                Get started
                <ArrowRight size={13} />
              </span>
            </Link>
          </Magnetic>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border md:hidden"
          style={{ borderColor: L.border }}
          aria-label="Menu"
        >
          {open ? <X size={17} className="text-white" /> : <Menu size={17} className="text-white" />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: L.border, backgroundColor: "rgba(10,10,10,0.96)" }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => go(link.hash)}
                  className="rounded-xl px-3 py-2.5 text-left text-sm text-white/90 hover:bg-white/[0.05]"
                >
                  {link.label}
                </button>
              ))}
              <Link href="/auth/login" className="rounded-xl px-3 py-2.5 text-sm text-white/90 hover:bg-white/[0.05]">
                Sign in
              </Link>
              <Link
                href="/auth/signup"
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white"
                style={{ background: L.gradient }}
              >
                Get started
                <ArrowRight size={13} />
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
