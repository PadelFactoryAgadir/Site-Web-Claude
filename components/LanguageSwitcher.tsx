'use client';

import { useLocale } from 'next-intl';
import { usePathname, useRouter } from '@/i18n/routing';
import { routing, type Locale } from '@/i18n/routing';

/**
 * Bouton de bascule de langue FR / EN.
 * Garde la même page lors du changement de langue.
 */
export default function LanguageSwitcher() {
  const locale = useLocale() as Locale;
  const router = useRouter();
  const pathname = usePathname();

  const switchTo = (newLocale: Locale) => {
    router.replace(pathname, { locale: newLocale });
  };

  return (
    <div
      role="group"
      aria-label="Sélection de la langue"
      className="inline-flex items-center gap-1 text-sm font-semibold uppercase tracking-wider"
    >
      {routing.locales.map((loc, idx) => (
        <span key={loc} className="flex items-center">
          <button
            type="button"
            onClick={() => switchTo(loc)}
            disabled={loc === locale}
            className={`transition-colors duration-200 ${
              loc === locale
                ? 'text-white'
                : 'text-white/50 hover:text-white cursor-pointer'
            }`}
          >
            {loc.toUpperCase()}
          </button>
          {idx < routing.locales.length - 1 && (
            <span className="text-white/30 mx-1.5">/</span>
          )}
        </span>
      ))}
    </div>
  );
}
