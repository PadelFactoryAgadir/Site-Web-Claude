/**
 * Source de vérité unique pour toutes les infos métier de Padel Factory.
 * Modifier ici met à jour automatiquement :
 *  - le footer
 *  - les pages contact / club
 *  - les données structurées SEO (JSON-LD)
 *  - les liens WhatsApp
 *  - le sitemap
 */

export const SITE = {
  name: 'Padel Factory',
  legalName: 'Padel Factory Agadir',
  domain: 'padelfactoryagadir.com',
  url: 'https://padelfactoryagadir.com',
  defaultLocale: 'fr',
  locales: ['fr', 'en'] as const,
  // Image qui s'affiche quand le lien est partagé sur WhatsApp / Facebook / Instagram
  ogImage: '/og-image.jpg',
  // Date de création du club (à confirmer avec Nacer)
  foundingDate: '2020',
} as const;

export const SOCIAL = {
  instagram: 'https://www.instagram.com/padelfactoryagadir/',
  instagramHandle: '@padelfactoryagadir',
} as const;

/**
 * Club principal : Padel Factory Agadir
 */
export const AGADIR = {
  name: 'Padel Factory Agadir',
  slug: 'agadir',
  shortName: 'Agadir',
  courts: 4,
  // Localisation
  address: {
    street: 'Avenue Kadi Ayad',
    locality: 'Agadir',
    region: 'Souss-Massa',
    postalCode: '80000', // à confirmer
    country: 'MA',
    countryName: 'Maroc',
  },
  // Repères proches (utile pour la page Contact)
  landmarks: [
    'Café BORJ',
    'Carrefour Market Cadi Ayad',
    'Sodisma Agadir',
    'Résidence Yasmina',
  ],
  // Coordonnées GPS approximatives (à affiner avec un lien Maps précis)
  geo: {
    latitude: 30.4202,
    longitude: -9.5982,
  },
  // Téléphone et WhatsApp (format international pour wa.me)
  phone: '+212 633 80 99 81',
  phoneHref: 'tel:+212633809981',
  whatsapp: '212633809981', // sans + ni espaces pour wa.me
  whatsappLink: 'https://wa.me/212633809981',
  // Horaires (PLACEHOLDER : à confirmer avec Nacer)
  openingHours: [
    { days: 'Lun-Dim', open: '09:30', close: '23:00' },
  ],
  // Tarifs (extraits de l'affiche officielle)
  pricing: {
    offPeakSlots: ['9h30 - 11h', '11h - 12h30', '12h30 - 14h', '14h - 15h30', '15h30 - 17h'],
    peakSlots: ['17h - 18h30', '18h30 - 20h', '20h - 21h30', '21h30 - 23h'],
    offPeakPerPerson: 75,
    offPeakPerCourt: 300,
    peakPerPerson: 100,
    peakPerCourt: 400,
    sessionPackage: { sessions: 10, price: 850, discount: 15 },
    racketRental: 20,
    currency: 'MAD',
    sessionDuration: '1h30',
  },
  brandColor: '#0001ff',
} as const;

/**
 * Club secondaire : Padel Factory Universiapolis
 */
export const UNIVERSIAPOLIS = {
  name: 'Padel Factory Universiapolis',
  slug: 'universiapolis',
  shortName: 'Universiapolis',
  courts: 3,
  address: {
    street: 'Campus Universiapolis', // à préciser
    locality: 'Agadir',
    region: 'Souss-Massa',
    postalCode: '80000', // à confirmer
    country: 'MA',
    countryName: 'Maroc',
  },
  landmarks: ['Université Internationale d\'Agadir Universiapolis'],
  geo: {
    latitude: 30.4150, // à affiner
    longitude: -9.5720, // à affiner
  },
  // Téléphone (PLACEHOLDER : à confirmer si différent du club principal)
  phone: '+212 633 80 99 81',
  phoneHref: 'tel:+212633809981',
  whatsapp: '212633809981',
  whatsappLink: 'https://wa.me/212633809981',
  openingHours: [
    { days: 'Lun-Dim', open: '09:30', close: '23:00' },
  ],
  pricing: {
    // Mêmes tarifs que Agadir par défaut, à ajuster si différent
    offPeakSlots: ['9h30 - 11h', '11h - 12h30', '12h30 - 14h', '14h - 15h30', '15h30 - 17h'],
    peakSlots: ['17h - 18h30', '18h30 - 20h', '20h - 21h30', '21h30 - 23h'],
    offPeakPerPerson: 75,
    offPeakPerCourt: 300,
    peakPerPerson: 100,
    peakPerCourt: 400,
    sessionPackage: { sessions: 10, price: 850, discount: 15 },
    racketRental: 20,
    currency: 'MAD',
    sessionDuration: '1h30',
  },
  brandColor: '#05DF72',
} as const;

export const CLUBS = [AGADIR, UNIVERSIAPOLIS] as const;
