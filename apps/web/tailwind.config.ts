import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./features/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--bg-main, #0B0D14)",
        surface: "var(--bg-secondary, #111725)",
        panel: "var(--bg-panel, #171E2C)",
        border: "var(--border-color, rgba(255, 255, 255, 0.08))",
        accent: {
          DEFAULT: "var(--accent-primary, #6366F1)",
          secondary: "var(--accent-secondary, #38BDF8)",
          hover: "var(--accent-hover, #4F46E5)",
        },
        status: {
          success: "#10B981",
          warning: "#F59E0B",
          error: "#EF4444",
          info: "#38BDF8",
        },
        text: {
          primary: "var(--text-primary, #F8FAFC)",
          secondary: "var(--text-secondary, #94A3B8)",
          muted: "var(--text-muted, #64748B)",
        },
      },
      fontFamily: {
        sans: [
          "-apple-system",
          "BlinkMacSystemFont",
          "SF Pro Display",
          "Inter",
          "system-ui",
          "sans-serif",
        ],
        mono: [
          "JetBrains Mono",
          "SF Mono",
          "Menlo",
          "Monaco",
          "Fira Code",
          "monospace",
        ],
      },
      boxShadow: {
        glass: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
        "glass-sm": "0 4px 16px 0 rgba(0, 0, 0, 0.25)",
        "glass-lg": "0 16px 48px 0 rgba(0, 0, 0, 0.5)",
        "apple-soft": "0 2px 20px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
        "apple-glow": "0 0 25px -5px var(--accent-primary, #6366F1)",
      },
      borderRadius: {
        "apple-card": "20px",
        "apple-pill": "9999px",
        "apple-modal": "24px",
      },
      backdropBlur: {
        xs: "2px",
        glass: "20px",
        super: "40px",
      },
    },
  },
  plugins: [],
};

export default config;
