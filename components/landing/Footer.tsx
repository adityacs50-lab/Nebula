"use client";

import Link from "next/link";
import { Sparkles, Twitter, Linkedin, Github } from "lucide-react";
import { L } from "./landing-ui";

const COLUMNS = [
  {
    heading: "Product",
    links: ["Features", "Pricing", "Changelog"],
  },
  {
    heading: "Company",
    links: ["About", "Blog", "Contact"],
  },
  {
    heading: "Legal",
    links: ["Privacy Policy", "Terms of Service"],
  },
];

export function Footer() {
  return (
    <footer id="footer" className="border-t py-14" style={{ borderColor: L.border }}>
      <div className="mx-auto max-w-6xl px-5 md:px-6">
        <div className="flex flex-col gap-12 md:flex-row md:justify-between">
          <div className="max-w-xs">
            <div className="flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <Sparkles size={18} style={{ color: L.primary }} />
                <span className="font-semibold text-white">Nebula</span>
              </Link>
              <div className="flex items-center gap-3 md:hidden">
                <FooterSocial />
              </div>
            </div>
            <p className="mt-3 text-sm" style={{ color: L.text2 }}>
              The shared AI brain for founding teams.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            {COLUMNS.map((col) => (
              <div key={col.heading}>
                <h4 className="mb-4 text-xs font-semibold uppercase tracking-widest" style={{ color: L.text3 }}>
                  {col.heading}
                </h4>
                <ul className="space-y-2.5">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-sm transition-colors hover:text-white"
                        style={{ color: L.text2 }}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="hidden items-start gap-3 md:flex">
            <FooterSocial />
          </div>
        </div>

        <div
          className="mt-12 border-t pt-6 text-center text-xs"
          style={{ borderColor: L.border, color: L.text3 }}
        >
          © {new Date().getFullYear()} Nebula. Built for founders who build.
        </div>
      </div>
    </footer>
  );
}

function FooterSocial() {
  return (
    <>
      {[
        { icon: <Twitter size={15} />, label: "Twitter" },
        { icon: <Linkedin size={15} />, label: "LinkedIn" },
        { icon: <Github size={15} />, label: "GitHub" },
      ].map((s) => (
        <a
          key={s.label}
          href="#"
          aria-label={s.label}
          className="flex h-9 w-9 items-center justify-center rounded-xl border transition-colors hover:border-white/40 hover:text-white"
          style={{ borderColor: L.border, color: L.text2 }}
        >
          {s.icon}
        </a>
      ))}
    </>
  );
}
