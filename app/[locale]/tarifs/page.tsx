import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { AGADIR } from '@/lib/business-info';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';

  return {
    title: isFr ? 'Tarifs Padel à Agadir' : 'Padel Pricing in Agadir',
    description: isFr
      ? 'Tarifs Padel Factory Agadir : 75 DHS/personne en heures creuses, 100 DHS/personne en heures pleines. Carte 10 séances à 850 DHS (-15%). Location raquette 20 DHS.'
      : 'Padel Factory Agadir pricing: 75 MAD/person off-peak, 100 MAD/person peak hours. 10-session pack at 850 MAD (-15%). Racket rental 20 MAD.',
  };
}

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  await getTranslations(); // pour que la locale soit bien chargée

  const isFr = locale === 'fr';
  const p = AGADIR.pricing;

  return (
    <article className="container-padel py-16 sm:py-24">
      {/* Header de page */}
      <header className="text-center mb-16 max-w-3xl mx-auto">
        <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-4">
          {isFr ? 'Créneaux & Tarifs' : 'Slots & Pricing'}
        </p>
        <h1 className="heading-section">
          {isFr ? 'Tarifs Padel Factory' : 'Padel Factory Pricing'}
        </h1>
        <p className="mt-6 text-white/70 text-lg leading-relaxed">
          {isFr
            ? 'Des prix clairs, sans surprise. Heures creuses ou heures pleines, choisissez le créneau qui vous convient et venez jouer.'
            : 'Clear pricing, no surprises. Off-peak or peak hours, pick the slot that suits you and come play.'}
        </p>
      </header>

      {/* Tableau des créneaux */}
      <section className="mb-16">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-center mb-8">
          {isFr ? 'Créneaux disponibles' : 'Available time slots'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Heures creuses */}
          <div className="card p-6 border-brand-blue/30">
            <div className="flex items-center gap-3 mb-4">
              <SunIcon />
              <h3 className="font-bold uppercase tracking-wider text-brand-blue">
                {isFr ? 'Heures creuses' : 'Off-peak hours'}
              </h3>
            </div>
            <ul className="space-y-2 text-white/80">
              {p.offPeakSlots.map((slot) => (
                <li key={slot} className="font-mono text-lg">
                  {slot}
                </li>
              ))}
            </ul>
          </div>

          {/* Heures pleines */}
          <div className="card p-6 border-brand-lime/30">
            <div className="flex items-center gap-3 mb-4">
              <MoonIcon />
              <h3 className="font-bold uppercase tracking-wider text-brand-lime">
                {isFr ? 'Heures pleines' : 'Peak hours'}
              </h3>
            </div>
            <ul className="space-y-2 text-white/80">
              {p.peakSlots.map((slot) => (
                <li key={slot} className="font-mono text-lg">
                  {slot}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Grille tarifaire */}
      <section className="mb-16">
        <h2 className="text-2xl font-extrabold uppercase tracking-tight text-center mb-8">
          {isFr ? 'Grille tarifaire' : 'Pricing grid'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <PriceCard
            label={isFr ? 'Heures creuses' : 'Off-peak'}
            duration={p.sessionDuration}
            perPerson={p.offPeakPerPerson}
            perCourt={p.offPeakPerCourt}
            currency={p.currency}
            accent="blue"
            isFr={isFr}
          />
          <PriceCard
            label={isFr ? 'Heures pleines' : 'Peak'}
            duration={p.sessionDuration}
            perPerson={p.peakPerPerson}
            perCourt={p.peakPerCourt}
            currency={p.currency}
            accent="lime"
            isFr={isFr}
          />
        </div>
      </section>

      {/* Bonus : carte 10 séances + raquettes */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Carte 10 séances */}
          <div className="card p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-lime text-black text-xs font-bold uppercase tracking-widest rounded-bl-lg">
              -{p.sessionPackage.discount}%
            </div>
            <div className="text-3xl mb-2">👑</div>
            <h3 className="text-xl font-extrabold uppercase tracking-tight mb-2">
              {isFr ? 'Carte 10 séances' : '10-session pack'}
            </h3>
            <p className="text-white/60 text-sm mb-4">
              {isFr
                ? `Engagez-vous sur ${p.sessionPackage.sessions} séances et économisez.`
                : `Commit to ${p.sessionPackage.sessions} sessions and save.`}
            </p>
            <p className="text-3xl font-black text-white">
              {p.sessionPackage.price}{' '}
              <span className="text-base font-bold text-white/60">{p.currency}</span>
            </p>
          </div>

          {/* Location raquette */}
          <div className="card p-8">
            <div className="text-3xl mb-2">🎾</div>
            <h3 className="text-xl font-extrabold uppercase tracking-tight mb-2">
              {isFr ? 'Location raquette' : 'Racket rental'}
            </h3>
            <p className="text-white/60 text-sm mb-4">
              {isFr
                ? 'Pas de raquette ? Pas de souci, on vous équipe sur place.'
                : 'No racket? No problem, we equip you on the spot.'}
            </p>
            <p className="text-3xl font-black text-white">
              {p.racketRental}{' '}
              <span className="text-base font-bold text-white/60">{p.currency}</span>
            </p>
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="text-center">
        <p className="text-white/60 mb-6">
          {isFr ? 'Prêt à jouer ?' : 'Ready to play?'}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/agadir#reservation" className="btn-primary">
            {isFr ? 'Réserver à Agadir' : 'Book at Agadir'}
          </Link>
          <Link
            href="/universiapolis#reservation"
            className="btn-primary-universiapolis"
          >
            {isFr ? 'Réserver à Universiapolis' : 'Book at Universiapolis'}
          </Link>
        </div>
      </section>
    </article>
  );
}

interface PriceCardProps {
  label: string;
  duration: string;
  perPerson: number;
  perCourt: number;
  currency: string;
  accent: 'blue' | 'lime';
  isFr: boolean;
}

function PriceCard({
  label,
  duration,
  perPerson,
  perCourt,
  currency,
  accent,
  isFr,
}: PriceCardProps) {
  const accentClass = accent === 'blue' ? 'text-brand-blue' : 'text-brand-lime';
  return (
    <div className="card p-8">
      <p className="text-xs font-bold uppercase tracking-[0.3em] text-white/50 mb-2">
        {duration}
      </p>
      <h3 className={`text-2xl font-extrabold uppercase mb-6 ${accentClass}`}>
        {label}
      </h3>
      <div className="space-y-3">
        <div className="flex items-baseline justify-between">
          <span className="text-white/70 text-sm">
            {isFr ? 'Par personne' : 'Per person'}
          </span>
          <span className="text-2xl font-black">
            {perPerson} <span className="text-sm text-white/60">{currency}</span>
          </span>
        </div>
        <div className="h-px bg-white/10" />
        <div className="flex items-baseline justify-between">
          <span className="text-white/70 text-sm">
            {isFr ? 'Le terrain' : 'Per court'}
          </span>
          <span className="text-2xl font-black">
            {perCourt} <span className="text-sm text-white/60">{currency}</span>
          </span>
        </div>
      </div>
    </div>
  );
}

function SunIcon() {
  return (
    <svg className="w-5 h-5 text-brand-blue" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 7c-2.76 0-5 2.24-5 5s2.24 5 5 5 5-2.24 5-5-2.24-5-5-5zM2 13h2c.55 0 1-.45 1-1s-.45-1-1-1H2c-.55 0-1 .45-1 1s.45 1 1 1zm18 0h2c.55 0 1-.45 1-1s-.45-1-1-1h-2c-.55 0-1 .45-1 1s.45 1 1 1zM11 2v2c0 .55.45 1 1 1s1-.45 1-1V2c0-.55-.45-1-1-1s-1 .45-1 1zm0 18v2c0 .55.45 1 1 1s1-.45 1-1v-2c0-.55-.45-1-1-1s-1 .45-1 1zM5.99 4.58a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41L5.99 4.58zm12.37 12.37a.996.996 0 00-1.41 0 .996.996 0 000 1.41l1.06 1.06c.39.39 1.03.39 1.41 0a.996.996 0 000-1.41l-1.06-1.06zm1.06-10.96a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06a.996.996 0 000 1.41c.39.39 1.03.39 1.41 0l1.06-1.06zM7.05 18.36a.996.996 0 000-1.41.996.996 0 00-1.41 0l-1.06 1.06a.996.996 0 000 1.41c.39.39 1.03.39 1.41 0l1.06-1.06z" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg className="w-5 h-5 text-brand-lime" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 3a9 9 0 109 9c0-.46-.04-.92-.1-1.36a5.389 5.389 0 01-4.4 2.26 5.403 5.403 0 01-3.14-9.8c-.44-.06-.9-.1-1.36-.1z" />
    </svg>
  );
}
