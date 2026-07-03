"use client";

import { L } from "./landing-ui";

const ITEMS = [
  "Real-time multiplayer",
  "Shared AI context",
  "6 AI block types",
  "$49/month flat",
  "Deploy in minutes",
  "One canvas for the whole team",
];

export function Ticker() {
  return (
    <div className="relative overflow-hidden border-y py-4" style={{ borderColor: L.border }}>
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-[#0A0A0A] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-[#0A0A0A] to-transparent" />
      <div className="flex">
        <div className="animate-marquee flex shrink-0 items-center gap-10 pr-10">
          {[...ITEMS, ...ITEMS].map((item, i) => (
            <span
              key={`${item}-${i}`}
              className="flex items-center gap-3 whitespace-nowrap text-sm"
              style={{ color: "#333" }}
            >
              <span style={{ color: L.primary }}>✦</span>
              {item}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
