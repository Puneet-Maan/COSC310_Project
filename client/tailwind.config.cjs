module.exports = {
  darkMode: 'class', // or 'media'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Added path for all files in src
    './src/**/*.{js,ts,jsx,tsx}', 
    './public/index.html'
  ],
}
