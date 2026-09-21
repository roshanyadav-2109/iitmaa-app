import type { Config } from "tailwindcss";
// Imported rather than require()d: this file is ESM (import/export default),
// and on Node >=22 it is loaded as ESM, where `require` is not defined. The
// old `require("tailwindcss-animate")` threw during config load, which left
// Tailwind with no config and the app with no CSS at all in `next dev`.
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
  	container: {
  		center: true,
  		padding: '1rem',
  		screens: {
  			'2xl': '1280px'
  		}
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
  			// The app ground. Was a warm cream (#F4F1EA), which read as light
  			// yellow, then plain white, then white with a five-point cool
  			// cast — too slight: a white panel sitting on it was invisible.
  			// Now 96% lightness and eleven points of blue over red, which is
  			// still read as "white page" on its own but puts a clear step
  			// between the ground and anything `raised` on top of it.
  			//
  			// `raised` is pure white and is what that step is for. `deep`
  			// (the inset/hover state) has to stay below the ground to read
  			// as pressed, so it moves down with it rather than staying the
  			// neutral grey it used to be, which next to a cool ground reads
  			// as dirty.
  			paper: {
  				DEFAULT: '#EFF3FA',
  				deep: '#E2E9F4',
  				raised: '#FFFFFF'
  			},
  			// Hairline rules. Replaces `brand-100` (#d4d2ed, a periwinkle) as
  			// the border everywhere — that lilac cast on 150 borders was most
  			// of why the app looked purple-tinted. Neutral, matching `paper`.
  			rule: {
  				DEFAULT: '#E4E4E7',
  				strong: '#C4C4C8',
  				faint: '#EFEFF1'
  			},
  			brand: {
  				'50': '#eeedf7',
  				'100': '#d4d2ed',
  				'200': '#a9a5db',
  				'300': '#7d78c9',
  				'400': '#524bb7',
  				'500': '#3b329e',
  				'600': '#2e2783',
  				'700': '#241e6b',
  				'800': '#1B1464',
  				'900': '#15104e',
  				'950': '#0d0930'
  			},
  			// The accent, taken from the IITMAA mark rather than inherited.
  			// The ramp this replaced was PanIIT's red (#DD002B) and came across
  			// with the fork; sampling public/logo/iitmaa.svg gives #E07030 for
  			// the swoosh, and the event site uses #E06A3C for the same thing.
  			//
  			// 400 is that swoosh colour exactly, for decoration. 500 is a step
  			// deeper on purpose: the classes using it are error text, required
  			// marks, unread badges and the Featured bar, all of which need to
  			// hold contrast. #E07030 manages only 3.22:1 on white where the old
  			// red managed 5.11; #B85318 gets back to 4.90 and still reads as
  			// the same orange.
  			iit: {
  				'50': '#FEF4ED',
  				'100': '#FBE2D0',
  				'200': '#F6C4A1',
  				'300': '#EFA06E',
  				'400': '#E07030',
  				'500': '#B85318',
  				'600': '#9C4514',
  				'700': '#7D3710',
  				'800': '#5E290C',
  				'900': '#3F1B08'
  			},
  			track: {
  				ai: '#7C3AED',
  				deeptech: '#06B6D4',
  				policy: '#10B981',
  				investor: '#1B1464',
  				workshop: '#EC4899',
  				founders: '#F97316',
  				climate: '#22C55E',
  				fintech: '#3B82F6',
  				keynote: '#1B1464',
  				general: '#64748B'
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
  			}
  		},
  		fontFamily: {
  			sans: [
  				'var(--font-sans)',
  				'system-ui',
  				'sans-serif'
  			],
  			// `font-display` — titles. Same family as the body text now, so this
  			// exists to carry the title *treatment* (weight and fit) rather
  			// than a second typeface; keeping the utility means every heading
  			// in the app stays a one-line change away from a display face.
  			display: [
  				'var(--font-sans)',
  				'system-ui',
  				'sans-serif'
  			],
  			telugu: [
  				'var(--font-telugu)',
  				'var(--font-sans)',
  				'system-ui',
  				'sans-serif'
  			]
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
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
  plugins: [tailwindcssAnimate],
};

export default config;
