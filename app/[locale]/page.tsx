import { setRequestLocale } from 'next-intl/server';
import HeroSection from '@/components/HeroSection';
import ClubsSection from '@/components/ClubsSection';

/**
 * Page d'accueil du site Padel Factory.
 * Composée de :
 * - HeroSection : grande section d'introduction avec CTA
 * - ClubsSection : présentation des 2 clubs
 *
 * D'autres sections viendront s'ajouter au fil du projet :
 * - Aperçu des tarifs
 * - Coaching / académie
 * - Tournois récents
 * - Témoignages
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <HeroSection />
      <ClubsSection />
    </>
  );
}
