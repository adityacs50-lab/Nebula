"use client";

import { useEffect, type ReactNode } from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Lenis smooth scrolling, driven by GSAP's ticker so ScrollTrigger and
 * Lenis share one clock. The instance is exposed on window so the navbar
 * can do eased anchor scrolls.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.1 });
    window.__lenis = lenis;

    lenis.on("scroll", ScrollTrigger.update);
    const raf = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(raf);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);

  return <>{children}</>;
}

/** Eased scroll to an anchor, falling back to native if Lenis is gone. */
export function scrollToAnchor(hash: string) {
  const el = document.querySelector(hash);
  if (!el) return;
  if (window.__lenis) {
    window.__lenis.scrollTo(el as HTMLElement, { offset: -90, duration: 1.1 });
  } else {
    el.scrollIntoView({ behavior: "smooth" });
  }
}
