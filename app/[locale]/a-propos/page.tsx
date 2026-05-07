import { setRequestLocale } from 'next-intl/server';
import PlaceholderPage from '@/components/PlaceholderPage';

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PlaceholderPage
      title="À propos"
      description="Notre histoire, notre vision, nos valeurs. Page complète à venir."
    />
  );
}
