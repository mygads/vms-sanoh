/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Satoshi'],
      },
      colors: {
        navy: '#001f3f',   // Warna navy
        silver: '#c0c0c0', // Warna silver
      },
    },
  },
  plugins: [],
}
