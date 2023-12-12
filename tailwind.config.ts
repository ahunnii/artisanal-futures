/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      gridTemplateRows: {
        layout: "max-content 1fr max-content",
      },

      backgroundImage: {
        femaleForm:
          "url('https://media.githubusercontent.com/media/robinsonkwame/af-parametric-sewing/main/static/model-breasts-standing.jpg')",
        rulerVertical:
          "url('https://raw.githubusercontent.com/robinsonkwame/af-parametric-sewing/4074fa1ae9314b76265fa16134613b563cfa7b13/tmp/tape_vertical.jpeg')",
        rulerHorizontal:
          "url('https://raw.githubusercontent.com/robinsonkwame/af-parametric-sewing/4074fa1ae9314b76265fa16134613b563cfa7b13/tmp/tape_horizontal.jpeg')",
        shoulderToWrist: "url('/img/shoulder_to_wrist.svg')",
        bicep: "url('/img/biceps.svg')",
        wrist: "url('/img/wrist.svg')",
        ankle: "url('/img/ankle.svg')",
        inseam: "url('/img/inseam.svg')",
        knee: "url('/img/knee.svg')",
        seatBack: "url('/img/seat_back.svg')",
        blank: "url('/img/blank.svg')",
        "circle-grid": "url('/images/bg-circlegrid.svg')",
        "circle-grid-dark": "url('/images/bg-circlegrid-dark.svg')",
      },
      backgroundColor: {
        "forum-primary": "#fff",
        "forum-primary-inverse": "#1a1b21",
        "forum-secondary": "#fafbfc",
        "forum-secondary-inverse": "#30313a",
        "forum-green": "#13862e",
        "forum-green-light": "#effff3",
        "forum-yellow-light": "#fffbe4",
      },
      textColor: {
        "forum-primary": "#1a1b21",
        "forum-primary-inverse": "#fff",
        "forum-secondary": "#5a5f68",
        "forum-secondary-inverse": "#fafbfc",
        "forum-blue": "#0e73cc",
        "forum-green": "#13862e",
        "forum-orange": "#c43c02",
        "forum-red": "#dd243c",
        "forum-red-disabled": "#ff909f",
        "forum-red-light": "#ff455d",
        "forum-purple": "#624bbb",
        "forum-purple-light": "#a18bf5",
      },
      borderColor: {
        // DEFAULT: "var(--border-primary)",
        "forum-primary": "#ebeef2",
        "forum-secondary": "#d0d3d7",
        "forum-green": "#13862e",
        "forum-yellow-light": "#fed54a",
      },
      transitionTimingFunction: {
        spring: "cubic-bezier(.25,1.6,.5,.8)",
      },
      divideColor: {
        "forum-primary": "#ebeef2",
        "forum-secondary": "#d0d3d7",
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",

        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      height: {
        button: "34px",
      },
      width: {
        "icon-button": "34px",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
        "fade-hero": {
          "0%, 20%, 100%": { opacity: 1 },
          "34%, 88%": { opacity: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-hero": "fade-hero 12s infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("tailwindcss-animation-delay"),
  ],
};
