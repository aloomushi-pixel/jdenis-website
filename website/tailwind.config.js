/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // J. Denis BRAND IDENTITY - DESIGN TOKENS
        primary: '#1E56FF',
        secondary: '#54CCFF',
        surface: '#F0F7FF',
        'accent-pink': '#FFD1E0',
        'accent-yellow': '#FFD33D',
        textMain: '#1A1A1A',
        base: '#FFFFFF',

        // Remapping existing variable names used throughout the project
        forest: {
          DEFAULT: '#1E56FF',  // Now mapped to New Primary
          light: '#3B6AFF',
          dark: '#0A3ACC',
        },
        cream: {
          DEFAULT: '#FFFFFF',  // Fondo Base
          dark: '#F0F7FF',     // Surface/Ice Blue
          light: '#FFFFFF',
        },
        gold: {
          DEFAULT: '#54CCFF',  // Now mapped to New Secondary
          light: '#7EE0FF',
          dark: '#26ADD4',
        },
        kraft: {
          DEFAULT: '#E5E5E5',  // Dividers / Subtle borders
          light: '#F3F4F6',
          dark: '#D1D5DB',
        },
        charcoal: '#1A1A1A',   // Texto Principal

        // Legacy mappings for compatibility
        noir: '#1A1A1A',
        'rose-gold': '#FFD1E0',
        champagne: '#FFD33D',
        pearl: '#ffffff',
      },
      fontFamily: {
        serif: ['Vidaloka', 'serif'],
        sans: ['"Roboto Flex"', 'Nunito', 'sans-serif'],
      },
      borderRadius: {
        'soft': '4px',
        'button': '4px',
        'botanical': '4px',
      },
      boxShadow: {
        'botanical': '0 4px 20px rgba(23, 32, 77, 0.1)',
        'botanical-lg': '0 10px 40px rgba(23, 32, 77, 0.15)',
        'botanical-xl': '0 20px 60px rgba(23, 32, 77, 0.2)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(23, 32, 77, 0.12)',
        'luxury': '0 4px 20px rgba(28, 80, 239, 0.15)',
        'luxury-lg': '0 10px 40px rgba(28, 80, 239, 0.2)',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSoft: {
          '0%, 100%': { transform: 'scale(1)', opacity: '0.3' },
          '50%': { transform: 'scale(1.05)', opacity: '0.5' },
        },
      },
      backgroundImage: {
        'gradient-forest': 'linear-gradient(135deg, #17204D, #1E2B5E)',
        'gradient-cream': 'linear-gradient(180deg, #f8f8fa 0%, #f0f0f5 100%)',
        'gradient-kraft': 'linear-gradient(180deg, #E8ECF5 0%, #C8D2E8 100%)',
      },
    },
  },
  plugins: [],
}
