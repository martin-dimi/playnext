import { type Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.tsx"],
  plugins: [tailwindcssAnimate, require("tailwindcss-animate")],
  theme: {
    extend: {
      fontFamily: {
        chakra: ["var(--font-chakra)"],
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        gold: "#FFCD00",
        muted: "#434343",
      },
    },
  },
} satisfies Config;
