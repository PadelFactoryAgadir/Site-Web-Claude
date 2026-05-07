import { setRequestLocale } from 'next-intl/server';
import PlaceholderPage from '@/components/PlaceholderPage';

export default async function CoachingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PlaceholderPage
      title="Coaching & Académie"
      description="Cours privés, Padel Factory School, compétition, événements internes. Page complète à venir avec présentation des coachs."
    />
  );
}
