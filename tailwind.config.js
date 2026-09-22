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
        ops: {
          bg: '#070A0F',
          surface: '#0D131F',
          card: '#121B2A',
          border: '#1E293B',
          'border-bright': '#334155',
          muted: '#64748B',
          text: '#F1F5F9',
          cyan: '#06B6D4',
          'cyan-glow': '#22D3EE',
          emerald: '#10B981',
          amber: '#F59E0B',
          violet: '#8B5CF6',
          rose: '#F43F5E',
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', '"Liberation Mono"', '"Courier New"', 'monospace'],
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
      }
    },
  },
  plugins: [],
}


