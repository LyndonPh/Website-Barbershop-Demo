module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./node_modules/@relume_io/relume-ui/dist/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require("@relume_io/relume-tailwind")],
  theme: {
    extend: {
      colors: {
        shop: {
          bg: "#0C0C0C",
          surface: "#141414",
          elevated: "#1A1A1A",
          border: "#2A2A2A",
          text: "#F0EDE6",
          muted: "#6B6560",
          gold: "#C8A96E",
          "gold-light": "#DFC08A",
        },
      },
      fontFamily: {
        playfair: ["Playfair Display", "Georgia", "serif"],
        sans: ["DM Sans", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        widest2: "0.25em",
      },
    },
  },
};
