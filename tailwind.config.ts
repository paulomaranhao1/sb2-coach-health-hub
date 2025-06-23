
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
				border: 'rgb(229 231 235)',
				input: 'rgb(255 255 255)',
				ring: 'rgb(149 6 6)',
				background: 'rgb(255 255 255)',
				foreground: 'rgb(26 26 26)',
				primary: {
					DEFAULT: 'rgb(149 6 6)',
					foreground: 'rgb(255 255 255)'
				},
				secondary: {
					DEFAULT: 'rgb(122 122 122)',
					foreground: 'rgb(255 255 255)'
				},
				destructive: {
					DEFAULT: 'rgb(239 68 68)',
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
					foreground: 'rgb(122 122 122)'
				},
				accent: {
					DEFAULT: 'rgb(248 250 252)',
					foreground: 'rgb(26 26 26)'
				},
				popover: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(26 26 26)'
				},
				card: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(26 26 26)'
				},
				sidebar: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(26 26 26)',
					primary: 'rgb(149 6 6)',
					'primary-foreground': 'rgb(255 255 255)',
					accent: 'rgb(248 250 252)',
					'accent-foreground': 'rgb(26 26 26)',
					border: 'rgb(229 231 235)',
					ring: 'rgb(149 6 6)'
				},
				// Cores customizadas do tema
				theme: {
					primary: '#950606',
					secondary: '#7A7A7A',
					'secondary-dark': '#A3A3A3',
					background: '#FFFFFF',
					'background-dark': '#121212',
					text: '#1A1A1A',
					'text-dark': '#EAEAEA'
				}
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px'
			},
			keyframes: {
				'fade-in': {
					'0%': { opacity: '0', transform: 'translateY(10px)' },
					'100%': { opacity: '1', transform: 'translateY(0)' }
				},
				'scale-in': {
					'0%': { transform: 'scale(0.95)', opacity: '0' },
					'100%': { transform: 'scale(1)', opacity: '1' }
				}
			},
			animation: {
				'fade-in': 'fade-in 0.3s ease-out',
				'scale-in': 'scale-in 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
