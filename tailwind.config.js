/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                christmas: {
                    red: '#8B0000',
                    gold: '#FFD700',
                    green: '#228B22',
                    white: '#FAFAFA',
                    cream: '#FFFDD0',
                }
            },
            fontFamily: {
                heading: ['"Mountains of Christmas"', 'cursive'],
                body: ['"Outfit"', 'sans-serif'],
            },
            animation: {
                'snow': 'snowfall 10s linear infinite',
                'float': 'float 3s ease-in-out infinite',
            },
            keyframes: {
                snowfall: {
                    '0%': { transform: 'translateY(-100%)', opacity: '0.8' },
                    '100%': { transform: 'translateY(100vh)', opacity: '0.2' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                }
            }
        },
    },
    plugins: [],
}
