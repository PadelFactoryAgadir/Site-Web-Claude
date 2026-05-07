import { setRequestLocale } from 'next-intl/server';
import PlaceholderPage from '@/components/PlaceholderPage';

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <PlaceholderPage
      title="Contact"
      description="Téléphone, WhatsApp, Instagram, Google Maps, horaires, formulaire de contact. À venir."
    />
  );
}
