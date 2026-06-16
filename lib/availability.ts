/**
 * Logique de disponibilité des créneaux et terrains.
 *
 * Les disponibilités sont récupérées en temps réel depuis les APIs ERP :
 *  - Agadir      : https://padelcenter.site/api/availability
 *  - Universiapolis : https://univ.padelcenter.site/api/availability
 *
 * Les tarifs et la logique heures pleines/creuses restent gérés côté site.
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
 * Liste des jours fériés au Maroc.
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

// URLs des 2 endpoints ERP
const API_URLS: Record<string, string> = {
  agadir: 'https://padelcenter.site/api/availability',
  universiapolis: 'https://univ.padelcenter.site/api/availability',
};

// Type de la réponse API — exporté pour les composants
export interface ApiSlot {
  start: string;
  end: string;
  availableCourts: number[];
}

export interface ApiDay {
  date: string;
  slots: ApiSlot[];
}

export interface ApiResponse {
  club: string;
  totalCourts: number;
  days: ApiDay[];
  generatedAt: string;
}

// Alias pour clarté dans les composants
export type ApiAvailability = ApiResponse;

// Cache en mémoire pour éviter trop d'appels API (30 secondes)
const cache: Record<string, { data: ApiResponse; fetchedAt: number }> = {};
const CACHE_TTL_MS = 30_000;

/**
 * Récupère les disponibilités depuis l'API ERP pour un club donné.
 * Utilise un cache de 30 secondes pour absorber les pics de trafic.
 */
export async function fetchAvailability(clubSlug: string): Promise<ApiResponse | null> {
  const url = API_URLS[clubSlug];
  if (!url) return null;

  const now = Date.now();
  const cached = cache[clubSlug];
  if (cached && now - cached.fetchedAt < CACHE_TTL_MS) {
    return cached.data;
  }

  try {
    const res = await fetch(url, {
      headers: { Accept: 'application/json' },
      next: { revalidate: 30 },
    });
    if (!res.ok) return null;
    const data: ApiResponse = await res.json();
    cache[clubSlug] = { data, fetchedAt: now };
    return data;
  } catch {
    return null;
  }
}

// ============================================================================
// Fonctions utilitaires (date, jours fériés, peak day)
// ============================================================================

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
 * (avec tarifs, sans tenir compte des disponibilités).
 */
export function getSlotsForDate(date: Date): TimeSlot[] {
  return isPeakDay(date) ? PEAK_DAY_SLOTS : WEEKDAY_SLOTS;
}

// ============================================================================
// Fonctions de disponibilité — basées sur les données API
// ============================================================================

/**
 * Renvoie true si au moins un créneau est disponible sur ce jour
 * selon les données API. Renvoie false si le jour est passé ou si
 * tous les créneaux sont complets.
 */
export function isDayAvailableFromApi(
  apiData: ApiResponse,
  date: Date
): boolean {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  if (target.getTime() < today.getTime()) return false;

  const dateStr = toIsoDate(date);
  const day = apiData.days.find((d) => d.date === dateStr);
  if (!day) return false;

  return day.slots.some((s) => s.availableCourts.length > 0);
}

/**
 * Renvoie true si le créneau a au moins un terrain disponible.
 */
export function isSlotAvailableFromApi(
  apiData: ApiResponse,
  date: Date,
  slotIndex: number
): boolean {
  const dateStr = toIsoDate(date);
  const day = apiData.days.find((d) => d.date === dateStr);
  if (!day) return false;

  const slot = day.slots[slotIndex];
  if (!slot) return false;

  return slot.availableCourts.length > 0;
}

/**
 * Renvoie la liste des terrains avec leur disponibilité pour un créneau donné.
 */
export function getCourtsForSlotFromApi(
  apiData: ApiResponse,
  date: Date,
  slotIndex: number,
  totalCourts: number
): { number: number; available: boolean }[] {
  const dateStr = toIsoDate(date);
  const day = apiData.days.find((d) => d.date === dateStr);
  const slot = day?.slots[slotIndex];

  const availableCourts = slot?.availableCourts ?? [];

  return Array.from({ length: totalCourts }, (_, i) => ({
    number: i + 1,
    available: availableCourts.includes(i + 1),
  }));
}

// ============================================================================
// Fonctions de fallback (si l'API est indisponible)
// ============================================================================

function startOfDay(d: Date): Date {
  const x = new Date(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function isDayAvailable(date: Date): boolean {
  const today = startOfDay(new Date());
  const target = startOfDay(date);
  if (target.getTime() < today.getTime()) return false;
  return target.getDate() % 2 === 0;
}

export function isSlotAvailable(date: Date, slotIndex: number): boolean {
  if (!isDayAvailable(date)) return false;
  const seed = date.getDate() + slotIndex;
  return seed % 2 === 0;
}

export function isCourtAvailable(
  date: Date,
  slotIndex: number,
  courtNumber: number
): boolean {
  if (!isSlotAvailable(date, slotIndex)) return false;
  const seed = date.getDate() + slotIndex + courtNumber;
  return seed % 2 === 0;
}

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
