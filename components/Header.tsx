'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Header principal du site.
 * - Logo à gauche
 * - Menu de navigation au centre (caché sur mobile, hamburger à la place)
 * - Bouton "Réserver" + sélecteur de langue à droite
 * - Position "sticky" : reste visible quand on scrolle
 */
export default function Header() {
  const t = useTranslations('Nav');
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  // Détermine la variante du logo selon la page courante
  const logoVariant = pathname.startsWith('/agadir')
    ? 'blue'
    : pathname.startsWith('/universiapolis')
    ? 'green'
    : 'default';

  const navItems = [
    { href: '/', label: t('home') },
    { href: '/agadir', label: t('agadir') },
    { href: '/universiapolis', label: t('universiapolis') },
    { href: '/tarifs', label: t('pricing') },
    { href: '/coaching', label: t('coaching') },
    { href: '/tournois', label: t('events') },
    { href: '/a-propos', label: t('about') },
    { href: '/contact', label: t('contact') },
  ] as const;

  return (
    <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-white/10">
      <div className="container-padel flex items-center justify-between h-16 md:h-20">
        {/* Logo */}
        <Logo variant={logoVariant} size="md" />

        {/* Menu desktop */}
        <nav
          aria-label="Navigation principale"
          className="hidden lg:flex items-center gap-7"
        >
          {navItems.map((item) => {
            const isActive =
              item.href === '/'
                ? pathname === '/'
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-semibold uppercase tracking-wider transition-colors duration-200 ${
                  isActive
                    ? 'text-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Côté droit : sélecteur de langue + bouton Réserver */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <Link
            href="/agadir#reservation"
            className="hidden md:inline-flex btn-primary text-sm py-2.5 px-5"
          >
            {t('book')}
          </Link>

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

      {/* Menu mobile (visible si mobileOpen) */}
      {mobileOpen && (
        <nav
          aria-label="Navigation mobile"
          className="lg:hidden bg-black border-t border-white/10"
        >
          <ul className="container-padel py-4 flex flex-col gap-1">
            {navItems.map((item) => {
              const isActive =
                item.href === '/'
                  ? pathname === '/'
                  : pathname.startsWith(item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`block py-3 text-base font-semibold uppercase tracking-wider transition-colors ${
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
