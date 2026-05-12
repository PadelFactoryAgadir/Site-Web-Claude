'use client';

import { useLocale } from 'next-intl';
import { getCourtsForSlot } from '@/lib/availability';

interface CourtPickerProps {
  date: Date;
  slotIndex: number;
  totalCourts: number;
  selectedCourt: number | null;
  onSelect: (courtNumber: number) => void;
  accent: 'blue' | 'green';
}

export default function CourtPicker({
  date,
  slotIndex,
  totalCourts,
  selectedCourt,
  onSelect,
  accent,
}: CourtPickerProps) {
  const locale = useLocale();
  const isFr = locale === 'fr';
  const courts = getCourtsForSlot(date, slotIndex, totalCourts);

  return (
    <div className="grid grid-cols-2 gap-3">
      {courts.map((court) => {
        const isSelected = selectedCourt === court.number;

        let classes =
          'aspect-square rounded-xl border-2 flex flex-col items-center justify-center transition-all duration-200 p-2';
        if (!court.available) {
          classes +=
            ' border-white/10 bg-white/[0.02] text-white/30 cursor-not-allowed';
        } else if (isSelected) {
          const sel =
            accent === 'blue'
              ? 'border-brand-blue bg-brand-blue/10'
              : 'border-brand-green bg-brand-green/10';
          classes += ` ${sel}`;
        } else {
          classes +=
            ' border-white/15 hover:border-white/40 hover:bg-white/5 cursor-pointer';
        }

        return (
          <button
            key={court.number}
            type="button"
            onClick={() => court.available && onSelect(court.number)}
            disabled={!court.available}
            className={classes}
          >
            <CourtIcon className={court.available ? 'text-white' : 'text-white/30'} />
            <div className="text-sm font-extrabold mt-1.5">
              Court {court.number}
            </div>
            <div className="text-[9px] uppercase tracking-widest text-white/50 mt-0.5">
              {court.available
                ? isFr
                  ? 'Disponible'
                  : 'Available'
                : isFr
                ? 'Pris'
                : 'Taken'}
            </div>
          </button>
        );
      })}
    </div>
  );
}

function CourtIcon({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`w-6 h-6 ${className}`}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <rect x="3" y="5" width="18" height="14" rx="1" />
      <line x1="12" y1="5" x2="12" y2="19" strokeDasharray="2 1" />
      <line x1="3" y1="9" x2="21" y2="9" strokeOpacity="0.5" />
      <line x1="3" y1="15" x2="21" y2="15" strokeOpacity="0.5" />
    </svg>
  );
}
