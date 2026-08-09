/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
    presets: [require("nativewind/preset")],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                primary: "#0f172a", // Deep Navy (Slate-900)
                secondary: "#1e293b", // Slate-800
                accent: "#38bdf8", // Sky-400
                success: "#22c55e", // Green-500
                danger: "#ef4444", // Red-500
                warning: "#f59e0b", // Amber-500
                "glass-border": "rgba(15, 23, 42, 0.08)",
                "glass-bg": "rgba(255, 255, 255, 0.7)",
            },
        },
    },
    plugins: [],
}
