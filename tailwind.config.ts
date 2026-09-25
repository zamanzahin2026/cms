import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        surface: "var(--surface)",
        surface_muted: "var(--surface-muted)",
        border: "var(--border)",
        text_primary: "var(--text-primary)",
        text_secondary: "var(--text-secondary)",
        text_muted: "var(--text-muted)",
        sage_50: "var(--sage-50)",
        sage_100: "var(--sage-100)",
        sage_200: "var(--sage-200)",
        sage_400: "var(--sage-400)",
        sage_600: "var(--sage-600)",
        sage_700: "var(--sage-700)",
        accent_coral: "var(--accent-coral)",
        footer_base: "var(--footer-base)",
        footer_glow: "var(--footer-glow)",
      },
      fontFamily: {
        serif: ["var(--font-instrument-serif)", "Georgia", "Times New Roman", "serif"],
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        page: "28px",
        card: "20px",
        inner: "14px",
        pill: "9999px",
      },
      boxShadow: {
        card: "0 1px 2px rgba(28,31,26,0.04), 0 8px 24px rgba(28,31,26,0.06)",
        dashboard: "0 30px 80px rgba(40,55,30,0.18)",
        chip: "0 6px 20px rgba(0,0,0,0.12)",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(180deg, #F5F7F1 0%, #DFE7D3 55%, #B7C6A2 100%)",
        "primary-btn": "linear-gradient(180deg, #8CA174 0%, #6F8559 100%)",
        "wide-btn": "linear-gradient(90deg, #6F8559 0%, #9CAF86 100%)",
        "footer-gradient": "radial-gradient(ellipse at 45% 70%, #3A4733 0%, #242E20 50%, #161C14 100%)",
      },
      maxWidth: {
        content: "1200px",
      },
    },
  },
  plugins: [],
};

export default config;
