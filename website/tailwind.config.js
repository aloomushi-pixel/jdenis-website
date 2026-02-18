/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // J. Denis Brand Colors — based on jdenis.com
        forest: {
          DEFAULT: '#17204D',  // Deep navy (primary dark)
          light: '#1E2B5E',    // Lighter navy
          dark: '#0F1638',     // Darker navy
        },
        cream: {
          DEFAULT: '#ffffff',  // Pure white background
          dark: '#f5f5f5',
          light: '#ffffff',
        },
        gold: {
          DEFAULT: '#1C50EF',  // Brand blue (accent)
          light: '#4B73F5',
          dark: '#1440C0',
        },
        kraft: {
          DEFAULT: '#E8ECF5',  // Light blue-grey accent
          light: '#F0F3FA',
          dark: '#C8D2E8',
        },
        charcoal: '#1A1A1A',
        // Legacy mappings for compatibility
        noir: '#17204D',
        'rose-gold': '#1C50EF',
        champagne: '#4B73F5',
        pearl: '#ffffff',
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
