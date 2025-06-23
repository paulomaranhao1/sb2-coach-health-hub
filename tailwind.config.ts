
import type { Config } from "tailwindcss";

export default {
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', 'sans-serif'],
			},
			colors: {
				border: 'rgb(226 232 240)',
				input: 'rgb(255 255 255)',
				ring: 'rgb(220 38 38)',
				background: 'rgb(248 250 252)',
				foreground: 'rgb(15 23 42)',
				primary: {
					DEFAULT: 'rgb(220 38 38)',
					foreground: 'rgb(255 255 255)',
					hover: 'rgb(185 28 28)',
					light: 'rgb(239 68 68)'
				},
				secondary: {
					DEFAULT: 'rgb(100 116 139)',
					foreground: 'rgb(255 255 255)',
					light: 'rgb(148 163 184)'
				},
				destructive: {
					DEFAULT: 'rgb(220 38 38)',
					foreground: 'rgb(255 255 255)'
				},
				success: {
					DEFAULT: 'rgb(34 197 94)',
					foreground: 'rgb(255 255 255)'
				},
				warning: {
					DEFAULT: 'rgb(245 158 11)',
					foreground: 'rgb(255 255 255)'
				},
				info: {
					DEFAULT: 'rgb(59 130 246)',
					foreground: 'rgb(255 255 255)'
				},
				muted: {
					DEFAULT: 'rgb(248 250 252)',
					foreground: 'rgb(100 116 139)'
				},
				accent: {
					DEFAULT: 'rgb(241 245 249)',
					foreground: 'rgb(15 23 42)'
				},
				popover: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(15 23 42)'
				},
				card: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(15 23 42)'
				}
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px'
			},
			boxShadow: {
				'glass': '0 8px 32px 0 rgba(220, 38, 38, 0.1)',
				'card': '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
				'button': '0 4px 12px 0 rgba(220, 38, 38, 0.25)',
				'button-hover': '0 8px 25px 0 rgba(220, 38, 38, 0.35)'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, rgb(220 38 38), rgb(185 28 28))',
				'gradient-secondary': 'linear-gradient(135deg, rgb(100 116 139), rgb(71 85 105))',
				'gradient-card': 'linear-gradient(135deg, rgb(255 255 255), rgb(248 250 252))'
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				},
				'slide-in-right': {
					'0%': { transform: 'translateX(100%)' },
					'100%': { transform: 'translateX(0)' }
				},
				'bounce-subtle': {
					'0%, 100%': { transform: 'translateY(0)' },
					'50%': { transform: 'translateY(-2px)' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out',
				'slide-in-right': 'slide-in-right 0.3s ease-out',
				'bounce-subtle': 'bounce-subtle 0.5s ease-in-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
