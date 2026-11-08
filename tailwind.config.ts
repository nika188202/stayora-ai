import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: { extend: { colors: {
    ink: "#242522", muted: "#77786F", cream: "#F7F6F1", panel: "#FFFFFF",
    line: "#E7E6DF", olive: "#66745B", oliveDark: "#46523E", sand: "#EAE7DD"
  }, boxShadow: { soft: "0 12px 40px rgba(36,37,34,.06)" } } },
  plugins: []
};
export default config;