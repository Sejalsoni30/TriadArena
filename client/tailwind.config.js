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
        background: {
          DEFAULT: '#0A0E27',
          deep: '#060919',
          card: 'rgba(16, 23, 62, 0.7)',
          hover: 'rgba(28, 38, 96, 0.8)',
          glass: 'rgba(13, 20, 52, 0.65)'
        },
        primary: {
          DEFAULT: '#2563EB',
          glow: '#3B82F6',
          light: '#60A5FA',
          dark: '#1D4ED8'
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          glow: '#A78BFA',
          dark: '#6D28D9'
        },
        accent: {
          cyan: '#00F0FF',
          magenta: '#EC4899',
          amber: '#F59E0B'
        },
        semantic: {
          success: '#10B981',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6'
        }
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(37, 99, 235, 0.5)',
        'glow-cyan': '0 0 25px -5px rgba(0, 240, 255, 0.5)',
        'glow-magenta': '0 0 25px -5px rgba(236, 72, 153, 0.5)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.5)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)'
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 4s ease-in-out infinite'
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' }
        }
      }
    },
  },
  plugins: [],
}
