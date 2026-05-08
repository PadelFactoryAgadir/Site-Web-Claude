'use client';

import { useState } from 'react';
import { isDayAvailable, isPeakDay, toIsoDate } from '@/lib/availability';

interface CalendarPickerProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  /** Couleur d'accent (selon le club) */
  accent: 'blue' | 'green';
}

const WEEKDAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];

/**
 * Calendrier mensuel pour choisir un jour de réservation.
 * - Affiche le mois complet
 * - Navigation prev/next mois
 * - Désactive les jours passés
 * - Marque visuellement les jours complets, dispos, week-end/fériés
 */
export default function CalendarPicker({
  selected,
  onSelect,
  accent,
}: CalendarPickerProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  // Calcule la grille du mois
  const firstDay = new Date(viewMonth);
  const lastDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);

  // Décalage du 1er jour (Lundi = 0 dans notre grille)
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  // Construit toutes les cellules du mois (avec cases vides au début)
  const cells: Array<{ date: Date | null; isPadding: boolean }> = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ date: null, isPadding: true });
  }
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    cells.push({ date, isPadding: false });
  }

  // Navigation
  const canGoPrev =
    viewMonth.getFullYear() > today.getFullYear() ||
    (viewMonth.getFullYear() === today.getFullYear() &&
      viewMonth.getMonth() > today.getMonth());

  const goPrev = () => {
    const next = new Date(viewMonth);
    next.setMonth(next.getMonth() - 1);
    setViewMonth(next);
  };
  const goNext = () => {
    const next = new Date(viewMonth);
    next.setMonth(next.getMonth() + 1);
    setViewMonth(next);
  };

  const accentBg = accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-green';
  const accentBorder = accent === 'blue' ? 'border-brand-blue' : 'border-brand-green';
  const accentText = accent === 'blue' ? 'text-brand-blue' : 'text-brand-green';

  return (
    <div className="card p-6 sm:p-8">
      {/* En-tête : mois + navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label="Mois précédent"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight">
          {MONTHS_FR[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </h3>

        <button
          type="button"
          onClick={goNext}
          className="w-10 h-10 rounded-full border border-white/15 flex items-center justify-center hover:bg-white/5 transition"
          aria-label="Mois suivant"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Grille des jours de la semaine */}
      <div className="grid grid-cols-7 gap-1 mb-2 text-center">
        {WEEKDAYS_FR.map((d, i) => (
          <div
            key={i}
            className="text-[10px] uppercase tracking-widest text-white/40 font-bold py-2"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grille des jours du mois */}
      <div className="grid grid-cols-7 gap-1">
        {cells.map((cell, idx) => {
          if (cell.isPadding || !cell.date) {
            return <div key={idx} aria-hidden="true" />;
          }

          const date = cell.date;
          const isPast = date.getTime() < today.getTime();
          const available = isDayAvailable(date);
          const peak = isPeakDay(date);
          const isSelected =
            selected && toIsoDate(selected) === toIsoDate(date);
          const isToday = toIsoDate(today) === toIsoDate(date);

          let stateClasses = '';
          if (isPast) {
            stateClasses = 'opacity-25 cursor-not-allowed';
          } else if (!available) {
            stateClasses = 'text-white/30 line-through cursor-not-allowed bg-white/[0.02]';
          } else if (isSelected) {
            stateClasses = `${accentBg} text-white font-bold shadow-lg ${
              accent === 'green' ? 'text-black' : ''
            }`;
          } else {
            stateClasses = `text-white hover:${accentBorder} hover:bg-white/5 cursor-pointer ${
              peak ? 'ring-1 ring-brand-lime/30' : ''
            }`;
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => available && !isPast && onSelect(date)}
              disabled={!available || isPast}
              className={`relative aspect-square rounded-lg border border-transparent text-sm font-semibold flex items-center justify-center transition-all ${stateClasses}`}
              aria-label={`${date.getDate()} ${MONTHS_FR[date.getMonth()]} ${
                available ? '(disponible)' : '(complet)'
              }`}
            >
              {date.getDate()}
              {/* Petit point pour aujourd'hui */}
              {isToday && !isSelected && (
                <span className={`absolute bottom-1 w-1 h-1 rounded-full ${accentBg}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Légende */}
      <div className="mt-6 pt-6 border-t border-white/10 grid grid-cols-2 gap-3 text-xs">
        <div className="flex items-center gap-2 text-white/60">
          <span className={`w-3 h-3 rounded ${accentBg}`} />
          Sélectionné
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <span className="w-3 h-3 rounded bg-white/10 line-through" />
          Complet
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <span className="w-3 h-3 rounded ring-1 ring-brand-lime/50" />
          Heures pleines (WE/férié)
        </div>
        <div className="flex items-center gap-2 text-white/60">
          <span className={`w-2 h-2 rounded-full ${accentBg}`} />
          Aujourd'hui
        </div>
      </div>
    </div>
  );
}
