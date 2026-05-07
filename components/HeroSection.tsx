import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

/**
 * Section "Hero" de la page d'accueil.
 * - Fond noir avec un effet visuel "vidéo placeholder"
 * - Titre énorme (effet impact)
 * - Sous-titre
 * - 2 boutons CTA (Agadir bleu / Universiapolis vert)
 *
 * PLACEHOLDER : la vidéo de fond sera ajoutée quand Nacer me la fournira.
 */
export default function HeroSection() {
  const t = useTranslations('Hero');

  return (
    <section
      className="relative min-h-[100vh] flex items-center justify-center overflow-hidden bg-black"
      aria-label="Section principale"
    >
      {/* Fond placeholder (sera remplacé par une vidéo) */}
      <div className="absolute inset-0 z-0">
        {/* Gradient sombre + motif lumineux */}
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-900" />

        {/* Effet de "lumières" en arrière-plan (cercles flous colorés) */}
        <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-blue/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-brand-green/15 rounded-full blur-[120px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-lime/5 rounded-full blur-[100px]" />

        {/* Étiquette "vidéo à venir" en coin */}
        <div className="absolute top-6 right-6 z-10 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-widest text-white/40 font-mono">
          [Vidéo Hero — Drone / Ralenti]
        </div>

        {/* Voile sombre au-dessus pour lisibilité */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Contenu textuel */}
      <div className="relative z-10 container-padel py-20 text-center">
        <p className="inline-block mb-6 text-xs font-bold uppercase tracking-[0.4em] text-brand-lime animate-fade-in">
          ★ Padel Factory Agadir ★
        </p>

        <h1 className="heading-hero animate-slide-up max-w-5xl mx-auto">
          {t('title')}
        </h1>

        <p
          className="mt-6 max-w-2xl mx-auto text-lg sm:text-xl text-white/80 leading-relaxed animate-slide-up"
          style={{ animationDelay: '120ms' }}
        >
          {t('subtitle')}
        </p>

        <div
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up"
          style={{ animationDelay: '240ms' }}
        >
          <Link href="/agadir#reservation" className="btn-primary w-full sm:w-auto">
            {t('ctaAgadir')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>

          <Link
            href="/universiapolis#reservation"
            className="btn-primary-universiapolis w-full sm:w-auto"
          >
            {t('ctaUniversiapolis')}
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </Link>
        </div>

        {/* Stats en bas du hero */}
        <div className="mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto">
          <Stat number="2" label="Clubs" />
          <Stat number="7" label="Terrains" />
          <Stat number="365" label="Jours / an" />
        </div>
      </div>

      {/* Indicateur de scroll */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
        <svg className="w-5 h-5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div className="text-center">
      <div className="text-3xl sm:text-4xl font-black text-brand-lime">
        {number}
      </div>
      <div className="text-xs uppercase tracking-widest text-white/50 mt-1">
        {label}
      </div>
    </div>
  );
}
