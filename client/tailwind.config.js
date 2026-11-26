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
          DEFAULT: '#070A1A',
          base: '#070A1A',
          elevated: '#0E1330',
          glass: 'rgba(255, 255, 255, 0.06)',
          card: '#0E1330',
          deep: '#070A1A',
          hover: 'rgba(255, 255, 255, 0.08)'
        },
        border: {
          glass: 'rgba(255, 255, 255, 0.12)'
        },
        primary: {
          DEFAULT: '#3B82F6',
          glow: 'rgba(59, 130, 246, 0.45)',
          light: '#60A5FA',
          dark: '#1D4ED8'
        },
        secondary: {
          DEFAULT: '#8B5CF6',
          glow: 'rgba(139, 92, 246, 0.45)',
          dark: '#6D28D9'
        },
        accent: {
          cyan: '#22D3EE',
          pink: '#F472B6',
          magenta: '#F472B6',
          amber: '#FBBF24'
        },
        text: {
          primary: '#F5F7FF',
          muted: '#9AA3C7',
          subtle: '#6B7399'
        },
        semantic: {
          win: '#34D399',
          loss: '#F87171',
          draw: '#FBBF24',
          info: '#38BDF8',
          success: '#34D399',
          danger: '#F87171',
          warning: '#FBBF24'
        }
      },
      backgroundImage: {
        'grad-hero': 'linear-gradient(135deg, #3B82F6 0%, #8B5CF6 60%, #22D3EE 100%)',
        'grad-text': 'linear-gradient(90deg, #FFFFFF 0%, #A5B4FC 100%)'
      },
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        ui: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace']
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(59, 130, 246, 0.45)',
        'glow-cyan': '0 0 25px -5px rgba(34, 211, 238, 0.45)',
        'glow-pink': '0 0 25px -5px rgba(244, 114, 182, 0.45)',
        'glow-magenta': '0 0 25px -5px rgba(244, 114, 182, 0.45)',
        'glow-purple': '0 0 25px -5px rgba(139, 92, 246, 0.45)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.45)'
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
