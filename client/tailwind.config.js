/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          // Primary Brand Color: Bright Azure Blue
          blue: '#1689D8',
          'blue-soft': '#4CA8E6',
          'blue-light': '#EDF7FD',
          'blue-powder': '#D3EDFA',

          // Baby Blue (Supporting)
          'baby-blue': '#8FD3F4',

          // Baby Pink (Supporting - radiant baby rose, increased intensity, not dark)
          pink: '#F05597',
          'baby-pink': '#F05597',
          'pink-soft': '#F580B2',
          'pink-light': '#FDEAF3',
          'pink-blush': '#FBCFE3',
          'pink-vibrant': '#E2387F',

          // Soft Peach (Warm Highlights, used sparingly)
          peach: '#F6B39B',
          'peach-light': '#FDF5F2',

          // Deep Navy Blue (Headings & Important Text)
          navy: '#164A70',
          dark: '#164A70',

          // Soft Pastel Background (Visibly tinted pastel, clean separation from white cards, not dark)
          offwhite: '#F5ECF3',
          surface: '#FFFFFF',
          cream: '#F5ECF3',

          // Supporting neutrals
          muted: '#5B7285',
          subtle: '#8EA4B5',
        },
      },
      fontFamily: {
        sans: ['Quicksand', 'Inter', 'system-ui', 'sans-serif'],
        display: ['Quicksand', 'sans-serif'],
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      boxShadow: {
        'soft-sm': '0 2px 8px -2px rgba(22, 137, 216, 0.05), 0 1px 4px -1px rgba(240, 85, 151, 0.08)',
        'soft': '0 10px 30px -5px rgba(22, 137, 216, 0.07), 0 4px 10px -2px rgba(240, 85, 151, 0.10)',
        'soft-lg': '0 20px 40px -10px rgba(22, 137, 216, 0.10), 0 8px 16px -4px rgba(240, 85, 151, 0.12)',
        'glow-blue': '0 0 20px rgba(22, 137, 216, 0.22)',
        'glow-pink': '0 0 20px rgba(240, 85, 151, 0.40)',
      },
    },
  },
  plugins: [],
}
