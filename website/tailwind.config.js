/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Deep Navy Apothecary Theme
        forest: {
          DEFAULT: '#1a2535',  // Deep navy blue
          light: '#2d3d52',
          dark: '#0f1520',
        },
        cream: {
          DEFAULT: '#f5f0e8',
          dark: '#e8e0d5',
          light: '#faf7f2',
        },
        gold: {
          DEFAULT: '#b8965a',
          light: '#d4b87a',
          dark: '#9a7a42',
        },
        kraft: {
          DEFAULT: '#c4a87c',
          light: '#d9c4a0',
          dark: '#a08858',
        },
        charcoal: '#2a2a2a',
        // Legacy mappings for compatibility
        noir: '#1a2535',
        'rose-gold': '#b8965a',
        champagne: '#d4b87a',
        pearl: '#f5f0e8',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Lato', 'Source Sans Pro', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'soft': '8px',
        'botanical': '4px',
      },
      boxShadow: {
        'botanical': '0 4px 20px rgba(26, 37, 53, 0.1)',
        'botanical-lg': '0 10px 40px rgba(26, 37, 53, 0.15)',
        'botanical-xl': '0 20px 60px rgba(26, 37, 53, 0.2)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(26, 37, 53, 0.12)',
        'luxury': '0 4px 20px rgba(184, 150, 90, 0.15)',
        'luxury-lg': '0 10px 40px rgba(184, 150, 90, 0.2)',
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
        'gradient-forest': 'linear-gradient(135deg, #1a2535, #2d3d52)',
        'gradient-cream': 'linear-gradient(180deg, #f5f0e8 0%, #e8e0d5 100%)',
        'gradient-kraft': 'linear-gradient(180deg, #c4a87c 0%, #a08858 100%)',
      },
    },
  },
  plugins: [],
}
