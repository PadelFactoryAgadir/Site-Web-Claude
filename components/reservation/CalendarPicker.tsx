'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { isDayAvailable, isPeakDay, toIsoDate } from '@/lib/availability';

interface CalendarPickerProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  accent: 'blue' | 'green';
}

const WEEKDAYS_FR = ['L', 'M', 'M', 'J', 'V', 'S', 'D'];
const WEEKDAYS_EN = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
const MONTHS_FR = [
  'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
  'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre',
];
const MONTHS_EN = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

/**
 * Calendrier mensuel compact pour choisir un jour de réservation.
 */
export default function CalendarPicker({
  selected,
  onSelect,
  accent,
}: CalendarPickerProps) {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const weekdays = isFr ? WEEKDAYS_FR : WEEKDAYS_EN;
  const months = isFr ? MONTHS_FR : MONTHS_EN;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const firstDay = new Date(viewMonth);
  const lastDay = new Date(viewMonth.getFullYear(), viewMonth.getMonth() + 1, 0);
  const firstWeekday = (firstDay.getDay() + 6) % 7;
  const totalDays = lastDay.getDate();

  const cells: Array<{ date: Date | null; isPadding: boolean }> = [];
  for (let i = 0; i < firstWeekday; i++) {
    cells.push({ date: null, isPadding: true });
  }
  for (let day = 1; day <= totalDays; day++) {
    const date = new Date(viewMonth.getFullYear(), viewMonth.getMonth(), day);
    cells.push({ date, isPadding: false });
  }

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
  const selectedTextColor = accent === 'green' ? 'text-black' : 'text-white';

  return (
    <div>
      {/* En-tête : mois + navigation */}
      <div className="flex items-center justify-between mb-3">
        <button
          type="button"
          onClick={goPrev}
          disabled={!canGoPrev}
          className="w-7 h-7 rounded-md border border-white/15 flex items-center justify-center hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition"
          aria-label={isFr ? 'Mois précédent' : 'Previous month'}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <h3 className="text-sm font-extrabold uppercase tracking-tight">
          {months[viewMonth.getMonth()]} {viewMonth.getFullYear()}
        </h3>

        <button
          type="button"
          onClick={goNext}
          className="w-7 h-7 rounded-md border border-white/15 flex items-center justify-center hover:bg-white/5 transition"
          aria-label={isFr ? 'Mois suivant' : 'Next month'}
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* En-têtes des jours */}
      <div className="grid grid-cols-7 gap-1 mb-1.5 text-center">
        {weekdays.map((d, i) => (
          <div
            key={i}
            className="text-[9px] uppercase tracking-widest text-white/40 font-bold py-1"
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grille des jours */}
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
            stateClasses = 'text-white/30 line-through cursor-not-allowed';
          } else if (isSelected) {
            stateClasses = `${accentBg} ${selectedTextColor} font-bold shadow-lg`;
          } else {
            stateClasses = `text-white hover:${accentBorder} hover:bg-white/5 cursor-pointer ${
              peak ? 'ring-1 ring-brand-lime/40' : ''
            }`;
          }

          return (
            <button
              key={idx}
              type="button"
              onClick={() => available && !isPast && onSelect(date)}
              disabled={!available || isPast}
              className={`relative aspect-square rounded-md border border-transparent text-xs font-semibold flex items-center justify-center transition-all ${stateClasses}`}
              aria-label={`${date.getDate()} ${months[date.getMonth()]}`}
            >
              {date.getDate()}
              {isToday && !isSelected && (
                <span className={`absolute bottom-0.5 w-1 h-1 rounded-full ${accentBg}`} />
              )}
            </button>
          );
        })}
      </div>

      {/* Légende compacte */}
      <div className="mt-4 pt-3 border-t border-white/10 space-y-1.5 text-[10px]">
        <div className="flex items-center gap-2 text-white/50">
          <span className={`w-2.5 h-2.5 rounded-sm ${accentBg}`} />
          {isFr ? 'Sélectionné' : 'Selected'}
        </div>
        <div className="flex items-center gap-2 text-white/50">
          <span className="w-2.5 h-2.5 rounded-sm ring-1 ring-brand-lime/50" />
          {isFr ? 'Heures pleines (WE/férié)' : 'Peak hours (weekend/holiday)'}
        </div>
        <div className="flex items-center gap-2 text-white/50">
          <span className="w-2.5 h-2.5 rounded-sm bg-white/5 line-through" />
          {isFr ? 'Complet' : 'Fully booked'}
        </div>
      </div>
    </div>
  );
}
