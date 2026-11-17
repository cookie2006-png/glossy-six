/** Soft palette: pink, white and nude (from the brand concept). Edit here to retheme. */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        petal: "#FFF7F5", // page background
        blush: "#F7D6DC", // soft pink surfaces
        nude: "#EBD3C6",  // nude surfaces
        rose: "#B4506A",  // buttons / links (readable on white)
        berry: "#4A2630", // text
      },
      fontFamily: {
        display: ['"Fraunces"', "Georgia", "serif"],
        body: ['"DM Sans"', "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
