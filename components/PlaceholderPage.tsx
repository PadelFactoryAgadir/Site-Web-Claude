interface PlaceholderPageProps {
  title: string;
  description?: string;
  /** Couleur d'accent pour les pages spécifiques à un club */
  accent?: 'blue' | 'green';
}

/**
 * Page "coquille vide" affichée pour les pages pas encore codées.
 * Sera remplacée par le vrai contenu page par page dans les semaines suivantes.
 */
export default function PlaceholderPage({
  title,
  description,
  accent,
}: PlaceholderPageProps) {
  const accentColor =
    accent === 'blue'
      ? 'text-brand-blue'
      : accent === 'green'
      ? 'text-brand-green'
      : 'text-brand-lime';

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="container-padel py-20 text-center">
        <p
          className={`text-sm font-bold uppercase tracking-[0.3em] mb-6 ${accentColor}`}
        >
          Page en construction
        </p>
        <h1 className="heading-section mb-6">{title}</h1>
        {description && (
          <p className="text-white/60 text-lg max-w-2xl mx-auto leading-relaxed">
            {description}
          </p>
        )}
        <div className="mt-12 inline-flex items-center gap-2 px-5 py-3 rounded-full border border-white/20 text-sm text-white/70">
          <span className="w-2 h-2 rounded-full bg-brand-lime animate-pulse" />
          Contenu en cours de création
        </div>
      </div>
    </div>
  );
}
