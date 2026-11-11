import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // the template uses a 12% opacity modifier (e.g. border-[#3B2217]/12), which is not in Tailwind v3's default scale
      opacity: {
        12: "0.12",
      },
    },
  },
  plugins: [],
};

export default config;
