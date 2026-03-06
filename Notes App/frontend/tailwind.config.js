/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                neon: {
                    cyan: '#00ffff',
                    magenta: '#ff00ff',
                    lime: '#39ff14',
                },
                dark: {
                    bg: '#0a0a0a',
                    surface: '#171717',
                    border: '#262626',
                },
                light: {
                    bg: '#ffffff',
                    surface: '#f5f5f5',
                    border: '#e5e5e5',
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
