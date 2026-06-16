import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { UNIVERSIAPOLIS } from '@/lib/business-info';
import ReservationFlow from '@/components/reservation/ReservationFlow';
import { fetchAvailability } from '@/lib/availability';
import MapEmbed from '@/components/MapEmbed';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return {
    title: isFr
      ? 'Padel Factory Universiapolis — Campus'
      : 'Padel Factory Universiapolis — Campus',
    description: isFr
      ? 'Réservez votre terrain au club Padel Factory Universiapolis. 3 terrains modernes au campus universitaire.'
      : 'Book your court at Padel Factory Universiapolis. 3 modern courts at the university campus.',
  };
}

export default async function UniversiapolisPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isFr = locale === 'fr';
  const apiData = await fetchAvailability('universiapolis');

  return (
    <div>
      {/* Hero club */}
      <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-900" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-green/20 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-lime/5 rounded-full blur-[120px]" />
        </div>

        <div className="relative z-10 container-padel py-24 text-center">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-green mb-4">
            {isFr ? 'Campus Universiapolis' : 'Universiapolis Campus'}
          </p>
          <h1 className="heading-section mb-6">Padel Factory Universiapolis</h1>
          <p className="text-white/70 text-lg max-w-2xl mx-auto leading-relaxed">
            {isFr
              ? 'Notre club au campus Universiapolis : 3 terrains modernes, ambiance dynamique idéale pour étudiants, compétiteurs et joueurs loisirs.'
              : 'Our Universiapolis campus club: 3 modern courts, dynamic vibe ideal for students, competitors and casual players.'}
          </p>

          <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            <Stat number="3" label={isFr ? 'Terrains' : 'Courts'} />
            <Stat number="9h30" label={isFr ? 'Ouverture' : 'Opens'} />
            <Stat number="23h" label={isFr ? 'Fermeture' : 'Closes'} />
            <Stat number="7/7" label={isFr ? 'Jours' : 'Days'} />
          </div>
        </div>
      </section>

      {/* Section infos pratiques + carte */}
      <section className="py-16 sm:py-20 border-b border-white/10">
        <div className="container-padel">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            <InfoCard icon="📍" title={isFr ? 'Localisation' : 'Location'}>
              {UNIVERSIAPOLIS.address.street}, Agadir
              <br />
              <span className="text-white/50 text-xs">
                {isFr
                  ? "Université Internationale d'Agadir"
                  : 'Universiapolis International University'}
              </span>
            </InfoCard>
            <InfoCard icon="🅿️" title="Parking">
              {isFr ? 'Parking universitaire accessible' : 'University parking available'}
            </InfoCard>
            <InfoCard icon="🚿" title={isFr ? 'Vestiaires' : 'Locker rooms'}>
              {isFr ? 'Vestiaires + douches sur place' : 'Lockers + showers on site'}
            </InfoCard>
            <InfoCard icon="🎓" title={isFr ? 'Communauté' : 'Community'}>
              {isFr ? 'Étudiants, compétiteurs, loisir' : 'Students, competitors, casual'}
            </InfoCard>
          </div>

          {/* Carte Google Maps */}
          <MapEmbed
            query={UNIVERSIAPOLIS.googleMapsEmbedQuery}
            mapsUrl={UNIVERSIAPOLIS.googleMapsUrl}
            title={UNIVERSIAPOLIS.name}
            height={380}
          />
        </div>
      </section>

      {/* Galerie placeholder */}
      <section className="py-16 sm:py-20 border-b border-white/10">
        <div className="container-padel">
          <h2 className="heading-section text-center mb-12">
            {isFr ? 'Le club en images' : 'The club in pictures'}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-xl bg-zinc-900 border border-white/10 flex items-center justify-center"
              >
                <span className="text-white/20 text-xs font-mono uppercase tracking-widest text-center px-2">
                  [{isFr ? 'Photo' : 'Photo'} {i + 1}]
                </span>
              </div>
            ))}
          </div>
          <p className="text-center text-white/40 text-sm mt-6">
            {isFr
              ? 'Les photos seront ajoutées dès que tu me les fournis.'
              : 'Photos will be added soon.'}
          </p>
        </div>
      </section>

      {/* RÉSERVATION */}
      <section id="reservation" className="py-16 sm:py-24 scroll-mt-24">
        <div className="container-padel max-w-5xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-4">
              {isFr ? 'Réservation en ligne' : 'Online booking'}
            </p>
            <h2 className="heading-section">
              {isFr ? 'Réservez votre terrain' : 'Book your court'}
            </h2>
            <p className="mt-6 text-white/70 max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? 'Choisissez votre date, votre créneau, votre terrain — votre demande est envoyée au club par WhatsApp pour confirmation.'
                : 'Pick your date, your slot, your court — your request is sent to the club via WhatsApp for confirmation.'}
            </p>
          </div>

          <ReservationFlow
            clubName={UNIVERSIAPOLIS.name}
            clubSlug={UNIVERSIAPOLIS.slug}
            totalCourts={UNIVERSIAPOLIS.courts}
            whatsappNumber={UNIVERSIAPOLIS.whatsapp}
            rentalPricePerRacket={UNIVERSIAPOLIS.pricing.racketRental}
            accent="green"
            apiData={apiData}
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
