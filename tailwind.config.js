/** @type {import('tailwindcss').Config} */
import { fontFamily } from 'tailwindcss/defaultTheme.js';


export default {
    safelist: [
        { pattern: /animate.*/ }
    ],
    content: ['./src/**/*.tsx'],
    theme: {
        extend: {
            fontFamily: {
                'inter': ['Inter', ...fontFamily.sans]
            },
            keyframes: {
                'scale-up': {
                    '0%': { transform: 'scale(0.975)' },
                    '100%': { transform: 'scale(1)' }
                },
                'slide-up': {
                    '0%': { transform: 'translateY(-20px)' },
                    '100%': { transform: 'translateY(0)' },
                },
                'fade-in': {
                    '0%': { opacity: 0 },
                    '100%': { opacity: 1 }
                },
                'bg-in': {
                    '0%': { backgroundColor: 'transparent' },
                    '100%': { backgroundColor: 'rgb(38 38 38 / 0.5)' },
                },
                'loader': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' }
                }
            },
            animation: {
                'bg-in': 'bg-in 300ms ease',
                'modal-in': 'fade-in 300ms ease, slide-up 300ms ease',
                'page': 'fade-in 300ms ease, scale-up 300ms ease',
                'loader': 'loader 700ms linear infinite'
            }
        },
    }
}

