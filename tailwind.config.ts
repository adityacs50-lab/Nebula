import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./hooks/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0D0D0D",
        surface: "#1A1A1A",
        "surface-hover": "#222222",
        border: "#2A2A2A",
        primary: "#7C3AED",
        "primary-hover": "#8B5CF6",
        secondary: "#3B82F6",
        "text-primary": "#FFFFFF",
        "text-secondary": "#888888",
        success: "#10B981",
        error: "#EF4444",
        "block-chat": "#7C3AED",
        "block-code": "#3B82F6",
        "block-image": "#EC4899",
        "block-flow": "#F59E0B",
        "block-api": "#10B981",
        "block-mindmap": "#06B6D4",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      borderRadius: {
        DEFAULT: "8px",
        lg: "10px",
        xl: "12px",
        "2xl": "12px",
        "3xl": "12px",
      },
      boxShadow: {
        glow: "0 0 0 2px #7C3AED, 0 0 20px rgba(124, 58, 237, 0.3)",
        "glow-soft": "0 0 40px rgba(124, 58, 237, 0.15)",
        card: "0 4px 24px rgba(0, 0, 0, 0.4)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out both",
        blink: "blink 1s step-start infinite",
      },
    },
  },
  plugins: [typography],
};

export default config;
