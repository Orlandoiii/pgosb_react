/** @type {import('tailwindcss').Config} */
export default {
    content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
    darkMode: "selector",

    theme: {
        screens: {

            'xs': '375px',

            'sm': '520px',

            'md': '760px',

            'lg': '1024px',

            'xl': '1280px',

            '2xl': '1536px',

        },

        extend: {
            colors: {
                lightBlue: '#4299E1',
                bluePurple: '#6366F1',
                yellow: '#F59E0B',
                orange: '#F56565',
                red: '#9A0000',
                purple: '#9F7AEA',
                pink: '#ED64A6',
                green: '#48BB78',
                primary: '#0A2F4E',
                btc_primary: '#3158A4',
                btc_secondary: '#689BD0',
                btc_tertiary: '#E4ECF7',
                btc_gray: '#EEEFEF',
                btc_red: '#A32126',
            },
        },
    },
    plugins: [],
}
