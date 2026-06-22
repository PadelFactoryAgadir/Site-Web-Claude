import type { Metadata } from 'next';
import Image from 'next/image';
import { setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { AGADIR, SOCIAL } from '@/lib/business-info';

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isFr = locale === 'fr';
  return {
    title: isFr ? 'Tournois & Événements Padel Factory' : 'Padel Factory Tournaments & Events',
    description: isFr
      ? 'Tournois P500, P1000, P2000H, Interclubs, événements internes : retrouvez tous nos tournois passés et à venir à Padel Factory Agadir.'
      : 'P500, P1000, P2000H tournaments, Interclubs, internal events: discover all our past and upcoming tournaments at Padel Factory Agadir.',
  };
}

const tournamentCategories = [
  { code: 'P500', color: 'blue' as const, descFr: 'Tournoi compétitif, premier palier officiel', descEn: 'Competitive tournament, first official tier' },
  { code: 'P1000', color: 'lime' as const, descFr: 'Tournoi compétitif élite, dotation et points renforcés', descEn: 'Elite competitive tournament, enhanced prize pool and points' },
  { code: 'P2000', color: 'green' as const, descFr: 'Tournoi premium — le niveau le plus élevé du circuit', descEn: 'Premium tournament — the highest level of the circuit' },
  { code: 'INTERCLUBS', color: 'blue' as const, descFr: 'Compétitions entre clubs marocains', descEn: 'Competitions between Moroccan clubs' },
];

// Affiches tournois avec noms de fichiers
const TOURNOIS = [
  { file: 'tournoi-p500-hommes.jpeg', nameFr: 'P500 Hommes', nameEn: 'P500 Men' },
  { file: 'tournoi-p1000-hommes.jpeg', nameFr: 'P1000 Hommes', nameEn: 'P1000 Men' },
  { file: 'tournoi-p2000.jpeg', nameFr: 'P2000H', nameEn: 'P2000H' },
  { file: 'tournoi-p1000-femmes.jpeg', nameFr: 'P1000 Femmes', nameEn: 'P1000 Women' },
  { file: 'tournoi-volkswagen.jpeg', nameFr: 'Open Volkswagen', nameEn: 'Volkswagen Open' },
  { file: 'tournoi-interclubs.jpeg', nameFr: 'Interclubs Casablanca', nameEn: 'Interclubs Casablanca' },
  { file: 'tournoi-ramadan.jpeg', nameFr: 'Ramadan Cup', nameEn: 'Ramadan Cup' },
  { file: 'tournoi-upl.jpeg', nameFr: 'UPL Tournament', nameEn: 'UPL Tournament' },
];

export default async function EventsPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  setRequestLocale(locale);
  const isFr = locale === 'fr';

  return (
    <article>
      {/* Hero */}
      <section className="relative min-h-[55vh] flex items-center justify-center overflow-hidden bg-black border-b border-white/10">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-zinc-900" />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-lime/15 rounded-full blur-[140px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-brand-blue/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative z-10 container-padel py-20 text-center max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-4">
            {isFr ? 'Tournois & Événements' : 'Tournaments & Events'}
          </p>
          <h1 className="heading-section mb-6">
            {isFr ? 'Vivez la compétition' : 'Live the competition'}
          </h1>
          <p className="text-white/70 text-lg leading-relaxed">
            {isFr
              ? "Du tournoi local au P2000, en passant par les Interclubs et les soirées internes : il y en a pour tous les niveaux toute l'année."
              : "From local tournament to P2000, through Interclubs and internal evenings: there's something for every level all year long."}
          </p>
        </div>
      </section>

      {/* Prochain tournoi */}
      <section className="py-16 border-b border-white/10">
        <div className="container-padel max-w-4xl">
          <div className="card p-8 border-2 border-brand-lime/30 relative overflow-hidden">
            <div className="absolute top-0 right-0 px-4 py-1.5 bg-brand-lime text-black text-xs font-bold uppercase tracking-widest rounded-bl-lg">
              {isFr ? 'Prochain événement' : 'Next event'}
            </div>
            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-brand-lime mb-3">
              [{isFr ? 'Date à venir' : 'Upcoming date'}]
            </p>
            <h2 className="text-3xl font-black uppercase tracking-tight mb-3">
              [{isFr ? 'Nom du tournoi' : 'Tournament name'}]
            </h2>
            <p className="text-white/70 leading-relaxed mb-6">
              {isFr
                ? "[Description du prochain tournoi à venir : catégorie, dotation, dates d'inscription, niveau requis...]"
                : '[Description of the next upcoming tournament: category, prize pool, registration dates, required level...]'}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <a href={AGADIR.whatsappLink} target="_blank" rel="noopener noreferrer" className="btn-primary inline-flex">
                {isFr ? "S'inscrire" : 'Register'}
              </a>
              <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-white/20 font-bold uppercase tracking-wider text-sm hover:bg-white hover:text-black transition">
                {isFr ? "Voir l'affiche" : 'See poster'}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Catégories */}
      <section className="py-20 border-b border-white/10">
        <div className="container-padel">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-lime mb-3">
              {isFr ? 'Nos catégories' : 'Our categories'}
            </p>
            <h2 className="heading-section">
              {isFr ? 'Le circuit Padel Factory' : 'The Padel Factory circuit'}
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {tournamentCategories.map((cat) => (
              <CategoryCard key={cat.code} code={cat.code} color={cat.color} description={isFr ? cat.descFr : cat.descEn} />
            ))}
          </div>
        </div>
      </section>

      {/* Galerie tournois */}
      <section className="py-20 border-b border-white/10 bg-gradient-dark">
        <div className="container-padel">
          <div className="text-center mb-12 max-w-3xl mx-auto">
            <p className="text-xs font-bold uppercase tracking-[0.4em] text-brand-blue mb-3">
              {isFr ? 'Souvenirs' : 'Memories'}
            </p>
            <h2 className="heading-section">
              {isFr ? 'Nos tournois passés' : 'Past tournaments'}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {TOURNOIS.map((t) => (
              <div key={t.file} className="card overflow-hidden group cursor-pointer hover:scale-[1.02] transition">
                <div className="relative aspect-[3/4] bg-zinc-900">
                  <Image
                    src={`/tournois/${t.file}`}
                    alt={isFr ? t.nameFr : t.nameEn}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-white/70">
                    {isFr ? t.nameFr : t.nameEn}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container-padel max-w-3xl text-center">
          <h2 className="heading-section mb-6">
            {isFr ? 'Restez informés' : 'Stay informed'}
          </h2>
          <p className="text-white/70 text-lg mb-8 leading-relaxed">
            {isFr
              ? "Suivez-nous sur Instagram pour ne rater aucun tournoi, ou contactez-nous directement par WhatsApp pour vous inscrire."
              : "Follow us on Instagram to never miss a tournament, or contact us directly via WhatsApp to register."}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <a href={SOCIAL.instagram} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-wider text-base bg-white text-black hover:bg-brand-lime transition w-full sm:w-[280px]">
              <InstagramIcon />
              Instagram
            </a>
            <a href={AGADIR.whatsappLink} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-3 px-6 py-4 rounded-xl font-black uppercase tracking-wider text-base bg-[#25D366] hover:bg-[#1eb858] text-white transition shadow-glow-green w-full sm:w-[280px]">
              <WhatsAppIcon />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </article>
  );
}

function CategoryCard({ code, color, description }: { code: string; color: 'blue' | 'green' | 'lime'; description: string }) {
  const accentText = color === 'blue' ? 'text-brand-blue' : color === 'green' ? 'text-brand-green' : 'text-brand-lime';
  const borderColor = color === 'blue' ? 'border-t-brand-blue' : color === 'green' ? 'border-t-brand-green' : 'border-t-brand-lime';
  return (
    <div className={`card p-6 border-t-4 ${borderColor}`}>
      <p className={`text-2xl sm:text-3xl font-black uppercase tracking-tight ${accentText} mb-3`}>{code}</p>
      <p className="text-sm text-white/70 leading-relaxed">{description}</p>
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

function InstagramIcon() {
  return (
    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
