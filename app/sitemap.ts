import type { MetadataRoute } from 'next';
import { SITE } from '@/lib/business-info';
import { routing } from '@/i18n/routing';

/**
 * Sitemap automatiquement généré pour Google.
 * Liste toutes les pages du site avec leur fréquence de mise à jour
 * et leur importance relative (priority).
 *
 * Accessible à https://padelfactoryagadir.com/sitemap.xml
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const pages = [
    { path: '', priority: 1.0, changeFreq: 'weekly' as const },
    { path: '/agadir', priority: 0.95, changeFreq: 'weekly' as const },
    { path: '/universiapolis', priority: 0.95, changeFreq: 'weekly' as const },
    { path: '/tarifs', priority: 0.9, changeFreq: 'monthly' as const },
    { path: '/coaching', priority: 0.7, changeFreq: 'monthly' as const },
    { path: '/tournois', priority: 0.7, changeFreq: 'weekly' as const },
    { path: '/a-propos', priority: 0.5, changeFreq: 'yearly' as const },
    { path: '/contact', priority: 0.6, changeFreq: 'yearly' as const },
  ];

  const entries: MetadataRoute.Sitemap = [];

  for (const page of pages) {
    for (const locale of routing.locales) {
      entries.push({
        url: `${SITE.url}/${locale}${page.path}`,
        lastModified: new Date(),
        changeFrequency: page.changeFreq,
        priority: page.priority,
        alternates: {
          languages: Object.fromEntries(
            routing.locales.map((l) => [l, `${SITE.url}/${l}${page.path}`])
          ),
        },
      });
    }
  }

  return entries;
}
