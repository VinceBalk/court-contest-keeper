
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
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
			padding: {
				DEFAULT: '1rem',
				sm: '2rem',
				lg: '4rem',
				xl: '5rem',
				'2xl': '6rem',
			},
			screens: {
				'2xl': '1400px'
			}
		},
		screens: {
			'xs': '475px',
			'sm': '640px',
			'md': '768px',
			'lg': '1024px',
			'xl': '1280px',
			'2xl': '1536px',
		},
		extend: {
			colors: {
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				// Custom design system colors
				'custom-primary': {
					50: 'hsl(var(--color-primary-50))',
					100: 'hsl(var(--color-primary-100))',
					500: 'hsl(var(--color-primary-500))',
					600: 'hsl(var(--color-primary-600))',
					700: 'hsl(var(--color-primary-700))',
				},
				'custom-success': {
					50: 'hsl(var(--color-success-50))',
					100: 'hsl(var(--color-success-100))',
					500: 'hsl(var(--color-success-500))',
					600: 'hsl(var(--color-success-600))',
					700: 'hsl(var(--color-success-700))',
				},
				'custom-warning': {
					50: 'hsl(var(--color-warning-50))',
					100: 'hsl(var(--color-warning-100))',
					500: 'hsl(var(--color-warning-500))',
					600: 'hsl(var(--color-warning-600))',
					700: 'hsl(var(--color-warning-700))',
				},
				'custom-error': {
					50: 'hsl(var(--color-error-50))',
					100: 'hsl(var(--color-error-100))',
					500: 'hsl(var(--color-error-500))',
					600: 'hsl(var(--color-error-600))',
					700: 'hsl(var(--color-error-700))',
				}
			},
			fontSize: {
				'custom-xs': 'var(--font-size-xs)',
				'custom-sm': 'var(--font-size-sm)',
				'custom-base': 'var(--font-size-base)',
				'custom-lg': 'var(--font-size-lg)',
				'custom-xl': 'var(--font-size-xl)',
				'custom-2xl': 'var(--font-size-2xl)',
				'custom-3xl': 'var(--font-size-3xl)',
				'custom-4xl': 'var(--font-size-4xl)',
				'custom-5xl': 'var(--font-size-5xl)',
				'custom-6xl': 'var(--font-size-6xl)',
			},
			spacing: {
				'custom-xs': 'var(--spacing-xs)',
				'custom-sm': 'var(--spacing-sm)',
				'custom-md': 'var(--spacing-md)',
				'custom-lg': 'var(--spacing-lg)',
				'custom-xl': 'var(--spacing-xl)',
				'custom-2xl': 'var(--spacing-2xl)',
				'custom-3xl': 'var(--spacing-3xl)',
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
				'custom-sm': 'var(--border-radius-sm)',
				'custom-md': 'var(--border-radius-md)',
				'custom-lg': 'var(--border-radius-lg)',
				'custom-xl': 'var(--border-radius-xl)',
				'custom-2xl': 'var(--border-radius-2xl)',
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
