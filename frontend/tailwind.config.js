/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "var(--primary)",
        accent: "var(--accent)",
        nav: "var(--nav)",
      },
      borderRadius: {
        skin: "var(--radius)",
      },
    },
  },
  plugins: [],
};
