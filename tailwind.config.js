/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#1C1917", // Warm ink (Stone-900)
                secondary: "#292524", // Stone-800
                accent: "#B45309", // Amber-700 (gold)
                success: "#15803D", // Green-700
                danger: "#B91C1C", // Red-800
                warning: "#B45309", // Amber-700
                "glass-border": "rgba(28, 25, 23, 0.1)",
                "glass-bg": "rgba(255, 255, 255, 0.85)",
            },
            fontFamily: {
                sans: ["Inter_400Regular", "system-ui", "-apple-system", "sans-serif"],
                "sans-medium": ["Inter_500Medium", "system-ui", "-apple-system", "sans-serif"],
                "sans-semibold": ["Inter_600SemiBold", "system-ui", "-apple-system", "sans-serif"],
                "sans-bold": ["Inter_700Bold", "system-ui", "-apple-system", "sans-serif"],
                "sans-extrabold": ["Inter_800ExtraBold", "system-ui", "-apple-system", "sans-serif"],
                display: ["Fraunces_600SemiBold", "Georgia", "serif"],
            },
        },
    },
    plugins: [],
}
