/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // J. Denis Brand Colors - Extracted from hero image
        forest: {
          DEFAULT: '#1e2a3d',  // Navy blue from background
          light: '#2d3a4f',    // Lighter navy
          dark: '#141d2b',     // Darker navy
        },
        cream: {
          DEFAULT: '#f8f5f0',  // Warm white/cream
          dark: '#ede8e0',
          light: '#fdfcfa',
        },
        gold: {
          DEFAULT: '#c9a857',  // Gold from leaves
          light: '#dbc17a',
          dark: '#a88a3d',
        },
        kraft: {
          DEFAULT: '#d4b87a',  // Light gold accent
          light: '#e5d0a0',
          dark: '#b89d55',
        },
        charcoal: '#2a2a2a',
        // Legacy mappings for compatibility
        noir: '#1e2a3d',
        'rose-gold': '#c9a857',
        champagne: '#dbc17a',
        pearl: '#f8f5f0',
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
        'botanical': '0 4px 20px rgba(30, 42, 61, 0.1)',
        'botanical-lg': '0 10px 40px rgba(30, 42, 61, 0.15)',
        'botanical-xl': '0 20px 60px rgba(30, 42, 61, 0.2)',
        'card': '0 2px 12px rgba(0, 0, 0, 0.08)',
        'card-hover': '0 8px 30px rgba(30, 42, 61, 0.12)',
        'luxury': '0 4px 20px rgba(201, 168, 87, 0.15)',
        'luxury-lg': '0 10px 40px rgba(201, 168, 87, 0.2)',
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
        'gradient-forest': 'linear-gradient(135deg, #1e2a3d, #2d3a4f)',
        'gradient-cream': 'linear-gradient(180deg, #f8f5f0 0%, #ede8e0 100%)',
        'gradient-kraft': 'linear-gradient(180deg, #d4b87a 0%, #b89d55 100%)',
      },
    },
  },
  plugins: [],
}
