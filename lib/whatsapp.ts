/**
 * Construction du message WhatsApp envoyé au club après réservation.
 */

import type { TimeSlot } from './availability';

export interface ReservationDraft {
  clubName: string;
  whatsappNumber: string; // sans + ni espaces, ex: "212633809981"
  date: Date;
  slot: TimeSlot;
  courtNumber: number;
  rackets: number;
  rentalPricePerRacket: number;
  // Contact
  firstName: string;
  lastName: string;
  phonePrefix: string; // ex: "+212"
  phoneNumber: string;
  email: string;
}

export interface PriceBreakdown {
  court: number;
  rackets: number;
  total: number;
}

export function calculatePrice(d: ReservationDraft): PriceBreakdown {
  const court = d.slot.pricePerCourt;
  const rackets = d.rackets * d.rentalPricePerRacket;
  return { court, rackets, total: court + rackets };
}

function formatDate(date: Date, locale: 'fr' | 'en' = 'fr'): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

/**
 * Construit le texte du message WhatsApp à envoyer au club.
 */
export function buildWhatsappMessage(
  d: ReservationDraft,
  locale: 'fr' | 'en' = 'fr'
): string {
  const price = calculatePrice(d);
  const dateStr = formatDate(d.date, locale);
  const fullPhone = `${d.phonePrefix} ${d.phoneNumber}`;

  if (locale === 'en') {
    return [
      'Padel Court Booking Request',
      `Club: ${d.clubName}`,
      `Date: ${dateStr}`,
      `Time: ${d.slot.start} - ${d.slot.end}`,
      `Court: Court ${d.courtNumber}`,
      `Players: 4`,
      '',
      'Pricing:',
      `Court: ${price.court} DHS`,
      d.rackets > 0
        ? `Rackets (${d.rackets}): ${price.rackets} DHS`
        : `Rackets: 0`,
      `Total: ${price.total} DHS`,
      '',
      'Contact:',
      `Name: ${d.firstName} ${d.lastName}`,
      `Phone: ${fullPhone}`,
      `Email: ${d.email}`,
      '',
      'Please confirm my booking.',
    ].join('\n');
  }

  return [
    'Demande de réservation Padel',
    `Club : ${d.clubName}`,
    `Date : ${dateStr}`,
    `Créneau : ${d.slot.start} - ${d.slot.end}`,
    `Terrain : Court ${d.courtNumber}`,
    `Joueurs : 4`,
    '',
    'Tarif :',
    `Terrain : ${price.court} DHS`,
    d.rackets > 0
      ? `Raquettes (${d.rackets}) : ${price.rackets} DHS`
      : `Raquettes : 0`,
    `Total : ${price.total} DHS`,
    '',
    'Contact :',
    `Nom : ${d.firstName} ${d.lastName}`,
    `Téléphone : ${fullPhone}`,
    `Email : ${d.email}`,
    '',
    'Merci de bien vouloir confirmer ma réservation.',
  ].join('\n');
}

/**
 * Construit le lien wa.me pour ouvrir WhatsApp avec le message pré-rempli.
 */
export function buildWhatsappLink(
  d: ReservationDraft,
  locale: 'fr' | 'en' = 'fr'
): string {
  const message = buildWhatsappMessage(d, locale);
  return `https://wa.me/${d.whatsappNumber}?text=${encodeURIComponent(message)}`;
}
