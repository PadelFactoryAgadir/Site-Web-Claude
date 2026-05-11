import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { SITE } from '@/lib/business-info';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'À propos de Padel Factory' : 'About Padel Factory',
    description: isFr
      ? 'Découvrez l\'histoire, la vision et les valeurs de Padel Factory, premier club de padel d\'Agadir.'
      : 'Discover the story, vision and values of Padel Factory, the first padel club in Agadir.',
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isFr = locale === 'fr';

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[50vh] flex items-center justify-center overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-900" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-brand-lime/10 rounded-full blur-[140px]" />
        </div>
        <div className="relative z-10 container-padel py-20 text-center max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-4">
            {isFr ? 'Notre histoire' : 'Our story'}
          </p>
          <h1 className="heading-section mb-6">
            {isFr ? 'À propos de Padel Factory' : 'About Padel Factory'}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            {isFr
              ? 'Plus qu\'un club de padel, une communauté passionnée qui fait grandir le sport à Agadir.'
              : 'More than a padel club — a passionate community growing the sport in Agadir.'}
          </p>
        </div>
      </section>

      {/* Notre histoire */}
      <section className="py-20 border-b border-white/10">
        <div className="container-padel max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-blue mb-3">
                01 / {isFr ? 'Notre histoire' : 'Our story'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
                {isFr ? 'Comment tout a commencé' : 'How it all started'}
              </h2>
            </div>
            <div className="lg:col-span-2 space-y-4 text-white/80 leading-relaxed">
              <p>
                {isFr ? (
                  <>
                    Padel Factory est né d'une <strong>passion partagée</strong>
                    {' '}pour le padel et de la volonté de proposer à Agadir une expérience à la hauteur des meilleurs clubs européens. Aujourd'hui, c'est le <strong>premier club de padel d'Agadir</strong> avec deux structures, sept terrains et une communauté de passionnés grandissante.
                  </>
                ) : (
                  <>
                    Padel Factory was born from a <strong>shared passion</strong>
                    {' '}for padel and a desire to offer Agadir an experience matching the best European clubs. Today, it's the <strong>first padel club in Agadir</strong> with two locations, seven courts, and a growing community of enthusiasts.
                  </>
                )}
              </p>
              <p className="text-white/60 italic text-sm">
                {isFr
                  ? '[À COMPLÉTER : ton récit personnel — quand tu as découvert le padel, pourquoi tu as ouvert le premier club, ce qui te motive aujourd\'hui]'
                  : '[TO BE FILLED: your personal story — when you discovered padel, why you opened the first club, what motivates you today]'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Notre vision */}
      <section className="py-20 border-b border-white/10 bg-gradient-dark">
        <div className="container-padel max-w-4xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
            <div className="lg:col-span-1">
              <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-green mb-3">
                02 / {isFr ? 'Notre vision' : 'Our vision'}
              </p>
              <h2 className="text-2xl sm:text-3xl font-extrabold uppercase tracking-tight">
                {isFr ? 'Où on va' : 'Where we\'re going'}
              </h2>
            </div>
            <div className="lg:col-span-2 space-y-4 text-white/80 leading-relaxed">
              <p>
                {isFr
                  ? 'Développer une culture padel moderne et accessible à Agadir. Nous voulons que chaque joueur — débutant ou compétiteur — trouve chez Padel Factory un lieu qui lui ressemble : exigeant sur la qualité, mais avant tout convivial et humain.'
                  : 'Develop a modern, accessible padel culture in Agadir. We want every player — beginner or competitor — to find at Padel Factory a place that suits them: demanding on quality, but above all welcoming and human.'}
              </p>
              <p>
                {isFr
                  ? 'Faire du Maroc une référence du padel sur le continent africain et au-delà — un terrain à la fois.'
                  : 'Make Morocco a padel reference on the African continent and beyond — one court at a time.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Nos valeurs */}
      <section className="py-20 border-b border-white/10">
        <div className="container-padel">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-3">
              03 / {isFr ? 'Nos valeurs' : 'Our values'}
            </p>
            <h2 className="heading-section">
              {isFr ? 'Ce qui nous porte' : 'What drives us'}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ValueCard
              icon="🤝"
              title={isFr ? 'Communauté' : 'Community'}
              text={isFr
                ? 'Le padel se joue à 4. Chaque match construit des liens.'
                : 'Padel is played 4 by 4. Every match builds bonds.'}
            />
            <ValueCard
              icon="🏆"
              title={isFr ? 'Performance' : 'Performance'}
              text={isFr
                ? 'Équipements de pointe, coaching exigeant, niveau qui grimpe.'
                : 'Top-tier equipment, demanding coaching, level climbing.'}
            />
            <ValueCard
              icon="🎉"
              title={isFr ? 'Convivialité' : 'Conviviality'}
              text={isFr
                ? 'On vient pour jouer, on reste pour la cafèt et l\'ambiance.'
                : 'You come to play, you stay for the café and the vibe.'}
            />
            <ValueCard
              icon="⭐"
              title={isFr ? 'Excellence' : 'Excellence'}
              text={isFr
                ? 'Aucun compromis sur la qualité, à tous les étages.'
                : 'No compromise on quality, top to bottom.'}
            />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-b border-white/10 bg-gradient-dark">
        <div className="container-padel max-w-4xl">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <BigStat number="2" label={isFr ? 'Clubs' : 'Clubs'} />
            <BigStat number="7" label={isFr ? 'Terrains' : 'Courts'} />
            <BigStat number="+3" label={isFr ? 'Ans' : 'Years'} />
            <BigStat number="9.7K" label={isFr ? 'Followers' : 'Followers'} />
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20">
        <div className="container-padel max-w-3xl text-center">
          <h2 className="heading-section mb-6">
            {isFr ? 'Rejoignez l\'aventure' : 'Join the journey'}
          </h2>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            {isFr
              ? 'Un terrain vous attend. Réservez votre premier match dans le club de votre choix.'
              : 'A court is waiting for you. Book your first match at the club of your choice.'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/agadir#reservation"
              className="btn-primary w-full sm:w-[280px] whitespace-nowrap"
            >
              {isFr ? 'Réserver à Agadir' : 'Book at Agadir'}
            </Link>
            <Link
              href="/universiapolis#reservation"
              className="btn-primary-universiapolis w-full sm:w-[280px] whitespace-nowrap"
            >
              {isFr ? 'Réserver à Universiapolis' : 'Book at Universiapolis'}
            </Link>
          </div>
        </div>
      </section>
    </article>
  );
}

function ValueCard({ icon, title, text }: { icon: string; title: string; text: string }) {
  return (
    <div className="card p-6">
      <div className="text-3xl mb-3">{icon}</div>
      <h3 className="font-extrabold uppercase tracking-tight text-lg mb-2">
        {title}
      </h3>
      <p className="text-sm text-white/70 leading-relaxed">{text}</p>
    </div>
  );
}

function BigStat({ number, label }: { number: string; label: string }) {
  return (
    <div>
      <div className="text-4xl sm:text-5xl font-black text-brand-lime">
        {number}
      </div>
      <div className="text-xs uppercase tracking-widest text-white/50 mt-2">
        {label}
      </div>
    </div>
  );
}
