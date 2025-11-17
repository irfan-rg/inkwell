import type { Config } from "tailwindcss";

const config: Config = {
  // Keep shadcn/ui dark mode behavior using class strategy
  darkMode: "class",
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Base colors - Ink & Paper theme
        ink: {
          black: '#1A1A1A',
          gray: '#262626',
          DEFAULT: '#1A1A1A',
        },
        paper: {
          cream: '#FFFBF5',
          white: '#FEFEFE',
          warm: '#E8DCC4',
          dark: '#1C1C1E',
          elevated: '#2C2C2E',
          DEFAULT: '#FFFBF5',
        },
        gold: {
          50: '#FAF6ED',
          100: '#F4EBDB',
          200: '#E8D7B7',
          300: '#DCC393',
          400: '#D0AF6F',
          500: '#C9A961', // Main gold
          600: '#B8954A',
          700: '#8F7239',
          800: '#665228',
          900: '#3D3117',
        },
        burgundy: {
          DEFAULT: '#8B3A3A',
          light: '#A64D4D',
          dark: '#6B2929',
        },
        forest: {
          DEFAULT: '#2C5F2D',
          light: '#3D7A3E',
          dark: '#1B4332',
        },
        // Keep these for shadcn UI compatibility
        border: '#E8DCC4',
        input: '#FFFBF5',
        ring: '#C9A961',
        background: '#FFFBF5',
        foreground: '#1A1A1A',
        primary: {
          DEFAULT: '#C9A961',
          foreground: '#1A1A1A',
        },
        secondary: {
          DEFAULT: '#E8DCC4',
          foreground: '#1A1A1A',
        },
        muted: {
          DEFAULT: '#E8DCC4',
          foreground: '#525252',
        },
        accent: {
          DEFAULT: '#C9A961',
          foreground: '#1A1A1A',
        },
        destructive: {
          DEFAULT: '#8B3A3A',
          foreground: '#FEFEFE',
        },
        card: {
          DEFAULT: '#FEFEFE',
          foreground: '#1A1A1A',
        },
        popover: {
          DEFAULT: '#FEFEFE',
          foreground: '#1A1A1A',
        },
      },
      fontFamily: {
        hero: ['var(--font-hero)', 'Libre Baskerville', 'serif'],
        display: ['var(--font-display)', 'Playfair Display', 'serif'],
        body: ['var(--font-body)', 'Inter', 'sans-serif'],
        serif: ['var(--font-serif)', 'Crimson Pro', 'serif'],
        sans: ['var(--font-body)', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      // Custom border radius
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        xl: '1rem',
        '2xl': '1.5rem',
      },
      // Custom shadows (softer, warmer)
      boxShadow: {
        'soft': '0 2px 8px rgba(26, 26, 26, 0.08)',
        'medium': '0 4px 16px rgba(26, 26, 26, 0.12)',
        'large': '0 8px 32px rgba(26, 26, 26, 0.16)',
        'gold': '0 0 20px rgba(201, 169, 97, 0.3)',
        'inner-soft': 'inset 0 2px 4px rgba(26, 26, 26, 0.06)',
      },
      // Custom animations
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'shimmer': 'shimmer 2s infinite',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      // Custom typography
      typography: {
        DEFAULT: {
          css: {
            color: '#1A1A1A',
            lineHeight: '1.8',
            maxWidth: 'none',
            h1: {
              fontFamily: 'Playfair Display, serif',
              fontWeight: '700',
            },
            h2: {
              fontFamily: 'Playfair Display, serif',
              fontWeight: '600',
            },
            h3: {
              fontFamily: 'Playfair Display, serif',
              fontWeight: '600',
            },
            a: {
              color: '#C9A961',
              textDecoration: 'none',
              '&:hover': {
                color: '#B8954A',
              },
            },
            blockquote: {
              borderLeftColor: '#C9A961',
              borderLeftWidth: '4px',
              fontStyle: 'italic',
              color: '#525252',
            },
            code: {
              color: '#8B3A3A',
              backgroundColor: '#E8DCC4',
              padding: '0.25rem 0.5rem',
              borderRadius: '0.25rem',
            },
          },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
