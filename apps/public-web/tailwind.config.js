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
        // Base neutrals (dominant) - Comporta-forward design
        linen: '#F6F2EA',      // Page background
        shell: '#FFFFFF',       // Cards
        sand: '#E7DDCF',        // Borders/dividers
        driftwood: '#6F6A62',   // Muted text
        ink: '#151C2D',         // Primary text (Deep Ink from STD)

        // Accents (use sparingly)
        sky: {
          DEFAULT: '#91B5E5',   // Sky Blue from STD - links, subtle highlights
          tint8: '#F6F9FD',     // 8% tint
          tint12: '#F2F6FC',    // 12% tint
        },
        clay: '#C77A57',        // Warm Brazil hint - tiny pops, icons, RSVP success
        palm: '#2E5D4B',        // Optional night accent for party sections

        // Legacy colors for backwards compatibility during transition
        cream: '#D6D8C3',       // Cream/gold from Save the Date illustrations
        charcoal: '#151C2D',    // Maps to ink
        sage: {
          50: '#F6F9FD',        // Sky tint 8%
          100: '#F2F6FC',       // Sky tint 12%
          200: '#D6DFE9',
          300: '#B8C9DB',
          400: '#91B5E5',       // Sky blue
          500: '#7AA0D4',
          600: '#6089C2',
          700: '#4A6FA8',
          800: '#3A588A',
          900: '#304770',
        },
        gold: {
          50: '#FDF9F5',
          100: '#FAEFE4',
          200: '#F3DCC8',
          300: '#E9C4A3',
          400: '#DCA77A',
          500: '#C77A57',       // Clay
          600: '#B36845',
          700: '#945538',
          800: '#77452E',
          900: '#613A28',
        },
      },
      fontFamily: {
        // Option B from guidelines: softer + more "Comporta"
        serif: ['var(--font-cormorant)', 'Cormorant Garamond', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Typography scale from guidelines
        'display-xl': ['3.5rem', { lineHeight: '1.15', letterSpacing: '0.08em' }],  // H1 desktop (56px)
        'display-lg': ['2.5rem', { lineHeight: '1.15', letterSpacing: '0.08em' }],  // H1 mobile (40px)
        'display-md': ['2.125rem', { lineHeight: '1.2', letterSpacing: '0.08em' }], // H2 (34px)
        'display-sm': ['1.5rem', { lineHeight: '1.25', letterSpacing: '0.08em' }],  // H3 (24px)
        // Body: 16-18 (never below 16)
        'body-lg': ['1.125rem', { lineHeight: '1.6' }],  // 18px
        'body': ['1rem', { lineHeight: '1.6' }],          // 16px
        // Labels (eyebrows): 12-13 uppercase
        'label': ['0.8125rem', { lineHeight: '1.4', letterSpacing: '0.12em' }], // 13px
        'label-sm': ['0.75rem', { lineHeight: '1.4', letterSpacing: '0.12em' }], // 12px
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
      },
      maxWidth: {
        'content': '68.75rem',   // 1100px from guidelines
        'prose': '45rem',
      },
      borderRadius: {
        'sm': '10px',   // --r-sm from guidelines
        'md': '16px',   // --r-md from guidelines
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.8s ease-out',
        'slide-down': 'slideDown 0.5s ease-out',
        'draw-on': 'drawOn 0.8s ease-out',
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
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        drawOn: {
          '0%': { strokeDashoffset: '100%', opacity: '0' },
          '100%': { strokeDashoffset: '0', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
