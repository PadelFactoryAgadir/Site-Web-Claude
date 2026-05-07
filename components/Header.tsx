'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Header principal du site.
 * Disposition desktop :
 *   [Logo]   [Menu (centré, items bien espacés)]   [Réserver] | [FR/EN tout à droite]
 *
 * - Le logo sert aussi de lien "Accueil" (donc pas d'item "Accueil" dans le menu)
 * - Le sélecteur de langue est tout à droite, séparé du reste par un trait vertical
 * - Sur mobile : menu hamburger
 */
export default function Header() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const logoVariant = pathname.startsWith('/agadir')
    ? 'blue'
    : pathname.startsWith('/universiapolis')
    ? 'green'
    : 'default';

  // Items du menu (sans "Accueil" : le logo y mène)
  const navItems = [
    { href: '/agadir', label: t('agadir') },
    { href: '/universiapolis', label: t('universiapolis') },
    { href: '/tarifs', label: t('pricing') },
    { href: '/coaching', label: t('coaching') },
    { href: '/tournois', label: t('events') },
    { href: '/a-propos', label: t('about') },
    { href: '/contact', label: t('contact') },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-black/85 backdrop-blur-md border-b border-white/10">
      <div className="container-padel flex items-center justify-between h-16 md:h-20 gap-4">
        {/* Logo (à gauche) */}
        <div className="flex-shrink-0">
          <Logo variant={logoVariant} size="md" />
        </div>

        {/* Menu desktop (au centre, prend l'espace disponible) */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex flex-1 items-center justify-center gap-2"
        >
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative px-3 py-2 text-sm font-bold uppercase tracking-wider transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/55 hover:text-white'
                }`}
              >
                {item.label}
                {/* Petit trait sous l'item actif */}
                {isActive && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-brand-blue" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Côté droit : Réserver + séparateur + FR/EN (tout à droite) */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <Link
            href="/agadir#reservation"
            className="hidden md:inline-flex btn-primary text-sm py-2.5 px-5"
          >
            {t('book')}
          </Link>

          {/* Trait vertical entre le bouton et le sélecteur */}
          <span className="hidden md:inline-block w-px h-6 bg-white/15" />

          <LanguageSwitcher />

          {/* Bouton hamburger mobile */}
          <button
            type="button"
            className="lg:hidden p-2 -mr-2"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {mobileOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile (déroulant) */}
      {mobileOpen && (
        <nav
          aria-label="Navigation mobile"
          className="lg:hidden bg-black border-t border-white/10"
        >
          <ul className="container-padel py-4 flex flex-col gap-1">
            <li>
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className={`block py-3 text-base font-bold uppercase tracking-wider transition-colors ${
                  pathname === '/' ? 'text-white' : 'text-white/70 hover:text-white'
                }`}
              >
                {t('home')}
              </Link>
            </li>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 text-base font-bold uppercase tracking-wider transition-colors ${
                      isActive ? 'text-white' : 'text-white/70 hover:text-white'
                    }`}
                  >
                    {item.label}
                  </Link>
                </li>
              );
            })}
            <li className="mt-3">
              <Link
                href="/agadir#reservation"
                onClick={() => setMobileOpen(false)}
                className="btn-primary w-full"
              >
                {t('book')}
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}
