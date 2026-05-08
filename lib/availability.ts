/**
 * Logique de disponibilité des créneaux et terrains.
 *
 * EN ATTENDANT L'API ERP :
 * Tout est mocké de façon déterministe.
 * Règles de mock :
 *  - 1 jour sur 2 est "complet" (rien de disponible)
 *  - 1 créneau sur 2 est pris (sur les jours dispo)
 *  - 1 terrain sur 2 est pris (sur les créneaux dispo)
 *
 * Quand l'API ERP sera prête, on remplace simplement le contenu de ce fichier
 * par des appels HTTP — les composants UI n'auront pas à changer.
 */

import { AGADIR } from './business-info';

export type SlotKind = 'off-peak' | 'peak';

export interface TimeSlot {
  /** Index unique pour identifier le créneau dans la journée */
  index: number;
  /** Heure de début, format "09:30" */
  start: string;
  /** Heure de fin, format "11:00" */
  end: string;
  /** Type tarifaire */
  kind: SlotKind;
  /** Prix du terrain en DHS pour ce créneau */
  pricePerCourt: number;
}

// Créneaux d'un jour de semaine standard (Lun-Ven, hors jours fériés)
const WEEKDAY_SLOTS: TimeSlot[] = [
  { index: 0, start: '09:30', end: '11:00', kind: 'off-peak', pricePerCourt: AGADIR.pricing.offPeakPerCourt },
  { index: 1, start: '11:00', end: '12:30', kind: 'off-peak', pricePerCourt: AGADIR.pricing.offPeakPerCourt },
  { index: 2, start: '12:30', end: '14:00', kind: 'off-peak', pricePerCourt: AGADIR.pricing.offPeakPerCourt },
  { index: 3, start: '14:00', end: '15:30', kind: 'off-peak', pricePerCourt: AGADIR.pricing.offPeakPerCourt },
  { index: 4, start: '15:30', end: '17:00', kind: 'off-peak', pricePerCourt: AGADIR.pricing.offPeakPerCourt },
  { index: 5, start: '17:00', end: '18:30', kind: 'peak', pricePerCourt: AGADIR.pricing.peakPerCourt },
  { index: 6, start: '18:30', end: '20:00', kind: 'peak', pricePerCourt: AGADIR.pricing.peakPerCourt },
  { index: 7, start: '20:00', end: '21:30', kind: 'peak', pricePerCourt: AGADIR.pricing.peakPerCourt },
  { index: 8, start: '21:30', end: '23:00', kind: 'peak', pricePerCourt: AGADIR.pricing.peakPerCourt },
];

// Créneaux d'un jour "peak" (week-end ou férié) : TOUT en heures pleines
const PEAK_DAY_SLOTS: TimeSlot[] = WEEKDAY_SLOTS.map((s) => ({
  ...s,
  kind: 'peak',
  pricePerCourt: AGADIR.pricing.peakPerCourt,
}));

/**
 * Liste des jours fériés au Maroc (à compléter).
 * Format : 'YYYY-MM-DD'.
 */
const MOROCCAN_HOLIDAYS: string[] = [
  // 2026
  '2026-01-01', // Jour de l'an
  '2026-01-11', // Manifeste de l'indépendance
  '2026-05-01', // Fête du travail
  '2026-07-30', // Fête du Trône
  '2026-08-14', // Journée Oued Ed-Dahab
  '2026-08-20', // Révolution du Roi et du Peuple
  '2026-08-21', // Fête de la Jeunesse
  '2026-11-06', // Marche Verte
  '2026-11-18', // Fête de l'Indépendance
];

export function toIsoDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function isHoliday(date: Date): boolean {
  return MOROCCAN_HOLIDAYS.includes(toIsoDate(date));
}

export function isWeekend(date: Date): boolean {
  const day = date.getDay();
  return day === 0 || day === 6;
}

export function isPeakDay(date: Date): boolean {
  return isWeekend(date) || isHoliday(date);
}

/**
 * Renvoie la liste de TOUS les créneaux possibles pour une date donnée
 * (sans tenir compte des disponibilités).
 */
export function getSlotsForDate(date: Date): TimeSlot[] {
  return isPeakDay(date) ? PEAK_DAY_SLOTS : WEEKDAY_SLOTS;
}

// ============================================================================
// MOCK : disponibilité
// ============================================================================

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

/**
 * Renvoie true si le jour est "ouvert" à la réservation.
 * Mock : 1 jour sur 2 est complet (alterne avec le jour de la date).
 */
export function isDayAvailable(date: Date): boolean {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  // Pas de réservation dans le passé
  if (target.getTime() < today.getTime()) return false;
  // Mock : alternance par jour du mois
  return target.getDate() % 2 === 0;
}

/**
 * Renvoie true si le créneau est libre (assez de terrains pour qu'au moins un soit dispo).
 * Mock : 1 créneau sur 2 est pris.
 */
export function isSlotAvailable(date: Date, slotIndex: number): boolean {
  if (!isDayAvailable(date)) return false;
  const seed = date.getDate() + slotIndex;
  return seed % 2 === 0;
}

/**
 * Renvoie true si un terrain spécifique est libre sur ce créneau.
 * Mock : 1 terrain sur 2 est pris.
 */
export function isCourtAvailable(
  date: Date,
  slotIndex: number,
  courtNumber: number
): boolean {
  if (!isSlotAvailable(date, slotIndex)) return false;
  const seed = date.getDate() + slotIndex + courtNumber;
  return seed % 2 === 0;
}

/**
 * Renvoie la liste des terrains avec leur disponibilité.
 */
export function getCourtsForSlot(
  date: Date,
  slotIndex: number,
  totalCourts: number
): { number: number; available: boolean }[] {
  return Array.from({ length: totalCourts }, (_, i) => ({
    number: i + 1,
    available: isCourtAvailable(date, slotIndex, i + 1),
  }));
}
