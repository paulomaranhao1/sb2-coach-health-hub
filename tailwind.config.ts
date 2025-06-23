
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
				border: 'rgb(226 232 240)', // slate-200
				input: 'rgb(255 255 255)',
				ring: 'rgb(229 62 62)', // red-500 da logo
				background: 'rgb(248 250 252)', // slate-50
				foreground: 'rgb(71 85 105)', // slate-600 - legível
				primary: {
					DEFAULT: 'rgb(229 62 62)', // #E53E3E - cor da logo
					foreground: 'rgb(255 255 255)',
					hover: 'rgb(197 48 48)', // #C53030
					light: 'rgb(254 215 215)' // red-100
				},
				secondary: {
					DEFAULT: 'rgb(100 116 139)', // slate-500
					foreground: 'rgb(255 255 255)',
					light: 'rgb(148 163 184)' // slate-400
				},
				destructive: {
					DEFAULT: 'rgb(220 38 38)', // red-600
					foreground: 'rgb(255 255 255)'
				},
				success: {
					DEFAULT: 'rgb(34 197 94)', // green-500
					foreground: 'rgb(255 255 255)',
					light: 'rgb(187 247 208)' // green-100
				},
				warning: {
					DEFAULT: 'rgb(245 158 11)', // amber-500
					foreground: 'rgb(255 255 255)',
					light: 'rgb(254 243 199)' // amber-100
				},
				info: {
					DEFAULT: 'rgb(59 130 246)', // blue-500
					foreground: 'rgb(255 255 255)',
					light: 'rgb(219 234 254)' // blue-100
				},
				muted: {
					DEFAULT: 'rgb(248 250 252)', // slate-50
					foreground: 'rgb(100 116 139)' // slate-500
				},
				accent: {
					DEFAULT: 'rgb(241 245 249)', // slate-100
					foreground: 'rgb(51 65 85)' // slate-700
				},
				popover: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(71 85 105)' // slate-600
				},
				card: {
					DEFAULT: 'rgb(255 255 255)',
					foreground: 'rgb(71 85 105)' // slate-600
				},
				// Texto hierárquico
				text: {
					primary: 'rgb(45 55 72)', // gray-800 - títulos
					secondary: 'rgb(74 85 104)', // gray-600 - corpo
					muted: 'rgb(107 114 128)', // gray-500 - secundário
					light: 'rgb(156 163 175)' // gray-400 - placeholder
				}
			},
			borderRadius: {
				lg: '12px',
				md: '8px',
				sm: '6px'
			},
			boxShadow: {
				'card': '0 4px 20px 0 rgba(0, 0, 0, 0.08)',
				'button': '0 4px 12px 0 rgba(229, 62, 62, 0.25)',
				'button-hover': '0 8px 25px 0 rgba(229, 62, 62, 0.35)'
			},
			backgroundImage: {
				'gradient-primary': 'linear-gradient(135deg, rgb(229 62 62), rgb(197 48 48))',
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
