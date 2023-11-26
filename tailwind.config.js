/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			screens: {
				xxxxs: "240px",
				xxxs: "320px",
				xxs: "375px",
				xs: "425px",
				sm: "640px",
				md: "768px",
				lg: "1024px",
				xl: "1280px",
				xxl: "1440px",
			},
			fontFamily: {
				main: ['"Poppins"', "sans-serif"],
			},
			colors: {
				primary: "#49B0AD",
				dark: "#0D0D0D",
			},
			fontColor: {
				primary: "#49B0AD",
				dark: "#0D0D0D",
			},
			backgroundColor: {
				primary: "#49B0AD",
				dark: "#0D0D0D",
			},
		},
	},
	plugins: [],
};
