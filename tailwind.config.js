/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: {
          DEFAULT: '#F7F6F2',
          card: '#FFFFFF',
          subtle: '#FCFBF8',
          border: '#E7E5DF',
        },
        ink: {
          DEFAULT: '#18181A',
          secondary: '#686A70',
          muted: '#96979B',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          subtle: '#FCFBF8',
          border: '#E7E5DF',
        },
        focus: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          light: '#FFF7E6',
        }
      },
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'Inter', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        'calm-sm': '0 1px 2px 0 rgba(28, 29, 33, 0.04)',
        'calm-md': '0 3px 6px -1px rgba(28, 29, 33, 0.05), 0 2px 4px -2px rgba(28, 29, 33, 0.03)',
        'calm-lg': '0 10px 15px -3px rgba(28, 29, 33, 0.06), 0 4px 6px -4px rgba(28, 29, 33, 0.04)',
        'calm-modal': '0 20px 25px -5px rgba(28, 29, 33, 0.08), 0 8px 10px -6px rgba(28, 29, 33, 0.04)'
      }
    },
  },
  plugins: [],
}
