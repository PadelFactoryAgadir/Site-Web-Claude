import { SITE, AGADIR, UNIVERSIAPOLIS, SOCIAL } from '@/lib/business-info';

/**
 * Données structurées JSON-LD pour le SEO local.
 *
 * Permet à Google de comprendre que Padel Factory est :
 *  - une entreprise locale (LocalBusiness)
 *  - un club sportif (SportsActivityLocation)
 *  - avec 2 adresses physiques
 *
 * Ce composant est rendu dans le <head> de chaque page via le layout.
 * Référence : https://schema.org/SportsActivityLocation
 */
export default function StructuredData({ locale }: { locale: string }) {
  // Organisation principale (chapeau qui regroupe les 2 clubs)
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: SITE.url,
    logo: `${SITE.url}/logo.png`,
    sameAs: [SOCIAL.instagram],
    foundingDate: SITE.foundingDate,
    address: {
      '@type': 'PostalAddress',
      streetAddress: AGADIR.address.street,
      addressLocality: AGADIR.address.locality,
      addressRegion: AGADIR.address.region,
      postalCode: AGADIR.address.postalCode,
      addressCountry: AGADIR.address.country,
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: AGADIR.phone,
      contactType: 'reservations',
      availableLanguage: ['French', 'English', 'Arabic'],
    },
  };

  // Club Agadir comme lieu d'activité sportive
  const agadirBusiness = {
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': `${SITE.url}/${locale}/${AGADIR.slug}`,
    name: AGADIR.name,
    url: `${SITE.url}/${locale}/${AGADIR.slug}`,
    image: `${SITE.url}/photos/agadir-hero.jpg`,
    telephone: AGADIR.phone,
    priceRange: `${AGADIR.pricing.offPeakPerPerson}–${AGADIR.pricing.peakPerPerson} ${AGADIR.pricing.currency}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: AGADIR.address.street,
      addressLocality: AGADIR.address.locality,
      addressRegion: AGADIR.address.region,
      postalCode: AGADIR.address.postalCode,
      addressCountry: AGADIR.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: AGADIR.geo.latitude,
      longitude: AGADIR.geo.longitude,
    },
    openingHoursSpecification: AGADIR.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: h.open,
      closes: h.close,
    })),
    sport: 'Padel',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: 'Parking', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Vestiaires', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Cafétéria', value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Shop', value: true },
      { '@type': 'LocationFeatureSpecification', name: `${AGADIR.courts} terrains`, value: true },
    ],
    sameAs: [SOCIAL.instagram],
  };

  // Club Universiapolis
  const universiapolisBusiness = {
    '@context': 'https://schema.org',
    '@type': ['SportsActivityLocation', 'LocalBusiness'],
    '@id': `${SITE.url}/${locale}/${UNIVERSIAPOLIS.slug}`,
    name: UNIVERSIAPOLIS.name,
    url: `${SITE.url}/${locale}/${UNIVERSIAPOLIS.slug}`,
    image: `${SITE.url}/photos/universiapolis-hero.jpg`,
    telephone: UNIVERSIAPOLIS.phone,
    priceRange: `${UNIVERSIAPOLIS.pricing.offPeakPerPerson}–${UNIVERSIAPOLIS.pricing.peakPerPerson} ${UNIVERSIAPOLIS.pricing.currency}`,
    address: {
      '@type': 'PostalAddress',
      streetAddress: UNIVERSIAPOLIS.address.street,
      addressLocality: UNIVERSIAPOLIS.address.locality,
      addressRegion: UNIVERSIAPOLIS.address.region,
      postalCode: UNIVERSIAPOLIS.address.postalCode,
      addressCountry: UNIVERSIAPOLIS.address.country,
    },
    geo: {
      '@type': 'GeoCoordinates',
      latitude: UNIVERSIAPOLIS.geo.latitude,
      longitude: UNIVERSIAPOLIS.geo.longitude,
    },
    openingHoursSpecification: UNIVERSIAPOLIS.openingHours.map((h) => ({
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
      opens: h.open,
      closes: h.close,
    })),
    sport: 'Padel',
    amenityFeature: [
      { '@type': 'LocationFeatureSpecification', name: `${UNIVERSIAPOLIS.courts} terrains`, value: true },
      { '@type': 'LocationFeatureSpecification', name: 'Vestiaires', value: true },
    ],
    sameAs: [SOCIAL.instagram],
  };

  // Site web (utile pour la "search box" Google)
  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE.name,
    url: SITE.url,
    inLanguage: locale,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(agadirBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(universiapolisBusiness) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
