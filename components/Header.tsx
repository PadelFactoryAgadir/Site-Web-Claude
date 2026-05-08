'use client';

import { useEffect, useRef, useState } from 'react';
import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import Logo from './Logo';
import LanguageSwitcher from './LanguageSwitcher';

/**
 * Header principal du site.
 * - Logo à gauche (lien Accueil)
 * - Menu central (items bien espacés)
 * - Bouton Réserver à droite : contextuel selon la page
 *   - Sur /agadir/* : lien direct vers /agadir#reservation
 *   - Sur /universiapolis/* : lien direct vers /universiapolis#reservation
 *   - Ailleurs : ouvre un petit menu déroulant pour choisir le club
 * - Sélecteur FR/EN tout à droite
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

  // Détermine le contexte du bouton Réserver
  const onAgadir = pathname.startsWith('/agadir');
  const onUniversiapolis = pathname.startsWith('/universiapolis');

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
        {/* Logo */}
        <div className="flex-shrink-0">
          <Logo variant={logoVariant} size="md" />
        </div>

        {/* Menu desktop */}
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
                  isActive ? 'text-white' : 'text-white/55 hover:text-white'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute left-3 right-3 -bottom-0.5 h-0.5 bg-brand-blue" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Côté droit : bouton Réserver contextuel + séparateur + FR/EN */}
        <div className="flex items-center gap-3 flex-shrink-0">
          <div className="hidden md:block">
            {onAgadir ? (
              <Link
                href="/agadir#reservation"
                className="btn-primary text-sm py-2.5 px-5"
              >
                {t('book')}
              </Link>
            ) : onUniversiapolis ? (
              <Link
                href="/universiapolis#reservation"
                className="btn-primary-universiapolis text-sm py-2.5 px-5"
              >
                {t('book')}
              </Link>
            ) : (
              <ReserveDropdown bookLabel={t('book')} />
            )}
          </div>

          <span className="hidden md:inline-block w-px h-6 bg-white/15" />
          <LanguageSwitcher />

          {/* Bouton hamburger mobile */}
          <button
            type="button"
            className="lg:hidden p-2 -mr-2"
            aria-label="Ouvrir le menu"
            onClick={() => setMobileOpen((v) => !v)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Menu mobile */}
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
            {/* Bouton Réserver mobile : 2 boutons côte à côte si page neutre, sinon 1 contextuel */}
            <li className="mt-3 grid grid-cols-1 gap-2">
              {onAgadir ? (
                <Link
                  href="/agadir#reservation"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary w-full"
                >
                  {t('book')}
                </Link>
              ) : onUniversiapolis ? (
                <Link
                  href="/universiapolis#reservation"
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary-universiapolis w-full"
                >
                  {t('book')}
                </Link>
              ) : (
                <>
                  <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold mt-2 mb-1">
                    Réserver dans quel club ?
                  </p>
                  <Link
                    href="/agadir#reservation"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary w-full"
                  >
                    Agadir
                  </Link>
                  <Link
                    href="/universiapolis#reservation"
                    onClick={() => setMobileOpen(false)}
                    className="btn-primary-universiapolis w-full"
                  >
                    Universiapolis
                  </Link>
                </>
              )}
            </li>
          </ul>
        </nav>
      )}
    </header>
  );
}

/**
 * Bouton Réserver avec menu déroulant pour choisir le club.
 * Utilisé quand l'utilisateur n'est pas sur une page club spécifique.
 */
function ReserveDropdown({ bookLabel }: { bookLabel: string }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement | null>(null);

  // Fermer le menu si on clique en dehors
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="btn-primary text-sm py-2.5 px-5 inline-flex items-center gap-2"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {bookLabel}
        <svg
          className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-56 rounded-xl border border-white/15 bg-black shadow-2xl overflow-hidden animate-fade-in z-50"
        >
          <div className="p-2 border-b border-white/10">
            <p className="text-[10px] uppercase tracking-widest text-white/40 font-bold px-2 py-1.5">
              Réserver dans quel club ?
            </p>
          </div>
          <Link
            href="/agadir#reservation"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition group"
          >
            <span className="w-2 h-2 rounded-full bg-brand-blue group-hover:scale-125 transition" />
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wider">Agadir</p>
              <p className="text-[11px] text-white/50">4 terrains · Centre-ville</p>
            </div>
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
          <Link
            href="/universiapolis#reservation"
            onClick={() => setOpen(false)}
            className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition group"
          >
            <span className="w-2 h-2 rounded-full bg-brand-green group-hover:scale-125 transition" />
            <div className="flex-1">
              <p className="text-sm font-bold uppercase tracking-wider">Universiapolis</p>
              <p className="text-[11px] text-white/50">3 terrains · Campus</p>
            </div>
            <svg className="w-3.5 h-3.5 text-white/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      )}
    </div>
  );
}
