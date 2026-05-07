import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { Montserrat } from 'next/font/google';
import { NextIntlClientProvider } from 'next-intl';
import {
  getMessages,
  getTranslations,
  setRequestLocale,
} from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import { SITE } from '@/lib/business-info';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import StructuredData from '@/components/StructuredData';
import '../globals.css';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  display: 'swap',
});

/**
 * Génère les balises <title>, <meta description>, OpenGraph et hreflang.
 * Très important pour le SEO et le partage sur les réseaux sociaux.
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'Metadata' });

  // Construit les URLs alternatives pour chaque langue (hreflang)
  const alternates: Record<string, string> = {};
  for (const loc of routing.locales) {
    alternates[loc] = `${SITE.url}/${loc}`;
  }

  return {
    metadataBase: new URL(SITE.url),
    title: {
      default: `${t('siteName')} — ${t('tagline')}`,
      template: `%s | ${t('siteName')}`,
    },
    description: t('description'),
    keywords: [
      'padel agadir',
      'club padel agadir',
      'réservation padel',
      'terrain padel agadir',
      'padel maroc',
      'padel factory',
      'padel universiapolis',
      'cours padel agadir',
      'tournoi padel maroc',
    ],
    authors: [{ name: SITE.name }],
    creator: SITE.name,
    publisher: SITE.name,
    applicationName: SITE.name,
    category: 'Sport',
    alternates: {
      canonical: `${SITE.url}/${locale}`,
      languages: alternates,
    },
    icons: {
      icon: '/favicon.ico',
      apple: '/apple-touch-icon.png',
    },
    openGraph: {
      title: `${t('siteName')} — ${t('tagline')}`,
      description: t('description'),
      url: `${SITE.url}/${locale}`,
      siteName: t('siteName'),
      locale: locale === 'fr' ? 'fr_FR' : 'en_US',
      type: 'website',
      // L'image OG est auto-générée par app/[locale]/opengraph-image.tsx
    },
    twitter: {
      card: 'summary_large_image',
      title: `${t('siteName')} — ${t('tagline')}`,
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-image-preview': 'large',
        'max-snippet': -1,
        'max-video-preview': -1,
      },
    },
    // Vérification Google Search Console (à remplir quand Nacer aura ajouté le site)
    verification: {
      // google: 'CODE_DE_VERIFICATION_GOOGLE',
    },
  };
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  // Récupère toutes les traductions pour les passer aux composants client
  const messages = await getMessages();

  return (
    <html lang={locale} className={montserrat.variable}>
      <head>
        <StructuredData locale={locale} />
      </head>
      <body className="min-h-screen flex flex-col">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
