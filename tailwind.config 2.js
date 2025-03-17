/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{astro,js,ts,jsx,tsx}",
    "./components/**/*.{astro,js,ts,jsx,tsx}",
    "./layouts/**/*.{astro,js,ts,jsx,tsx}",
  ],
  theme: {
    screens: {
      'sm': { 'max': '639px' },  
      'md': { 'max': '767px' },  
      'lg': { 'max': '1023px' }, 
      'xl': { 'max': '1279px' }, 
    }
  },
  plugins: [],
};
