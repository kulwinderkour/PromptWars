import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        venue: {
          primary: "#000000",
          secondary: "#333333",
          accent: "#555555",
          warning: "#666666",
          danger: "#444444",
          surface: "#ffffff",
          card: "#f9f9f9",
          muted: "#e5e5e5",
        },
      },
    },
  },
  plugins: [],
};
export default config;
