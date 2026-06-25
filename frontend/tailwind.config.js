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
                primary: {
                    DEFAULT: '#4f46e5',  
                    dark: '#4338ca',
                    light: '#6366f1'
                },
                dark: {
                    bg: '#1e1e1e',      
                    card: '#2d2d2d',    
                    border: '#3d3d3d'   
                }
            },
            fontFamily: {
                mono: ['Fira Code', 'monospace'],
            }
        },
    },
    plugins: [],
}