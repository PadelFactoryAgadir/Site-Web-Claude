import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AGADIR, UNIVERSIAPOLIS } from '@/lib/business-info';
import MapEmbed from '@/components/MapEmbed';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Contact' : 'Contact',
    description: isFr
      ? 'Contactez Padel Factory : numéros de téléphone, WhatsApp, Instagram et adresses des 2 clubs à Agadir.'
      : 'Contact Padel Factory: phone numbers, WhatsApp, Instagram and addresses of our 2 clubs in Agadir.',
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isFr = locale === 'fr';

  return (
    <article className="container-padel py-16 sm:py-24">
      <header className="text-center mb-16 max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-4">
          {isFr ? 'Nous contacter' : 'Get in touch'}
        </p>
        <h1 className="heading-section">Contact</h1>
        <p className="mt-6 text-white/70 text-lg leading-relaxed">
          {isFr
            ? 'Une question ? Une demande spécifique ? Contactez directement le club de votre choix par téléphone, WhatsApp ou Instagram.'
            : 'Any question? A specific request? Contact your club of choice directly by phone, WhatsApp or Instagram.'}
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <ClubContact
          name={AGADIR.name}
          accent="blue"
          phone={AGADIR.phone}
          phoneHref={AGADIR.phoneHref}
          whatsappLink={AGADIR.whatsappLink}
          instagram={AGADIR.instagram}
          instagramHandle={AGADIR.instagramHandle}
          address={`${AGADIR.address.street}, ${AGADIR.address.locality}`}
          mapsUrl={AGADIR.googleMapsUrl}
          mapsQuery={AGADIR.googleMapsEmbedQuery}
          isFr={isFr}
        />
        <ClubContact
          name={UNIVERSIAPOLIS.name}
          accent="green"
          phone={UNIVERSIAPOLIS.phone}
          phoneHref={UNIVERSIAPOLIS.phoneHref}
          whatsappLink={UNIVERSIAPOLIS.whatsappLink}
          instagram={UNIVERSIAPOLIS.instagram}
          instagramHandle={UNIVERSIAPOLIS.instagramHandle}
          address={`${UNIVERSIAPOLIS.address.street}, ${UNIVERSIAPOLIS.address.locality}`}
          mapsUrl={UNIVERSIAPOLIS.googleMapsUrl}
          mapsQuery={UNIVERSIAPOLIS.googleMapsEmbedQuery}
          isFr={isFr}
        />
      </div>
    </article>
  );
}

interface ClubContactProps {
  name: string;
  accent: 'blue' | 'green';
  phone: string;
  phoneHref: string;
  whatsappLink: string;
  instagram: string;
  instagramHandle: string;
  address: string;
  mapsUrl: string;
  mapsQuery: string;
  isFr: boolean;
}

function ClubContact(props: ClubContactProps) {
  const accentText =
    props.accent === 'blue' ? 'text-brand-blue' : 'text-brand-green';
  const accentBorder =
    props.accent === 'blue' ? 'border-l-brand-blue' : 'border-l-brand-green';

  return (
    <section className={`card border-l-4 ${accentBorder} overflow-hidden`}>
      <div className="p-6 sm:p-8">
        <h2
          className={`text-xl sm:text-2xl font-extrabold uppercase tracking-tight mb-6 ${accentText}`}
        >
          {props.name}
        </h2>

        <div className="space-y-4">
          {/* Adresse */}
          <ContactRow icon="📍" label={props.isFr ? 'Adresse' : 'Address'}>
            {props.address}
          </ContactRow>

          {/* Téléphone */}
          <ContactRow icon="📞" label={props.isFr ? 'Téléphone' : 'Phone'}>
            <a
              href={props.phoneHref}
              className="hover:text-white transition-colors font-bold"
            >
              {props.phone}
            </a>
          </ContactRow>

          {/* WhatsApp */}
          <ContactRow icon="💬" label="WhatsApp">
            <a
              href={props.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-lime hover:underline font-bold"
            >
              {props.isFr ? 'Envoyer un message' : 'Send a message'}
            </a>
          </ContactRow>

          {/* Instagram */}
          <ContactRow icon="📷" label="Instagram">
            <a
              href={props.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors font-bold"
            >
              {props.instagramHandle}
            </a>
          </ContactRow>
        </div>
      </div>

      {/* Carte */}
      <div className="border-t border-white/10">
        <MapEmbed
          query={props.mapsQuery}
          mapsUrl={props.mapsUrl}
          title={props.name}
          height={300}
          bare
        />
      </div>
    </section>
  );
}

function ContactRow({
  icon,
  label,
  children,
}: {
  icon: string;
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-xl flex-shrink-0">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-white/50 font-bold mb-0.5">
          {label}
        </p>
        <div className="text-white/80">{children}</div>
      </div>
    </div>
  );
}
