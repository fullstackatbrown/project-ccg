module.exports = {
  plugins: [
    require('@tailwindcss/postcss'),  // <-- Correct plugin for TailwindCSS v4
    require('autoprefixer'),           // Ensure Autoprefixer is also included
  ],
};