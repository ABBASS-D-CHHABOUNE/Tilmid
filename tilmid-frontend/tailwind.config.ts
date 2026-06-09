import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        cairo: ['var(--font-cairo)', 'sans-serif'],
      },
      colors: {
        primary: {
          50: "#f0f9ff",
          500: "#0ea5e9",
          600: "#0284c7",
          900: "#0c4a6e",
        },
        success: "#10b981",
        danger: "#ef4444",
        warning: "#f59e0b",
      },
      fontSize: {
        xs: ['12px', '16px'],
        sm: ['14px', '20px'],
        base: ['16px', '24px'],
        lg: ['18px', '28px'],
        xl: ['20px', '28px'],
        '2xl': ['24px', '32px'],
        '3xl': ['30px', '36px'],
        '4xl': ['36px', '40px'],
        '5xl': ['48px', '48px'],
      },
    },
  },
  plugins: [],
}
export default config