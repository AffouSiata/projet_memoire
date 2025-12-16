/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 🏥 Palette Nexus Health (depuis logo1.png)
        primary: {
          50: '#EEF5FF',
          100: '#D9E9FF',
          200: '#BBD7FF',
          300: '#92BEFF',
          400: '#5B9FFF', // Bleu Nexus Health principal
          500: '#4A8EFF',
          600: '#3A7AEB',
          700: '#2D65D4',
          800: '#2452AC',
          900: '#1E4287',
          DEFAULT: '#5B9FFF', // Bleu Nexus Health
          light: '#92BEFF',
          dark: '#2D65D4',
        },
        secondary: {
          50: '#E6FBF8',
          100: '#CCF7F1',
          200: '#99EFE3',
          300: '#66E7D5',
          400: '#33DFC7',
          500: '#1DD9B5', // Vert turquoise lumineux LARANA
          600: '#17AE93',
          700: '#12826E',
          800: '#0C574A',
          900: '#062B25',
          DEFAULT: '#1DD9B5', // Turquoise LARANA principal
          light: '#66E7D5',
          dark: '#12826E',
        },
        accent: {
          DEFAULT: '#5B9FFF', // Même bleu que primaire
          light: '#92BEFF',
          dark: '#2D65D4',
        },
        background: '#F8FAFC', // Fond clair général
        surface: '#FFFFFF', // Cartes, modals
        card: '#F0F9FF', // Fond de carte avec teinte bleu léger
        text: '#1E293B', // Texte principal (même que fond logo)
        textMuted: '#64748B', // Texte secondaire
        border: '#E2E8F0', // Bordures subtiles
        success: '#1DD9B5', // Vert turquoise lumineux LARANA
        warning: '#F59E0B', // Orange doux
        error: '#EF4444', // Rouge
        info: '#5B9FFF', // Bleu LARANA
        dark: '#1E293B', // Fond sombre du logo
      },

      fontFamily: {
        sans: ['Poppins', 'Inter', 'Nunito Sans', 'sans-serif'],
      },

      boxShadow: {
        soft: '0 4px 12px rgba(91, 159, 255, 0.15)', // Ombre bleue LARANA
        card: '0 6px 20px rgba(30, 41, 59, 0.08)', // Ombre pour les cartes
        glow: '0 0 20px rgba(29, 217, 181, 0.3)', // Effet glow turquoise LARANA
      },

      borderRadius: {
        xl: '1rem',
        '2xl': '1.5rem',
      },

      transitionProperty: {
        'all': 'all',
      },

      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'shake': 'shake 0.5s ease-in-out',
        'blob': 'blob 7s infinite',
        'progress-bar': 'progressBar 5s linear forwards',
      },

      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.9)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        blob: {
          '0%, 100%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
        },
        progressBar: {
          '0%': { width: '100%' },
          '100%': { width: '0%' },
        },
      },
    },
  },
  plugins: [],
};
