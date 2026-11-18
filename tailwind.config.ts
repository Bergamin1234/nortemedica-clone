import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/context/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        nmBlue: {
          light: "#1a4373",
          DEFAULT: "#0b2545",
          dark: "#07192f"
        },
        nmRed: {
          DEFAULT: "#c52228",
          dark: "#991b1b"
        }
      }
    }
  },
  plugins: []
};

export default config;
