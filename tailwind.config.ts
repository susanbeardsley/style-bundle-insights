import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Style Bundle Brand Palette
        ivory: {
          50: '#FFFEF9',
          100: '#FDFBF3',
          200: '#FAF7EA',
          300: '#F5F0DC',
          400: '#EDE5C8',
          500: '#E5DAB4',
          DEFAULT: '#FDFBF3',
        },
        sage: {
          50: '#F4F7F4',
          100: '#E4EBE4',
          200: '#C5D6C5',
          300: '#9DB89D',
          400: '#7A9D7A',
          500: '#5A7F5A',
          600: '#4A6B4A',
          DEFAULT: '#9DB89D',
        },
        kraft: {
          50: '#FAF6F1',
          100: '#F2EAE0',
          200: '#E5D5C1',
          300: '#D4BC9C',
          400: '#C9A96E',
          500: '#B89B5D',
          600: '#9A7F4A',
          DEFAULT: '#C9A96E',
        },
        gold: {
          50: '#FFFEF5',
          100: '#FEF9E3',
          200: '#FCF0C4',
          300: '#F9E39C',
          400: '#F5D270',
          500: '#D4AF37',
          600: '#B8962F',
          DEFAULT: '#D4AF37',
        },
        charcoal: {
          50: '#F5F5F5',
          100: '#E5E5E5',
          200: '#CCCCCC',
          300: '#999999',
          400: '#666666',
          500: '#333333',
          600: '#1A1A1A',
          DEFAULT: '#333333',
        },
        terracotta: {
          DEFAULT: '#E2725B',
          light: '#EDA090',
        },
        blush: {
          DEFAULT: '#F4C2C2',
          light: '#FFE4E1',
        },
        // Sentiment family colours
        love: '#F4C2C2',
        gratitude: '#D4AF37',
        celebration: '#FFD700',
        comfort: '#9DB89D',
        encouragement: '#87CEEB',
        acknowledgement: '#C9A96E',
        apology: '#E6E6FA',
        nostalgia: '#D4A574',
        playful: '#FF6B6B',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-playfair)', 'Georgia', 'serif'],
      },
      backgroundImage: {
        'wave-pattern': "url('/wave-pattern.svg')",
        'ribbon-accent': "url('/ribbon-accent.svg')",
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
}
export default config
