import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

/**
 * Configuration des langues du site Padel Factory.
 * Ajoute "ar" plus tard si tu veux l'arabe.
 */
export const routing = defineRouting({
  locales: ['fr', 'en'],
  defaultLocale: 'fr',
  localePrefix: 'always', // toutes les URLs commencent par /fr ou /en
});

export type Locale = (typeof routing.locales)[number];

// Helpers pour la navigation entre pages dans les composants
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
