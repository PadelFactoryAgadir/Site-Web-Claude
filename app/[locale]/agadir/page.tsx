import { setRequestLocale } from 'next-intl/server';
import PlaceholderPage from '@/components/PlaceholderPage';

export default async function AgadirPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PlaceholderPage
      title="Padel Factory Agadir"
      description="Le club principal au cœur d'Agadir : 4 terrains, ambiance premium, communauté active. Page complète à venir avec galerie photo, calendrier de réservation et toutes les infos pratiques."
      accent="blue"
    />
  );
}
