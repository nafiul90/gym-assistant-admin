/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./src/**/*.{js,jsx,ts,tsx}", "./index.html"],
    theme: {
        colors: {
            purple: "#7e5bef",
            pink: "#ff49db",
            orange: "#ff7849",
            green: "#13ce66",
            yellow: "#ffc82c",
            white: "#ffffff",
            "dark-gray": "#575757",
            gray: "#8492a6",
            "light-gray": "#d3dce6",
            "very-dark": "#000000",
            dark: "#2e2e2e",
            red: {
                50: "#fff1f2",
                100: "#ffe4e6",
                200: "#fecdd3",
                300: "#fda4af",
                400: "#fb7185",
                500: "#f43f5e",
                600: "#e11d48",
                700: "#be123c",
                800: "#9f1239",
                900: "#881337",
                950: "#4c0519"
            },
            blue: {
                50: "#eff6ff",
                100: "#dbeafe",
                200: "#bfdbfe",
                300: "#93c5fd",
                400: "#60a5fa",
                500: "#3b82f6",
                600: "#2563eb",
                700: "#1d4ed8",
                800: "#1e40af",
                900: "#1e3a8a",
                950: "#172554"
            }
        },
        fontFamily: {
            sans: ["Graphik", "sans-serif"],
            serif: ["Merriweather", "serif"]
        },
        fontWeight: {
            thin: "100",
            hairline: "100",
            extralight: "200",
            light: "300",
            normal: "400",
            medium: "500",
            semibold: "600",
            bold: "700",
            extrabold: "800",
            "extra-bold": "800",
            black: "900"
        },
        extend: {
            spacing: {
                "8xl": "96rem",
                "9xl": "128rem"
            },
            borderRadius: {
                "4xl": "2rem"
            }
        }
    }
};
