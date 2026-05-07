import { setRequestLocale } from 'next-intl/server';
import PlaceholderPage from '@/components/PlaceholderPage';

export default async function UniversiapolisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PlaceholderPage
      title="Padel Factory Universiapolis"
      description="Le club au campus Universiapolis : 3 terrains, ambiance étudiante et compétitive. Page complète à venir avec galerie photo, calendrier de réservation et toutes les infos pratiques."
      accent="green"
    />
  );
}
