import { useTranslations, useLocale } from 'next-intl';
import { Link } from '@/i18n/routing';
import Logo from './Logo';
import { AGADIR, UNIVERSIAPOLIS, SITE, SOCIAL } from '@/lib/business-info';

/**
 * Footer du site.
 * Toutes les coordonnées proviennent de lib/business-info.ts
 * (modifier là-bas met à jour automatiquement le footer + le SEO).
 */
export default function Footer() {
  const tNav = useTranslations('Nav');
  const tFooter = useTranslations('Footer');
  const tMeta = useTranslations('Metadata');
  const locale = useLocale();
  const isFr = locale === 'fr';

  const year = new Date().getFullYear();

  return (
    <footer className="bg-black border-t border-white/10 mt-24">
      <div className="container-padel py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Colonne 1 : Logo + tagline */}
          <div className="lg:col-span-1">
            <Logo variant="default" size="md" />
            <p className="mt-4 text-sm text-white/60 leading-relaxed">
              {tMeta('description')}
            </p>
            <p className="mt-3 text-xs text-white/40">
              {isFr ? (
                <>1<sup>er</sup> Club de Padel d&apos;Agadir</>
              ) : (
                <>1<sup>st</sup> Padel Club in Agadir</>
              )}
            </p>
          </div>

          {/* Colonne 2 : Padel Factory Agadir */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-sm text-brand-blue mb-4">
              {AGADIR.shortName}
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <PinIcon />
                <span>
                  {AGADIR.address.street},<br />
                  {AGADIR.address.locality}
                </span>
              </li>
              <li>
                <a
                  href={AGADIR.phoneHref}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <PhoneIcon />
                  {AGADIR.phone}
                </a>
              </li>
              <li>
                <a
                  href={AGADIR.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-lime transition-colors flex items-center gap-2"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={AGADIR.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <InstagramIcon />
                  {AGADIR.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={AGADIR.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <PinIcon />
                  Google Maps
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/agadir"
                  className="font-semibold hover:text-brand-blue transition-colors"
                >
                  {tNav('agadir')} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 3 : Padel Factory Universiapolis */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-sm text-brand-green mb-4">
              {UNIVERSIAPOLIS.shortName}
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li className="flex items-start gap-2">
                <PinIcon />
                <span>
                  {UNIVERSIAPOLIS.address.street},<br />
                  {UNIVERSIAPOLIS.address.locality}
                </span>
              </li>
              <li>
                <a
                  href={UNIVERSIAPOLIS.phoneHref}
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <PhoneIcon />
                  {UNIVERSIAPOLIS.phone}
                </a>
              </li>
              <li>
                <a
                  href={UNIVERSIAPOLIS.whatsappLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-brand-lime transition-colors flex items-center gap-2"
                >
                  <WhatsAppIcon />
                  WhatsApp
                </a>
              </li>
              <li>
                <a
                  href={UNIVERSIAPOLIS.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <InstagramIcon />
                  {UNIVERSIAPOLIS.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={UNIVERSIAPOLIS.googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors flex items-center gap-2"
                >
                  <PinIcon />
                  Google Maps
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/universiapolis"
                  className="font-semibold hover:text-brand-green transition-colors"
                >
                  {tNav('universiapolis')} →
                </Link>
              </li>
            </ul>
          </div>

          {/* Colonne 4 : Liens rapides + réseaux */}
          <div>
            <h3 className="font-bold uppercase tracking-wider text-sm text-white mb-4">
              {tFooter('quickLinks')}
            </h3>
            <ul className="space-y-2 text-sm text-white/70">
              <li>
                <Link href="/tarifs" className="hover:text-white transition-colors">
                  {tNav('pricing')}
                </Link>
              </li>
              <li>
                <Link href="/coaching" className="hover:text-white transition-colors">
                  {tNav('coaching')}
                </Link>
              </li>
              <li>
                <Link href="/tournois" className="hover:text-white transition-colors">
                  {tNav('events')}
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="hover:text-white transition-colors">
                  {tNav('about')}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  {tNav('contact')}
                </Link>
              </li>
            </ul>

            <h3 className="font-bold uppercase tracking-wider text-sm text-white mt-6 mb-3">
              {tFooter('follow')}
            </h3>
            <div className="flex items-center gap-3">
              <a
                href={SOCIAL.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram Padel Factory"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href={AGADIR.whatsappLink}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="WhatsApp Padel Factory"
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center hover:bg-white hover:text-black transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                </svg>
              </a>
            </div>

            <p className="mt-4 text-xs text-white/40">
              {SOCIAL.instagramHandle} · 9.7K followers
            </p>
          </div>
        </div>

        {/* Ligne du bas */}
        <div className="mt-12 pt-6 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/50">
          <p>
            © {year} {SITE.name}. {tFooter('rights')}.
          </p>
          <p className="font-mono">{SITE.domain}</p>
        </div>
      </div>
    </footer>
  );
}

/* Petites icônes inline (évite d'ajouter une lib) */
function PinIcon() {
  return (
    <svg className="w-4 h-4 mt-0.5 flex-shrink-0 text-white/40" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0zM12 11a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 text-white/40" fill="currentColor" viewBox="0 0 24 24">
      <path d="M20 15.5c-1.25 0-2.45-.2-3.57-.57a1.02 1.02 0 00-1.02.24l-2.2 2.2a15.045 15.045 0 01-6.59-6.58l2.2-2.21a.96.96 0 00.25-1A11.36 11.36 0 018.5 4c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1 0 9.39 7.61 17 17 17 .55 0 1-.45 1-1v-3.5c0-.55-.45-1-1-1z" />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 text-brand-lime" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg className="w-4 h-4 flex-shrink-0 text-white/60" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zM5.838 12a6.162 6.162 0 1112.324 0 6.162 6.162 0 01-12.324 0zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}
