import { Link } from '@/i18n/routing';

interface LogoProps {
  /**
   * Variante de couleur du logo.
   * - "default" : P blanc + texte blanc (utilisé sur les pages communes)
   * - "blue" : P bleu + texte blanc (page Agadir)
   * - "green" : P vert + texte blanc (page Universiapolis)
   */
  variant?: 'default' | 'blue' | 'green';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Logo Padel Factory en SVG inline.
 * Placeholder visuel en attendant le fichier source du logo officiel.
 * Une fois que Nacer fournira le SVG/PNG officiel, on remplacera cette version.
 */
export default function Logo({
  variant = 'default',
  className = '',
  size = 'md',
}: LogoProps) {
  const pColor =
    variant === 'blue'
      ? '#0001ff'
      : variant === 'green'
      ? '#05DF72'
      : '#ffffff';

  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14',
  };

  return (
    <Link
      href="/"
      className={`inline-flex items-center gap-3 ${sizeClasses[size]} ${className}`}
      aria-label="Padel Factory - Retour à l'accueil"
    >
      {/* Icône P stylisée (placeholder en attendant le vrai logo SVG) */}
      <svg
        viewBox="0 0 100 100"
        className="h-full w-auto"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Forme du P */}
        <path
          d="M25 15 L25 95 L40 95 L40 65 L55 65 C72 65 85 53 85 40 C85 27 72 15 55 15 Z M40 30 L55 30 C63 30 70 35 70 40 C70 45 63 50 55 50 L40 50 Z"
          fill={pColor}
        />
        {/* Cercle de la raquette (les trous) */}
        <g fill={pColor}>
          <circle cx="55" cy="40" r="3" />
          <circle cx="48" cy="35" r="2.5" />
          <circle cx="48" cy="45" r="2.5" />
          <circle cx="62" cy="35" r="2.5" />
          <circle cx="62" cy="45" r="2.5" />
          <circle cx="55" cy="30" r="2.5" />
          <circle cx="55" cy="50" r="2.5" />
        </g>
      </svg>

      {/* Texte du logo */}
      <span className="font-black uppercase tracking-tight italic leading-none">
        <span className="block text-[0.7em]">PADEL</span>
        <span className="block text-[0.7em]">FACTORY</span>
      </span>
    </Link>
  );
}
