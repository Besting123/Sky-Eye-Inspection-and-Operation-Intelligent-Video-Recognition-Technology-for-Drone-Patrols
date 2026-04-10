/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
        colors: {
            background: "#020617", 
            surface: "rgba(15, 23, 42, 0.6)", 
            "surface-highlight": "rgba(30, 41, 59, 0.8)", 
            primary: "#00f0ff", 
            "primary-dim": "#00909e",
            secondary: "#b026ff", 
            "secondary-dim": "#701a9e",
            accent: "#ff003c", 
            "on-primary": "#000000",
            "on-secondary": "#ffffff",
            "on-surface": "#e2e8f0", 
            "on-surface-variant": "#94a3b8", 
            outline: "rgba(0, 240, 255, 0.3)", 
            "outline-glow": "rgba(0, 240, 255, 0.8)",
            error: "#ff003c",
            success: "#00ff66",
            warning: "#ffe600",
        },
        boxShadow: {
            'glow-cyan': '0 0 10px rgba(0, 240, 255, 0.5), 0 0 20px rgba(0, 240, 255, 0.3)',
            'glow-purple': '0 0 10px rgba(176, 38, 255, 0.5), 0 0 20px rgba(176, 38, 255, 0.3)',
            'glow-red': '0 0 10px rgba(255, 0, 60, 0.5), 0 0 20px rgba(255, 0, 60, 0.3)',
            'panel': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        },
        backgroundImage: {
            'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
            'cyber-grid': 'linear-gradient(rgba(0, 240, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(0, 240, 255, 0.1) 1px, transparent 1px)',
        },
        backgroundSize: {
            'cyber-grid': '30px 30px',
        },
        animation: {
            'pulse-glow': 'pulseGlow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            'scanline': 'scanline 8s linear infinite',
        },
        keyframes: {
            pulseGlow: {
                '0%, 100%': { opacity: '1' },
                '50%': { opacity: '.5' },
            },
            scanline: {
                '0%': { transform: 'translateY(-100%)' },
                '100%': { transform: 'translateY(100vh)' }
            }
        },
        fontFamily: {
            headline: ['"Rajdhani"', "sans-serif"],
            body: ['"Inter"', "sans-serif"],
            mono: ['"Fira Code"', "monospace"],
        }
    },
  },
  plugins: [],
}
