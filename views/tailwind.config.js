import flowbite from "flowbite/plugin";

// tailwind.config.js
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      mobile: "350px",
      tab: "750px",
      pc: "1024px",
      sm: "350px",
      md: "750px",
      lg: "1024px",
    },
    extend: {
      colors: {
        primary: {
          50: "#f9f4ff",
          100: "#f2e7ff",
          200: "#e7d3ff",
          300: "#d4b0ff",
          400: "#b97eff",
          500: "#9e4cff",
          600: "#8829f4",
          700: "#7519d7",
          800: "#641aaf",
          900: "#53168d",
          950: "#360269",
        },
        secondary: {
          50: "#feffe7",
          100: "#faffc1",
          200: "#faff86",
          300: "#fffe41",
          400: "#fff20d",
          500: "#ffe400",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        slowBounce: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10%)' },
        },
      },
      animation: {
        'slow-bounce': 'slowBounce 3s ease-in-out infinite',
      },
    },
  },
  plugins: [flowbite,],
};
