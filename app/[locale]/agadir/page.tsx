import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { AGADIR } from '@/lib/business-info';
import ReservationFlow from '@/components/reservation/ReservationFlow';
import MapEmbed from '@/components/MapEmbed';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return {
    title: isFr ? 'Padel Factory Agadir — Centre-ville' : 'Padel Factory Agadir — Downtown',
    description: isFr
      ? 'Réservez votre terrain au club Padel Factory Agadir. 4 terrains dernière génération au cœur d\'Agadir.'
      : 'Book your court at Padel Factory Agadir. 4 state-of-the-art courts in the heart of Agadir.',
  };
}

export default async function AgadirPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div>
      {/* Hero club */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-900" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-blue/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-lime/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container-padel py-24 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-blue mb-4">
            Centre-ville d'Agadir
          </p>
          <h1 className="heading-section mb-6">Padel Factory Agadir</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            Notre club principal au cœur d'Agadir : 4 terrains dernière génération,
            ambiance premium, communauté active toute la semaine.
          </p>

          {/* Infos rapides */}
          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Stat number="4" label="Terrains" />
            <Stat number="9h30" label="Ouverture" />
            <Stat number="23h" label="Fermeture" />
            <Stat number="7/7" label="Jours" />
          </div>
        </div>
      </section>

      {/* Section infos pratiques + carte */}
      <section className="py-16 sm:py-20 border-b border-white/10">
        <div className="container-padel">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <InfoCard icon="📍" title="Localisation">
              {AGADIR.address.street}, Agadir
              <br />
              <span className="text-white/50 text-xs">
                Près de Café BORJ, Carrefour Cadi Ayad
              </span>
            </InfoCard>
            <InfoCard icon="🅿️" title="Parking">
              Parking disponible à proximité
            </InfoCard>
            <InfoCard icon="🚿" title="Vestiaires">
              Vestiaires + douches sur place
            </InfoCard>
            <InfoCard icon="🛒" title="Shop & Café">
              Cafétéria + boutique de matériel
            </InfoCard>
          </div>

          {/* Carte Google Maps */}
          <MapEmbed
            query={AGADIR.googleMapsEmbedQuery}
            mapsUrl={AGADIR.googleMapsUrl}
            title={AGADIR.name}
            height={380}
          />
        </div>
      </section>

      {/* Galerie placeholder */}
      <section className="py-16 sm:py-20 border-b border-white/10">
        <div className="container-padel">
          <h2 className="heading-section text-center mb-12">Le club en images</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center"
              >
                <span className="text-white/20 text-xs font-mono uppercase tracking-widest text-center px-2">
                  [Photo {i + 1}]
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-6">
            Les photos seront ajoutées dès que tu me les fournis.
          </p>
        </div>
      </section>

      {/* RÉSERVATION */}
      <section
        id="reservation"
        className="py-16 sm:py-24 scroll-mt-24"
      >
        <div className="container-padel max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-4">
              Réservation en ligne
            </p>
            <h2 className="heading-section">Réservez votre terrain</h2>
            <p className="mt-6 text-white/70 max-w-2xl mx-auto leading-relaxed">
              Choisissez votre date, votre créneau, votre terrain — votre
              demande est envoyée au club par WhatsApp pour confirmation.
            </p>
          </div>

          <ReservationFlow
            clubName={AGADIR.name}
            totalCourts={AGADIR.courts}
            whatsappNumber={AGADIR.whatsapp}
            rentalPricePerRacket={AGADIR.pricing.racketRental}
            accent="blue"
          />
        </div>
      </section>
    </div>
  );
}

function Stat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-2xl sm:text-3xl font-black text-brand-lime">{number}</div>
      <div className="text-[10px] uppercase tracking-widest text-white/50 mt-1">
        {label}
      </div>
    </div>
  );
}

function InfoCard({
  icon,
  title,
  children,
}: {
  icon: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="card p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-bold uppercase tracking-wider text-sm mb-2">{title}</h3>
      <p className="text-sm text-white/70 leading-relaxed">{children}</p>
    </div>
  );
}
