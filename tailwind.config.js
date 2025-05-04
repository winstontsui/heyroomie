/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Light theme colors
        light: {
          50: '#FFFFFF',   // Pure white - main background
          100: '#F9FAFB',  // Almost white - card backgrounds
          200: '#F3F4F6',  // Very light gray - secondary backgrounds
          300: '#E5E7EB',  // Light gray - borders
          400: '#D1D5DB',  // Mid-light gray - dividers
          500: '#9CA3AF',  // Medium gray - secondary text
          600: '#6B7280',  // Medium-dark gray - body text
          700: '#4B5563',  // Dark gray - primary text
          800: '#374151',  // Very dark gray - headings
          900: '#1F2937',  // Almost black - emphasis
        },
        // Dark theme colors
        dark: {
          900: '#0A0A0A',  // Darkest (almost black) - main background
          800: '#121212',  // Dark gray - card backgrounds
          700: '#1A1A1A',  // Lighter dark - hover states
          600: '#222222',  // Even lighter - secondary backgrounds
          500: '#303030',  // Mid gray - borders
          400: '#404040',  // Light gray - inactive elements
          300: '#505050',  // Lighter gray - disabled text
          200: '#808080',  // Very light gray - secondary text
          100: '#A0A0A0',  // Almost white - primary text
        },
        // Warm gold accent (like in the Klipsan gradient)
        gold: {
          900: '#704E00',  // Darkest gold
          800: '#996D00',  // Dark gold
          700: '#BF8700',  // Medium-dark gold
          600: '#DBA000',  // Medium gold
          500: '#F8B500',  // Primary gold - like in the images
          400: '#FFC331',  // Light gold
          300: '#FFD166',  // Lighter gold
          200: '#FFE0A3',  // Very light gold
          100: '#FFF2D9',  // Almost white gold
        },
        // Teal accent (like in the Klipsan gradient)
        teal: {
          900: '#003E42',  // Darkest teal
          800: '#005C61',  // Dark teal
          700: '#007A80',  // Medium-dark teal
          600: '#00979F',  // Medium teal
          500: '#00B5BE',  // Primary teal - like in the images
          400: '#33C2CA',  // Light teal
          300: '#66CFD5',  // Lighter teal
          200: '#99DCE0',  // Very light teal
          100: '#CCEEEF',  // Almost white teal
        },
        white: '#FFFFFF',
        black: '#000000',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Bebas Neue', 'sans-serif'], // For large bold headings
        headline: ['Montserrat', 'sans-serif'], // For section headlines
      },
      fontSize: {
        // Ultra large sizes for impressive headlines
        '7xl': '5rem',    // 80px
        '8xl': '6rem',    // 96px
        '9xl': '8rem',    // 128px
      },
      backgroundImage: {
        // Gradients inspired by Klipsan
        'gold-teal-gradient': 'linear-gradient(120deg, #F8B500 0%, #00B5BE 100%)',
        'dark-gradient': 'linear-gradient(to right, rgba(10, 10, 10, 0.9) 0%, rgba(10, 10, 10, 0.6) 100%)',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}
