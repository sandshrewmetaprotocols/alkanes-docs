/** @type {import('tailwindcss').Config} */
const tailwindCssAnimatePlugin = require('tailwindcss-animate');

module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  darkMode: ['class'],
  content: [
    './src/**/*.{js,ts,jsx,tsx,md,mdx}',
    './docs/**/*.{md,mdx}',
  ],
  theme: {
    screens: {
      sm: '640px',
      'sm-md': '810px',
      md: '1024px',
      lg: '1280px',
      xl: '1920px',
    },
    fontSize: {
      xs: '11px',
      sm: '13px',
      base: '15px',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
      '6xl': '4rem',
    },
    extend: {
      animation: {
        swipe: 'swipe var(--speed) linear infinite',
        shimmer: 'shimmer 3s linear infinite',
      },
      keyframes: {
        swipe: {
          '0%': { transform: 'translate(0)' },
          '100%': { transform: 'translate(-100%)' },
        },
        shimmer: {
          '0%': { backgroundPosition: 'top left' },
          '100%': { backgroundPosition: 'top right' },
        },
      },
      backgroundImage: {
        'hero-gradient':
          'linear-gradient(to bottom, #F8FAFC, #F2EAEA, #D2D9E2)',
        'chrome-footer-gradient':
          'linear-gradient(to bottom, #FFFFFF 0%, #F2F2EB 81%, #FEF4D8 100%)',
        'card-header-gradient': `linear-gradient(180deg, hsl(var(--black) / 0), hsl(var(--black) / .02))`,
      },
      fontFamily: {
        mono: ['var(--font-geist-mono)', 'Monaco', 'Courier New', 'monospace'],
        inter: ['Inter', 'sans-serif'],
      },
      maxWidth: {
        brand: '946px',
      },
      maxHeight: {
        findDeals: '30vh',
      },
      scale: {
        97: '0.97',
        98: '0.98',
        102: '1.02',
        103: '1.03',
      },
      boxShadow: {
        normal:
          '0px 0px 8px 0px rgba(0, 0, 0, 0.08), 0px 0px 1px 0px rgba(0, 0, 0, 0.40)',
        checkbox:
          '0px 0px 1px 0px rgba(0, 0, 0, 0.7), 0px 1px 2px 0px rgba(0, 0, 0, 0.05)',
        high: '0px 8px 30px 0px rgba(0, 0, 0, 0.08), 0px 0px 1px 0px hsl(var(--black-9) / 0.40)',
        mid: '0px 3px 12px 0px rgba(0, 0, 0, 0.08), 0px 0px 1px 0px hsl(var(--black-9) / 0.40)',
        low: '0px 1px 3px 0px rgba(9, 10, 12, 0.08), 0px 0px 1px 0px hsl(var(--black-9) / 0.50)',
        xlow: '0px 1px 2px 0px rgba(0, 0, 0, 0.05), 0px 0px 1px 0px rgba(0, 0, 0, 0.20)',
        '2xlow': '0px 0px 1px 0px hsl(var(--black-9) / 0.45)',
      },
      colors: {
        textColor: {
          DEFAULT: 'var(--black-9)',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: '#090A0C0A',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary) / 0.04)',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        'black-primary': '#090A0C',
        'black-opacity-02': 'rgba(9, 10, 12, 0.02)',
        'black-opacity-04': 'rgba(9, 10, 12, 0.04)',
        'black-opacity-06': 'rgba(9, 10, 12, 0.06)',
        'black-opacity-08': 'rgba(9, 10, 12, 0.08)',
        'black-opacity-30': 'rgba(9, 10, 12, 0.3)',
        'black-opacity-50': 'rgba(9, 10, 12, 0.5)',
        'black-opacity-60': 'rgba(9, 10, 12, 0.6)',
        'black-opacity-70': 'rgba(9, 10, 12, 0.7)',
        'black-opacity-80': 'rgba(9, 10, 12, 0.8)',
        'black-opacity-90': 'rgba(9, 10, 12, 0.9)',
        'black-opacity-100': 'rgba(9, 10, 12, 1)',
        'green-primary': 'rgba(18, 188, 137, 1)',
        'shimmer-blue': '#469DFF',
        'shimmer-light-blue': '#B5D7FF',
        'cta-blue': '#4D8DEF',
        brand: {
          // gray: {
          //   DEFAULT: '#999999',
          //   bg: '#f4f4f4',
          //   text: '#5e5e5e',
          //   gray: '#ebebeb',
          // },
          gray: {
            DEFAULT: 'rgba(0,0,0,0.4)',
            '04': 'rgba(0, 0, 0, 0.04)',
            '08': 'rgba(0,0,0,0.08)',
            10: 'rgba(255,255,255,0.1)',
            20: 'rgba(128,128,128,0.2)',
            40: 'rgba(0,0,0,0.4)',
            50: 'rgba(255,255,255,0.5)',
            60: 'rgba(0, 0, 0, 0.6)',
            80: 'rgba(0, 0, 0, 0.8)',
            hsla: 'hsla(0,0%,100%,.3)',
            bg: 'rgba(217,217,217,0.30)',
          },
          blue: {
            DEFAULT: 'rgba(0,91,231,0.7)',
            70: 'rgba(0,91,231,0.7)',
            80: 'rgba(0,91,231,0.8)',
            full: '#1583FF',
          },
        },
        supporting: {
          green: 'hsl(var(--supporting-green))',
          blue: 'hsl(var(--supporting-blue))',
          orange: 'hsl(var(--supporting-orange))',
          red: 'hsl(var(--supporting-red))'
        },
        'word-carousel': 'hsl(220, 14%, 4%, 0.08)',
      },
      padding: {
        section: '66px',
      },
      spacing: {
        hug: '640px',
      },
      borderWidth: {
        1: '1px',
      },
      borderRadius: {
        btn: '30px',
        video: '18px',
        icon: '10px',
        checkbox: '5px',
        'xl+': '18px',
        '4xl': '30px',
      },
      gap: {
        btn: '60px',
      },
      duration: {
        DEFAULT: '200ms',
      },
      lineHeight: {
        hero: '4.5rem',
      },
    },
  },
  plugins: [
    tailwindCssAnimatePlugin,
    require('@tailwindcss/typography'),
  ],
};