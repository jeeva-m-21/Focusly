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
          DEFAULT: '#faf8f5',
          subtle: '#f4f1eb',
          muted: '#eeeae3',
          border: '#e8e5df',
        },
        ink: {
          DEFAULT: '#1c1d21',
          muted: '#64676e',
          faint: '#94979e',
        },
        surface: {
          DEFAULT: '#ffffff',
          dim: '#f4f1eb',
          muted: '#eeeae3',
          border: '#e8e5df',
          hover: '#fbfaf8',
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
