/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./*.jsx",
    "./*.js"
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["Sora", "sans-serif"],
        body: ["Manrope", "sans-serif"]
      },
      colors: {
        cyber: {
          50: "#eef7ff",
          100: "#d9ecff",
          500: "#2a84ff",
          700: "#0e3f88",
          900: "#081f47"
        }
      },
      boxShadow: {
        panel: "0 8px 40px rgba(8, 31, 71, 0.45)"
      }
    }
  },
  plugins: []
};


