"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Menu, X, ArrowRight } from "lucide-react";
import { GradientButton, L } from "./landing-ui";
import { scrollToAnchor } from "./SmoothScroll";

const LINKS = [
  { label: "Features", hash: "#features" },
  { label: "Pricing", hash: "#pricing" },
  { label: "Blog", hash: "#footer" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);

  function go(hash: string) {
    setOpen(false);
    scrollToAnchor(hash);
  }

  return (
    <motion.header
      initial={{ y: -64, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md"
      style={{ borderColor: L.border, backgroundColor: "rgba(10,10,10,0.72)" }}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <Sparkles size={19} style={{ color: L.primary }} />
          <span className="text-lg font-semibold tracking-tight text-white">
            Nebula
          </span>
        </Link>

        {/* Desktop links */}
        <nav className="hidden items-center gap-8 md:flex">
          {LINKS.map((link, i) => (
            <motion.button
              key={link.label}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + i * 0.07 }}
              onClick={() => go(link.hash)}
              className="group relative text-sm transition-colors hover:text-white"
              style={{ color: L.text2 }}
            >
              {link.label}
              <span
                className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-300 group-hover:w-full"
                style={{ background: L.gradient }}
              />
            </motion.button>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <Link
            href="/auth/login"
            className="text-sm transition-colors hover:text-white"
            style={{ color: L.text2 }}
          >
            Log in
          </Link>
          <Link href="/auth/signup">
            <GradientButton className="!px-4 !py-2">
              Start free
              <ArrowRight size={14} />
            </GradientButton>
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex h-9 w-9 items-center justify-center rounded-xl border md:hidden"
          style={{ borderColor: L.border }}
          aria-label="Menu"
        >
          {open ? <X size={17} className="text-white" /> : <Menu size={17} className="text-white" />}
        </button>
      </div>

      {/* Mobile drawer */}
      <AnimatePresence>
        {open && (
          <motion.nav
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="overflow-hidden border-t md:hidden"
            style={{ borderColor: L.border, backgroundColor: "rgba(10,10,10,0.95)" }}
          >
            <div className="flex flex-col gap-1 px-5 py-4">
              {LINKS.map((link) => (
                <button
                  key={link.label}
                  onClick={() => go(link.hash)}
                  className="rounded-xl px-3 py-2.5 text-left text-sm text-white/90 transition-colors hover:bg-white/[0.05]"
                >
                  {link.label}
                </button>
              ))}
              <Link
                href="/auth/login"
                className="rounded-xl px-3 py-2.5 text-sm text-white/90 transition-colors hover:bg-white/[0.05]"
              >
                Log in
              </Link>
              <Link href="/auth/signup" className="mt-2">
                <GradientButton className="w-full">
                  Start free
                  <ArrowRight size={14} />
                </GradientButton>
              </Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
