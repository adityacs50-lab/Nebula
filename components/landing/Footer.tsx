"use client";

import Link from "next/link";
import { Sparkles } from "lucide-react";
import { L } from "./landing-ui";

const COLUMNS = [
  { heading: "Product", links: ["Features", "Pricing", "Changelog"] },
  { heading: "Company", links: ["About", "Blog", "Contact"] },
  { heading: "Legal", links: ["Privacy", "Terms"] },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t py-16" style={{ borderColor: L.border }}>
      <div className="mx-auto max-w-7xl px-5 md:px-10">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <Link href="/" className="flex items-center gap-2" data-cursor-hover>
              <Sparkles size={18} style={{ color: L.primary }} />
              <span className="font-semibold text-white">Nebula OS</span>
            </Link>
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#666" }}>
              The operating system for founding teams.
            </p>
            <div className="mt-6 flex flex-col gap-2 text-sm" style={{ color: "#666" }}>
              {["Twitter", "LinkedIn", "GitHub"].map((s) => (
                <a key={s} href="#" data-cursor-hover className="transition-colors hover:text-white">
                  {s}
                </a>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-10 sm:gap-16">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4 className="mb-4 text-xs uppercase tracking-widest" style={{ color: "#444" }}>
                  {col.heading}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" data-cursor-hover className="text-sm transition-colors hover:text-white" style={{ color: "#666" }}>
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-14 flex flex-col gap-2 border-t pt-6 text-xs md:flex-row md:justify-between" style={{ borderColor: L.border, color: "#444" }}>
          <span>© {new Date().getFullYear()} Nebula. Built for founders who build.</span>
        </div>
      </div>
    </footer>
  );
}
