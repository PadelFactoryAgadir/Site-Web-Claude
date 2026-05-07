import { setRequestLocale } from 'next-intl/server';
import PlaceholderPage from '@/components/PlaceholderPage';

export default async function EventsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PlaceholderPage
      title="Tournois & Événements"
      description="Affiches, galerie, vidéos et résultats de nos tournois et événements. À venir."
    />
  );
}
