/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Wedding theme colors (matching public site)
        linen: '#F6F2EA',
        shell: '#FFFFFF',
        sand: '#E7DDCF',
        driftwood: '#6F6A62',
        ink: '#151C2D',

        // Accents
        sky: {
          DEFAULT: '#91B5E5',
          light: '#F6F9FD',
          50: '#F6F9FD',
          100: '#E8F0FA',
          200: '#D1E1F5',
          300: '#B0CBF0',
          400: '#91B5E5',
          500: '#6B9AD8',
          600: '#4F7FC7',
        },
        clay: {
          DEFAULT: '#C77A57',
          light: '#FDF9F5',
          50: '#FDF9F5',
          100: '#FAEFE4',
          500: '#C77A57',
          600: '#B36845',
        },

        // Semantic colors for admin
        primary: {
          DEFAULT: '#151C2D',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F6F2EA',
          foreground: '#151C2D',
        },
        destructive: {
          DEFAULT: '#DC2626',
          foreground: '#FFFFFF',
        },
        success: {
          DEFAULT: '#16A34A',
          light: '#DCFCE7',
          foreground: '#FFFFFF',
        },
        warning: {
          DEFAULT: '#D97706',
          light: '#FEF3C7',
        },
        muted: {
          DEFAULT: '#F6F2EA',
          foreground: '#6F6A62',
        },

        // Legacy mappings
        border: '#E7DDCF',
        input: '#E7DDCF',
        ring: '#91B5E5',
        background: '#F6F2EA',
        foreground: '#151C2D',
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#151C2D',
        },
      },
      fontFamily: {
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        'display-lg': ['2rem', { lineHeight: '1.2', letterSpacing: '0.02em' }],
        'display-md': ['1.5rem', { lineHeight: '1.25', letterSpacing: '0.02em' }],
        'display-sm': ['1.25rem', { lineHeight: '1.3', letterSpacing: '0.02em' }],
        'body-lg': ['1.0625rem', { lineHeight: '1.6' }],
        'body': ['0.9375rem', { lineHeight: '1.6' }],
        'label': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.05em' }],
      },
      borderRadius: {
        'sm': '8px',
        'md': '12px',
        'lg': '16px',
      },
      boxShadow: {
        'soft': '0 2px 8px rgba(21, 28, 45, 0.06)',
        'card': '0 1px 3px rgba(21, 28, 45, 0.04), 0 1px 2px rgba(21, 28, 45, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
