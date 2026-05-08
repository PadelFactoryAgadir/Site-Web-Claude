import Image from 'next/image';
import { Link } from '@/i18n/routing';

interface LogoProps {
  /**
   * Variante de couleur du logo.
   * - "default" : P bleu + texte blanc (utilisé sur les pages communes + Agadir)
   * - "blue" : P bleu + texte blanc (page Agadir, identique à default)
   * - "green" : version blanche (sur la page Universiapolis, le vert s'exprime ailleurs)
   * - "white" : logo entièrement blanc
   */
  variant?: 'default' | 'blue' | 'green' | 'white';
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Logo officiel Padel Factory.
 * Les fichiers PNG sont fournis par Nacer dans /public/.
 *
 * Tailles approximatives :
 *  - sm : 32px de haut
 *  - md : 40px de haut (par défaut, header)
 *  - lg : 56px de haut
 */
export default function Logo({
  variant = 'default',
  className = '',
  size = 'md',
}: LogoProps) {
  const src =
    variant === 'white' || variant === 'green'
      ? '/logo-white.png'
      : '/logo.png';

  const sizeMap = {
    sm: { className: 'h-8', height: 32 },
    md: { className: 'h-10 md:h-12', height: 48 },
    lg: { className: 'h-14 md:h-16', height: 64 },
  };

  const { className: sizeClass, height } = sizeMap[size];

  // Le logo a un ratio d'environ 2.35:1 (largeur:hauteur)
  const width = Math.round(height * 2.35);

  return (
    <Link
      href="/"
      className={`inline-flex items-center ${className}`}
      aria-label="Padel Factory - Retour à l'accueil"
    >
      <Image
        src={src}
        alt="Padel Factory"
        width={width}
        height={height}
        className={`${sizeClass} w-auto object-contain`}
        priority
      />
    </Link>
  );
}
