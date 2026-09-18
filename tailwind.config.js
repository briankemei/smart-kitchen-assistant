/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Kitchen brand scale (Primary green/emerald)
        kitchen: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          900: '#14532d',
          950: '#052e16',
        },
        // Biotech functional & telemetry accents
        biotech: {
          blue: {
            DEFAULT: '#0ea5e9',
            light: '#38bdf8',
            dark: '#0284c7',
            glow: 'rgba(14, 165, 233, 0.25)',
          },
          purple: {
            DEFAULT: '#8b5cf6',
            light: '#a78bfa',
            dark: '#7c3aed',
            glow: 'rgba(139, 92, 246, 0.25)',
          },
          amber: {
            DEFAULT: '#f59e0b',
            light: '#fbbf24',
            dark: '#d97706',
            glow: 'rgba(245, 158, 11, 0.25)',
          },
          rose: {
            DEFAULT: '#f43f5e',
            light: '#fb7185',
            dark: '#e11d48',
            glow: 'rgba(244, 63, 94, 0.25)',
          },
          emerald: {
            DEFAULT: '#10b981',
            light: '#34d399',
            dark: '#059669',
            glow: 'rgba(16, 185, 129, 0.25)',
          },
        },
        // Semantic surface hierarchy
        surface: {
          950: '#030712', // Deepest canvas background
          900: '#0b1322', // Primary surface/container
          850: '#0f1b2d', // Elevated surface
          800: '#16253b', // Card & panel background
          750: '#1e324f', // Card hover / interactive surface
          700: '#284166', // Subtle dividers & inner borders
          border: '#1e293b', // Standard container border
          borderLight: '#334155', // Highlight border
        },
        // Semantic typography tokens with WCAG AA compliance (contrast >= 4.5:1)
        content: {
          primary: '#f8fafc',   // Slate-50: Main headings & titles
          secondary: '#cbd5e1', // Slate-300: High-contrast body text & labels
          muted: '#94a3b8',     // Slate-400: Subtitles & secondary info (passes 4.5:1)
          disabled: '#64748b',  // Slate-500: Disabled states only
        }
      },
      borderRadius: {
        // Enforced corner scale
        'btn': '0.75rem',    // rounded-xl for buttons & inputs
        'card': '1rem',      // rounded-2xl for cards & panels
        'modal': '1.5rem',   // rounded-3xl for modal dialogs
        'pill': '9999px',    // rounded-full for badges & avatars
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
