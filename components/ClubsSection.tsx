import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';

/**
 * Section "Nos clubs" affichée sur la page d'accueil.
 * - Présente les 2 clubs côte à côte
 * - Chaque carte a sa propre couleur d'accent (bleu/vert)
 * - PLACEHOLDER : les images seront ajoutées quand Nacer les fournira
 */
export default function ClubsSection() {
  const t = useTranslations('ClubsSection');

  return (
    <section className="py-20 sm:py-32 bg-gradient-dark">
      <div className="container-padel">
        {/* Titre de section */}
        <div className="text-center mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-4">
            — {t('subtitle')} —
          </p>
          <h2 className="heading-section">{t('title')}</h2>
        </div>

        {/* Les 2 cartes des clubs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ClubCard
            href="/agadir"
            accent="blue"
            name={t('agadir.name')}
            location={t('agadir.location')}
            courts={t('agadir.courts')}
            description={t('agadir.description')}
            discoverLabel={t('agadir.discover')}
            bookLabel={t('agadir.book')}
          />
          <ClubCard
            href="/universiapolis"
            accent="green"
            name={t('universiapolis.name')}
            location={t('universiapolis.location')}
            courts={t('universiapolis.courts')}
            description={t('universiapolis.description')}
            discoverLabel={t('universiapolis.discover')}
            bookLabel={t('universiapolis.book')}
          />
        </div>
      </div>
    </section>
  );
}

interface ClubCardProps {
  href: '/agadir' | '/universiapolis';
  accent: 'blue' | 'green';
  name: string;
  location: string;
  courts: string;
  description: string;
  discoverLabel: string;
  bookLabel: string;
}

function ClubCard({
  href,
  accent,
  name,
  location,
  courts,
  description,
  discoverLabel,
  bookLabel,
}: ClubCardProps) {
  const isBlue = accent === 'blue';
  const accentText = isBlue ? 'text-brand-blue' : 'text-brand-green';
  const accentBorder = isBlue
    ? 'hover:border-brand-blue/60'
    : 'hover:border-brand-green/60';
  const glow = isBlue ? 'hover:shadow-glow-blue' : 'hover:shadow-glow-green';
  const primaryBtn = isBlue ? 'btn-primary' : 'btn-primary-universiapolis';

  return (
    <article
      className={`card group relative transition-all duration-500 ${accentBorder} ${glow} hover:-translate-y-1`}
    >
      {/* Image / Placeholder en haut de la carte */}
      <div
        className={`relative aspect-[16/10] overflow-hidden bg-zinc-900 border-b border-white/10`}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white/20 text-sm font-mono uppercase tracking-widest">
            [Photo principale {accent === 'blue' ? 'Agadir' : 'Universiapolis'}]
          </span>
        </div>
        {/* Effet visuel = couleur d'accent en bas */}
        <div
          className={`absolute bottom-0 left-0 right-0 h-1 ${
            isBlue ? 'bg-brand-blue' : 'bg-brand-green'
          }`}
        />
      </div>

      {/* Contenu textuel */}
      <div className="p-6 sm:p-8">
        {/* Localisation + nombre de terrains */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest ${accentText}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {location}
          </span>
          <span className="text-white/30">•</span>
          <span className="text-xs font-bold uppercase tracking-widest text-white/70">
            {courts}
          </span>
        </div>

        {/* Nom du club */}
        <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-4">
          {name}
        </h3>

        {/* Description */}
        <p className="text-white/70 leading-relaxed mb-8">{description}</p>

        {/* Boutons */}
        <div className="flex flex-wrap gap-3">
          <Link href={href} className={primaryBtn}>
            {bookLabel}
          </Link>
          <Link
            href={href}
            className="inline-flex items-center gap-2 px-6 py-3 font-semibold uppercase tracking-wider text-white/80 border-2 border-white/20 transition-all duration-200 hover:bg-white/5 hover:border-white/40"
          >
            {discoverLabel}
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
