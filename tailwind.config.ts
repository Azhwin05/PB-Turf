import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: ["class"],
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
                success: "hsl(var(--success))",
                warning: "hsl(var(--warning))",
                // iOS System Greys
                'ios-grey': {
                    50: '#F2F2F7',
                    100: '#E5E5EA',
                    200: '#D1D1D6',
                    300: '#C7C7CC',
                    400: '#AEAEB2',
                    500: '#8E8E93',
                    600: '#636366',
                    700: '#48484A',
                    800: '#3A3A3C',
                    900: '#2C2C2E',
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
                // Apple-style radius
                'ios-sm': '10px',
                'ios': '14px',
                'ios-md': '16px',
                'ios-lg': '18px',
                'ios-xl': '20px',
            },
            boxShadow: {
                // iOS-style elevation shadows
                'ios-sm': '0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.08)',
                'ios': '0 4px 6px rgba(0, 0, 0, 0.1), 0 2px 4px rgba(0, 0, 0, 0.06)',
                'ios-md': '0 10px 15px rgba(0, 0, 0, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)',
                'ios-lg': '0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04)',
                'ios-xl': '0 25px 50px rgba(0, 0, 0, 0.15), 0 12px 20px rgba(0, 0, 0, 0.08)',
                // Colored shadows for accents
                'primary-glow': '0 4px 14px rgba(0, 122, 255, 0.25)',
                'success-glow': '0 4px 14px rgba(52, 199, 89, 0.25)',
                'warning-glow': '0 4px 14px rgba(255, 204, 0, 0.25)',
                'destructive-glow': '0 4px 14px rgba(255, 59, 48, 0.25)',
            },
            transitionTimingFunction: {
                // iOS spring animations
                'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
                'spring-smooth': 'cubic-bezier(0.5, 1.5, 0.5, 1)',
                'ios': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
                'ios-in': 'cubic-bezier(0.42, 0, 1, 1)',
                'ios-out': 'cubic-bezier(0, 0, 0.58, 1)',
            },
            animation: {
                'spring-in': 'spring-in 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
                'fade-in': 'fade-in 0.2s cubic-bezier(0.25, 0.1, 0.25, 1)',
                'slide-up': 'slide-up 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
                'scale-in': 'scale-in 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)',
            },
            keyframes: {
                'spring-in': {
                    '0%': { transform: 'scale(0.9)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                'fade-in': {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                'slide-up': {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                'scale-in': {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
            spacing: {
                // iOS-style spacing (based on 4px grid)
                'safe-top': 'env(safe-area-inset-top)',
                'safe-bottom': 'env(safe-area-inset-bottom)',
                'safe-left': 'env(safe-area-inset-left)',
                'safe-right': 'env(safe-area-inset-right)',
            },
            minHeight: {
                'touch': '44px', // Apple HIG minimum touch target
            },
            minWidth: {
                'touch': '44px', // Apple HIG minimum touch target
            },
        },
    },
    plugins: [],
};
export default config;

