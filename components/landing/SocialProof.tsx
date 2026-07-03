"use client";

import { motion } from "framer-motion";

const LOGOS = ["BuildFast", "DataLayer", "Loopcast", "Hyperdrive", "Stackline", "Orbital"];

export function SocialProof() {
  return (
    <section className="py-16">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 md:flex-row md:justify-center md:gap-12 md:px-10">
        <p className="whitespace-nowrap text-xs uppercase tracking-widest" style={{ color: "#444" }}>
          Trusted by founding teams from
        </p>
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
          {LOGOS.map((logo, i) => (
            <motion.span
              key={logo}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.5 }}
              data-cursor-hover
              className="cursor-default text-base font-semibold tracking-tight transition-colors duration-300 hover:text-white"
              style={{ color: "#333" }}
            >
              {logo}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
