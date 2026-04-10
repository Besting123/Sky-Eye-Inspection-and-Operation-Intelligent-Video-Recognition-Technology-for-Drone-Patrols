/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
        fontFamily: {
            display: ['"SF Pro Display"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
            body: ['"SF Pro Text"', '-apple-system', 'BlinkMacSystemFont', '"Helvetica Neue"', 'Helvetica', 'Arial', 'sans-serif'],
        },
        colors: {
            // Primary backgrounds (Light mode)
            'light-gray': '#f5f5f7',
            'near-black': '#1d1d1f',
            
            // Interactive colors
            'apple-blue': '#0071e3',
            'link-blue': '#0066cc',
            
            // Text colors
            'text-primary': '#1d1d1f',
            'text-secondary': 'rgba(0, 0, 0, 0.8)',
            'text-tertiary': 'rgba(0, 0, 0, 0.48)',
            
            // Button states
            'button-active': '#ededf2',
            'button-light': '#fafafc',
            
            // Status colors
            error: '#ff3b30',
            success: '#34c759',
            warning: '#ffcc00',
        },
        boxShadow: {
            'apple': 'rgba(0, 0, 0, 0.22) 3px 5px 30px 0px',
            'apple-sm': 'rgba(0, 0, 0, 0.1) 0px 2px 10px 0px',
        },
        letterSpacing: {
            'tight-56': '-0.28px',
            'tight-17': '-0.374px',
            'tight-14': '-0.224px',
            'tight-12': '-0.12px',
            'tight-10': '-0.08px',
            'wide-28': '0.196px',
            'wide-21': '0.231px',
        },
        lineHeight: {
            'hero': '1.07',
            'section': '1.10',
            'heading': '1.14',
            'card': '1.19',
            'body': '1.47',
        },
        borderRadius: {
            'micro': '5px',
            'standard': '8px',
            'comfortable': '11px',
            'large': '12px',
            'pill': '980px',
        },
        fontSize: {
            'display-hero': ['56px', { lineHeight: '1.07', letterSpacing: '-0.28px', fontWeight: '600' }],
            'section-heading': ['40px', { lineHeight: '1.10', fontWeight: '600' }],
            'tile-heading': ['28px', { lineHeight: '1.14', letterSpacing: '0.196px', fontWeight: '400' }],
            'card-title': ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '700' }],
            'sub-heading': ['21px', { lineHeight: '1.19', letterSpacing: '0.231px', fontWeight: '400' }],
        },
        backdropBlur: {
            'apple': '20px',
        },
        backdropSaturate: {
            'apple': '180%',
        }
    },
  },
  plugins: [],
}
