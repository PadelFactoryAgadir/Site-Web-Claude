import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Charte officielle Padel Factory
        brand: {
          // Bleu électrique = couleur principale d'action (pages communes + Agadir)
          blue: '#0001ff',
          // Vert = couleur d'action pour Universiapolis uniquement
          green: '#05DF72',
          // Lime = accent ponctuel (statuts "disponible", chiffres clés)
          lime: '#cdd550',
          // Gris foncé = cartes et blocs
          gray: '#414042',
        },
        // Aliases pour faciliter l'écriture du code
        background: '#000000',
        surface: '#0a0a0a',
        card: '#1a1a1c',
      },
      fontFamily: {
        sans: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
        display: ['var(--font-montserrat)', 'system-ui', 'sans-serif'],
      },
      fontSize: {
        // Tailles personnalisées pour les très gros titres "impact"
        'hero': ['clamp(2.5rem, 7vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'display': ['clamp(2rem, 5vw, 4rem)', { lineHeight: '1.05', letterSpacing: '-0.01em' }],
      },
      animation: {
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-up': 'slideUp 0.7s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
