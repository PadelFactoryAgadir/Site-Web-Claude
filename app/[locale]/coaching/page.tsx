import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';
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
    title: isFr ? 'Coaching & Padel Factory School' : 'Coaching & Padel Factory School',
    description: isFr
      ? 'Cours privés, école enfants, préparation compétition, événements internes. Découvrez nos programmes de coaching à Padel Factory Agadir.'
      : 'Private lessons, kids school, competition prep, internal events. Discover our coaching programs at Padel Factory Agadir.',
  };
}

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
          <h1 className="heading-section mb-6">
            {isFr ? 'Padel Factory School' : 'Padel Factory School'}
          </h1>
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
                      'Plan personnalisé sur 4 à 8 séances',
                      'Suivi vidéo et feedback technique',
                      'Disponible sur les 2 clubs',
                    ]
                  : [
                      'Adapted to your level (beginner → advanced)',
                      'Personal plan over 4 to 8 sessions',
                      'Video tracking and technical feedback',
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
                      'Programme enfants & ados — saison 2025/2026',
                      'Cours collectifs en petits groupes (3 à 6 élèves)',
                      'Apprentissage ludique, technique et compétition',
                      'Coachs spécialisés jeunesse',
                    ]
                  : [
                      'Kids & teens program — 2025/2026 season',
                      'Small group lessons (3 to 6 students)',
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
              title={isFr ? 'Événements internes' : 'Internal events'}
              tagline={isFr ? 'Animations club & soirées thématiques' : 'Club activities & themed evenings'}
              points={
                isFr
                  ? [
                      'Nuits du padel, tournois flash, week-ends à thème',
                      'Animation continue pour la communauté',
                      'Convivialité avant tout',
                      'Suivez-nous sur Instagram pour les annonces',
                    ]
                  : [
                      'Padel nights, flash tournaments, themed weekends',
                      'Continuous activity for the community',
                      'Conviviality first',
                      'Follow us on Instagram for announcements',
                    ]
              }
            />
          </div>
        </div>
      </section>

      {/* Coachs */}
      <section className="py-20 border-b border-white/10 bg-gradient-dark">
        <div className="container-padel">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-blue mb-3">
              {isFr ? 'Notre équipe' : 'Our team'}
            </p>
            <h2 className="heading-section">
              {isFr ? 'Nos coachs' : 'Our coaches'}
            </h2>
            <p className="mt-6 text-white/60 max-w-2xl mx-auto leading-relaxed">
              {isFr
                ? 'Une équipe de coachs passionnés et certifiés, prêts à vous accompagner dans votre progression.'
                : 'A team of passionate, certified coaches, ready to support you on your journey.'}
            </p>
          </div>

          {/* Grille coachs (placeholders) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="card overflow-hidden group">
                <div className="aspect-[3/4] bg-zinc-900 border-b border-white/10 flex items-center justify-center">
                  <span className="text-white/20 text-xs font-mono uppercase tracking-widest text-center px-2">
                    [Photo coach {i}]
                  </span>
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-lime mb-2">
                    Coach
                  </p>
                  <h3 className="font-extrabold uppercase tracking-tight text-lg mb-1">
                    [Nom du coach]
                  </h3>
                  <p className="text-xs text-white/60 leading-relaxed">
                    {isFr
                      ? '[Bio courte — spécialités, années d\'expérience]'
                      : '[Short bio — specialties, years of experience]'}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-8 text-center text-white/40 text-sm">
            {isFr
              ? 'Photos et bios des coachs à venir dès que tu me les fournis.'
              : 'Coach photos and bios coming soon.'}
          </p>
        </div>
      </section>

      {/* Comment s'inscrire */}
      <section className="py-20">
        <div className="container-padel max-w-3xl">
          <div className="text-center mb-12">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-3">
              {isFr ? 'Comment s\'inscrire' : 'How to register'}
            </p>
            <h2 className="heading-section">
              {isFr ? 'C\'est simple' : 'It\'s simple'}
            </h2>
          </div>

          <div className="space-y-4">
            <StepCard
              number="1"
              title={isFr ? 'Contactez-nous par WhatsApp' : 'Contact us via WhatsApp'}
              text={isFr
                ? 'Dites-nous votre niveau, vos disponibilités et le programme qui vous intéresse.'
                : 'Tell us your level, your availability, and which program interests you.'}
            />
            <StepCard
              number="2"
              title={isFr ? 'Premier rendez-vous' : 'First appointment'}
              text={isFr
                ? 'On évalue ensemble votre niveau et on définit votre plan de progression.'
                : 'We evaluate your level together and define your progress plan.'}
            />
            <StepCard
              number="3"
              title={isFr ? 'C\'est parti !' : 'Let\'s go!'}
              text={isFr
                ? 'Vous démarrez vos séances et progressez à votre rythme.'
                : 'You start your sessions and progress at your own pace.'}
            />
          </div>

          {/* CTA WhatsApp */}
          <div className="mt-10 text-center">
            <a
              href={AGADIR.whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-wider text-base bg-[#25D366] hover:bg-[#1eb858] text-white transition shadow-glow-green"
            >
              <WhatsAppIcon />
              {isFr ? 'S\'inscrire via WhatsApp' : 'Register via WhatsApp'}
            </a>
            <p className="mt-3 text-xs text-white/40">
              {AGADIR.phone}
            </p>
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

function StepCard({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <div className="card p-6 flex items-start gap-4">
      <div className="w-10 h-10 rounded-full bg-brand-blue text-white flex items-center justify-center font-black flex-shrink-0">
        {number}
      </div>
      <div>
        <h3 className="font-extrabold uppercase tracking-tight text-lg mb-1">
          {title}
        </h3>
        <p className="text-sm text-white/70 leading-relaxed">{text}</p>
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
