import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { AGADIR } from '@/lib/business-info';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Coaching & Padel Factory School' : 'Coaching & Padel Factory School',
    description: isFr
      ? 'Cours privés, école enfants dès 4 ans, préparation compétition, événements sur mesure. Découvrez nos coachs Hicham, Imad et Mehdi à Padel Factory Agadir.'
      : 'Private lessons, kids school from age 4, competition prep, custom events. Meet our coaches Hicham, Imad and Mehdi at Padel Factory Agadir.',
  };
}

// Données réelles des 3 coachs Padel Factory
const COACHES = [
  {
    name: 'Hicham Majdoubi',
    photo: '/coaches/hicham.jpeg',
    title: { fr: 'Federal Coach', en: 'Federal Coach' },
    rank: { fr: 'Former Top 40', en: 'Former Top 40' },
    bio: {
      fr: [
        'Coach National de Padel au Maroc & en France',
        'Sélectionné pour l\'Équipe Nationale de Padel',
        '+10 ans d\'expérience en coaching Padel',
      ],
      en: [
        'National Padel Coach in Morocco & France',
        'Selected for the National Padel Team',
        '+10 years of experience in Padel coaching',
      ],
    },
    price: 500,
    duration: { fr: '1 heure (individuel)', en: '1-hour session (individual)' },
    phone: '+212 6 61 08 96 85',
    whatsapp: 'https://wa.me/212661089685',
  },
  {
    name: 'Imad Majdoubi',
    photo: '/coaches/imad.jpeg',
    title: { fr: 'Federal Coach', en: 'Federal Coach' },
    rank: { fr: 'Former Top 40', en: 'Former Top 40' },
    bio: {
      fr: [
        'Ancien joueur de tennis professionnel (ITF)',
        '20 ans d\'expérience en coaching tennis',
        'Federal Coach — Maroc',
      ],
      en: [
        'Former professional tennis player (ITF)',
        '20 years of experience in tennis coaching',
        'Federal Coach — Morocco',
      ],
    },
    price: 450,
    duration: { fr: '1 heure (individuel)', en: '1-hour session (individual)' },
    phone: '+212 6 36 03 89 53',
    whatsapp: 'https://wa.me/212636038953',
  },
  {
    name: 'Mehdi Mazouz',
    photo: '/coaches/mehdi.jpeg',
    title: { fr: 'Coach', en: 'Coach' },
    rank: { fr: 'Former Top 20', en: 'Former Top 20' },
    bio: {
      fr: [
        'Double Champion Arabe de Tennis',
        'Sélectionneur et coach de l\'Équipe Spéciale Olympics Tennis 2022',
        'Formation Federal Coach en cours',
      ],
      en: [
        'Two-time Arab Tennis Champion',
        'Selector and coach for the Special Olympics Tennis 2022 Team',
        'Federal Coach training in progress',
      ],
    },
    price: 400,
    duration: { fr: '1 heure (individuel)', en: '1-hour session (individual)' },
    phone: '+212 6 31 30 76 21',
    whatsapp: 'https://wa.me/212631307621',
  },
];

export default async function CoachingPage({
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
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-900" />
          <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-blue/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-lime/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 container-padel py-20 text-center max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-4">
            {isFr ? 'Coaching & Académie' : 'Coaching & Academy'}
          </p>
          <h1 className="heading-section mb-6">Padel Factory School</h1>
          <p className="text-white/70 text-lg leading-relaxed">
            {isFr
              ? 'Progressez à votre rythme, du premier set au tournoi international. Nos coachs vous accompagnent.'
              : 'Progress at your own pace, from your first set to international tournaments. Our coaches guide you.'}
          </p>
        </div>
      </section>

      {/* 4 Programmes */}
      <section className="py-20 border-b border-white/10">
        <div className="container-padel">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-3">
              {isFr ? 'Nos programmes' : 'Our programs'}
            </p>
            <h2 className="heading-section">
              {isFr ? 'Trouvez votre voie' : 'Find your path'}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <ProgramCard
              number="01"
              accent="blue"
              title={isFr ? 'Cours privé' : 'Private lesson'}
              tagline={isFr ? 'Coaching individuel' : 'One-on-one coaching'}
              points={
                isFr
                  ? [
                      'Adapté à votre niveau (débutant → confirmé)',
                      'Plan personnalisé sur 5 à 10 séances (tarif préférentiel)',
                      'Sessions individuelles ou à plusieurs',
                      'Disponible sur les 2 clubs',
                    ]
                  : [
                      'Adapted to your level (beginner → advanced)',
                      'Personalized plan over 5 to 10 sessions (preferred rate)',
                      'Individual or group sessions',
                      'Available at both clubs',
                    ]
              }
            />
            <ProgramCard
              number="02"
              accent="lime"
              title={isFr ? 'Padel Factory School' : 'Padel Factory School'}
              tagline={isFr ? 'Le sport de la nouvelle génération' : 'The sport of the new generation'}
              points={
                isFr
                  ? [
                      'Programme enfants & ados — à partir de 4 ans',
                      'Cours collectifs le mercredi et le samedi (formule au choix)',
                      'Apprentissage ludique, technique et compétition',
                      'Coachs spécialisés jeunesse',
                    ]
                  : [
                      'Kids & teens program — from age 4',
                      'Group lessons on Wednesdays and Saturdays (formula of your choice)',
                      'Playful learning, technique and competition',
                      'Youth-specialized coaches',
                    ]
              }
            />
            <ProgramCard
              number="03"
              accent="green"
              title={isFr ? 'Préparation compétition' : 'Competition prep'}
              tagline={isFr ? 'Niveau intermédiaire et plus' : 'Intermediate level and above'}
              points={
                isFr
                  ? [
                      'Préparation physique et tactique',
                      'Sparring avec joueurs de niveau équivalent',
                      'Stratégie de paire et lecture du jeu',
                      'Suivi avant et après tournois',
                    ]
                  : [
                      'Physical and tactical preparation',
                      'Sparring with same-level players',
                      'Pair strategy and game reading',
                      'Follow-up before and after tournaments',
                    ]
              }
            />
            <ProgramCard
              number="04"
              accent="blue"
              title={isFr ? 'Animations club & events sur mesure' : 'Club events & custom experiences'}
              tagline={isFr ? 'Pour tous les niveaux' : 'For all levels'}
              points={
                isFr
                  ? [
                      'Offres corporate dédiées aux entreprises',
                      'Animations pour tous les niveaux',
                      'Tournois homologués par la Fédération Royale Marocaine de Tennis',
                      'Événements sur mesure (anniversaires, team building, soirées thématiques...)',
                    ]
                  : [
                      'Dedicated corporate offers for companies',
                      'Activities for all levels',
                      'Tournaments certified by the Royal Moroccan Tennis Federation',
                      'Custom events (birthdays, team building, themed evenings...)',
                    ]
              }
            />
          </div>
        </div>
      </section>

      {/* Coachs - VRAIES DONNÉES */}
      <section className="py-20 border-b border-white/10 bg-gradient-dark">
        <div className="container-padel">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-blue mb-3">
              {isFr ? 'Notre équipe' : 'Our team'}
            </p>
            <h2 className="heading-section">
              {isFr ? 'Rencontrez vos coachs' : 'Meet your coaches'}
            </h2>
            <p className="mt-6 text-white/60 max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? '3 coachs certifiés, joueurs de haut niveau, à votre service pour faire progresser votre jeu.'
                : '3 certified coaches, high-level players, at your service to improve your game.'}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {COACHES.map((coach, idx) => (
              <CoachCard
                key={coach.name}
                coach={coach}
                isFr={isFr}
                index={idx}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Galerie Padel Factory School */}
      <section className="py-20 border-b border-white/10">
        <div className="container-padel">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-3">
              {isFr ? 'En images' : 'In pictures'}
            </p>
            <h2 className="heading-section">
              Padel Factory School
            </h2>
            <p className="mt-6 text-white/60 max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? "L'académie jeunesse de Padel Factory — apprentissage, technique et passion du padel dès 4 ans."
                : 'The Padel Factory youth academy — learning, technique and passion for padel from age 4.'}
            </p>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="relative aspect-square rounded-xl overflow-hidden bg-zinc-900 border border-white/10">
                <Image
                  src={`/coaching/school-${i + 1}.jpeg`}
                  alt={`Padel Factory School - Photo ${i + 1}`}
                  fill
                  className="object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Comment réserver un coaching */}
      <section className="py-20">
        <div className="container-padel max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-3">
              {isFr ? 'Réserver un coaching' : 'Book a coaching session'}
            </p>
            <h2 className="heading-section">
              {isFr ? "C'est simple" : "It's simple"}
            </h2>
          </div>

          <div className="space-y-6">
            {/* Pour un coaching : contacter le coach */}
            <div className="card p-6 sm:p-8 border-l-4 border-l-brand-blue">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-blue text-white flex items-center justify-center text-2xl flex-shrink-0">
                  👨‍🏫
                </div>
                <div>
                  <h3 className="font-extrabold uppercase tracking-tight text-xl mb-2">
                    {isFr ? 'Pour un coaching' : 'For a coaching session'}
                  </h3>
                  <p className="text-white/70 leading-relaxed">
                    {isFr
                      ? 'Contactez directement le coach de votre choix sur WhatsApp (voir les numéros sur leurs fiches ci-dessus).'
                      : 'Contact the coach of your choice directly on WhatsApp (phone numbers on their cards above).'}
                  </p>
                </div>
              </div>
            </div>

            {/* Pour les autres offres : contacter le club */}
            <div className="card p-6 sm:p-8 border-l-4 border-l-brand-lime">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-lime text-black flex items-center justify-center text-2xl flex-shrink-0">
                  🎯
                </div>
                <div className="flex-1">
                  <h3 className="font-extrabold uppercase tracking-tight text-xl mb-2">
                    {isFr ? 'Pour nos autres offres' : 'For our other offers'}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-5">
                    {isFr
                      ? 'École Padel Factory, préparation compétition, événements sur mesure, offres corporate, tournois homologués... Contactez directement le club Padel Factory Agadir sur WhatsApp.'
                      : 'Padel Factory School, competition prep, custom events, corporate offers, certified tournaments... Contact Padel Factory Agadir directly on WhatsApp.'}
                  </p>
                  <a
                    href={AGADIR.whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-3 px-6 py-3 rounded-xl font-black uppercase tracking-wider text-sm bg-[#25D366] hover:bg-[#1eb858] text-white transition shadow-glow-green"
                  >
                    <WhatsAppIcon />
                    {isFr ? 'Contacter Padel Factory Agadir' : 'Contact Padel Factory Agadir'}
                  </a>
                  <p className="mt-3 text-xs text-white/40">
                    {AGADIR.phone}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </article>
  );
}

interface ProgramCardProps {
  number: string;
  accent: 'blue' | 'green' | 'lime';
  title: string;
  tagline: string;
  points: string[];
}

function ProgramCard({ number, accent, title, tagline, points }: ProgramCardProps) {
  const accentClass =
    accent === 'blue' ? 'text-brand-blue' : accent === 'green' ? 'text-brand-green' : 'text-brand-lime';
  const borderClass =
    accent === 'blue' ? 'border-l-brand-blue' : accent === 'green' ? 'border-l-brand-green' : 'border-l-brand-lime';

  return (
    <div className={`card p-6 sm:p-8 border-l-4 ${borderClass}`}>
      <div className="flex items-center gap-3 mb-3">
        <span className={`text-3xl font-black ${accentClass}`}>{number}</span>
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/40">
          {tagline}
        </span>
      </div>
      <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight mb-4">
        {title}
      </h3>
      <ul className="space-y-2">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-2 text-sm text-white/70">
            <span className={`${accentClass} mt-1`}>▸</span>
            <span>{p}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

interface CoachCardProps {
  coach: typeof COACHES[number];
  isFr: boolean;
  index: number;
}

function CoachCard({ coach, isFr, index }: CoachCardProps) {
  // 3 couleurs d'accent qui tournent pour différencier les coachs
  const accents = ['blue', 'green', 'lime'] as const;
  const accent = accents[index % 3];
  const accentText =
    accent === 'blue'
      ? 'text-brand-blue'
      : accent === 'green'
      ? 'text-brand-green'
      : 'text-brand-lime';
  const accentBorder =
    accent === 'blue'
      ? 'border-l-brand-blue'
      : accent === 'green'
      ? 'border-l-brand-green'
      : 'border-l-brand-lime';

  return (
    <div className={`card overflow-hidden border-l-4 ${accentBorder} flex flex-col`}>
      {/* Photo du coach */}
      <div className="aspect-[3/4] bg-zinc-900 border-b border-white/10 flex items-center justify-center relative overflow-hidden">
        {coach.photo ? (
          <Image
            src={coach.photo}
            alt={`Coach ${coach.name}`}
            fill
            className="object-cover object-top"
          />
        ) : (
          <>
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40" />
            <span className="relative text-white/20 text-xs font-mono uppercase tracking-widest text-center px-2">
              [{isFr ? 'Photo' : 'Photo'} {coach.name}]
            </span>
          </>
        )}
      </div>

      {/* Contenu */}
      <div className="p-6 flex-1 flex flex-col">
        <p className={`text-[10px] font-bold uppercase tracking-[0.3em] ${accentText} mb-1.5`}>
          {coach.title[isFr ? 'fr' : 'en']}
        </p>
        <h3 className="font-extrabold uppercase tracking-tight text-xl mb-1">
          {coach.name}
        </h3>
        <p className="text-xs text-brand-lime font-bold uppercase tracking-wider mb-4">
          ★ {coach.rank[isFr ? 'fr' : 'en']}
        </p>

        {/* Bio */}
        <ul className="space-y-2 mb-5 flex-1">
          {coach.bio[isFr ? 'fr' : 'en'].map((line, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-white/70 leading-relaxed">
              <span className={`${accentText} mt-0.5 flex-shrink-0`}>▸</span>
              <span>{line}</span>
            </li>
          ))}
        </ul>

        {/* Tarif */}
        <div className="bg-white/5 border border-white/10 rounded-lg p-3 mb-4">
          <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
            {coach.duration[isFr ? 'fr' : 'en']}
          </p>
          <p className="text-2xl font-black">
            {coach.price} <span className="text-sm font-bold text-white/60">DHS</span>
          </p>
        </div>

        {/* Bouton WhatsApp */}
        <a
          href={coach.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 w-full px-4 py-3 rounded-lg font-bold uppercase tracking-wider text-sm bg-[#25D366] hover:bg-[#1eb858] text-white transition"
        >
          <WhatsAppIcon />
          {coach.phone}
        </a>
      </div>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
