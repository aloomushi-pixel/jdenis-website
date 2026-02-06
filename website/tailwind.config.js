/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Soft Luxury Theme - Elegancia Legacy
        rose: {
          DEFAULT: '#e8c4c4',
          deep: '#d4a5a5',
          light: '#f0d5d5',
        },
        blush: '#fff5f5',
        cream: '#fefcfb',
        mauve: {
          DEFAULT: '#9c7c7c',
          dark: '#7a5f5f',
          light: '#b89a9a',
        },
        ink: '#4a3f3f',
        // Legacy support (mapped to new theme)
        noir: '#fefcfb',  // Now cream
        charcoal: {
          DEFAULT: '#fff5f5',  // Now blush
          light: '#ffffff',
        },
        'rose-gold': '#d4a5a5',  // Now rose-deep
        champagne: '#9c7c7c',  // Now mauve
        pearl: '#4a3f3f',  // Now text
        gold: '#d4a5a5',
      },
      fontFamily: {
        serif: ['Libre Baskerville', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Nunito Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'soft': '24px',
        'pill': '50px',
        '4xl': '32px',
      },
      boxShadow: {
        'soft': '0 4px 20px rgba(212, 165, 165, 0.15)',
        'soft-lg': '0 10px 40px rgba(212, 165, 165, 0.2)',
        'soft-xl': '0 20px 60px rgba(212, 165, 165, 0.25)',
        'soft-hover': '0 30px 60px rgba(212, 165, 165, 0.3)',
        'card': '0 8px 30px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 20px 50px rgba(212, 165, 165, 0.2)',
        'luxury': '0 4px 20px rgba(212, 165, 165, 0.15)',
        'luxury-lg': '0 10px 40px rgba(212, 165, 165, 0.2)',
        'luxury-xl': '0 20px 60px rgba(212, 165, 165, 0.3)',
      },
      backdropBlur: {
        xs: '2px',
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out forwards',
        'slide-up': 'slideUp 0.5s ease-out forwards',
        'slide-down': 'slideDown 0.3s ease-out forwards',
        'float': 'float 3s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
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
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
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
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(212, 165, 165, 0.2)' },
          '100%': { boxShadow: '0 0 40px rgba(212, 165, 165, 0.4)' },
        },
      },
      transitionDuration: {
        '400': '400ms',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-soft': 'linear-gradient(135deg, #e8c4c4, #d4a5a5)',
        'gradient-cream': 'linear-gradient(180deg, #fefcfb 0%, #fff5f5 100%)',
      },
    },
  },
  plugins: [],
}


