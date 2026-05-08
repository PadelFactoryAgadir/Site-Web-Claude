'use client';

import {
  getSlotsForDate,
  isPeakDay,
  isSlotAvailable,
  type TimeSlot,
} from '@/lib/availability';

interface SlotPickerProps {
  date: Date;
  selectedSlotIndex: number | null;
  onSelect: (slot: TimeSlot) => void;
  accent: 'blue' | 'green';
}

/**
 * Affiche les créneaux disponibles pour une date donnée.
 * - Sépare visuellement les heures creuses des heures pleines
 * - Sur un jour férié ou un week-end : tous les créneaux sont en "heures pleines"
 * - Affiche le prix du terrain à côté du créneau
 */
export default function SlotPicker({
  date,
  selectedSlotIndex,
  onSelect,
  accent,
}: SlotPickerProps) {
  const slots = getSlotsForDate(date);
  const offPeak = slots.filter((s) => s.kind === 'off-peak');
  const peak = slots.filter((s) => s.kind === 'peak');
  const allPeak = isPeakDay(date);

  return (
    <div className="space-y-6">
      {!allPeak && offPeak.length > 0 && (
        <SlotGroup
          title="Heures creuses"
          subtitle="Du lundi au vendredi, hors jours fériés"
          color="white"
          slots={offPeak}
          date={date}
          selectedSlotIndex={selectedSlotIndex}
          onSelect={onSelect}
          accent={accent}
        />
      )}

      {peak.length > 0 && (
        <SlotGroup
          title="Heures pleines"
          subtitle={
            allPeak
              ? 'Week-end / jour férié — toute la journée'
              : 'En soirée'
          }
          color="lime"
          slots={peak}
          date={date}
          selectedSlotIndex={selectedSlotIndex}
          onSelect={onSelect}
          accent={accent}
        />
      )}
    </div>
  );
}

interface SlotGroupProps {
  title: string;
  subtitle: string;
  color: 'white' | 'lime';
  slots: TimeSlot[];
  date: Date;
  selectedSlotIndex: number | null;
  onSelect: (slot: TimeSlot) => void;
  accent: 'blue' | 'green';
}

function SlotGroup({
  title,
  subtitle,
  color,
  slots,
  date,
  selectedSlotIndex,
  onSelect,
  accent,
}: SlotGroupProps) {
  const titleColor = color === 'lime' ? 'text-brand-lime' : 'text-white';
  const dotColor = color === 'lime' ? 'bg-brand-lime' : 'bg-white';

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <div>
          <h4 className={`font-extrabold uppercase tracking-wider text-sm ${titleColor}`}>
            {title}
          </h4>
          <p className="text-xs text-white/50 mt-0.5">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {slots.map((slot) => {
          const available = isSlotAvailable(date, slot.index);
          const isSelected = selectedSlotIndex === slot.index;

          let buttonClasses =
            'p-4 rounded-xl border-2 text-left transition-all duration-200';
          if (!available) {
            buttonClasses +=
              ' border-white/10 bg-white/[0.02] text-white/30 cursor-not-allowed line-through';
          } else if (isSelected) {
            const selectedClasses =
              accent === 'blue'
                ? 'border-brand-blue bg-brand-blue/10'
                : 'border-brand-green bg-brand-green/10';
            buttonClasses += ` ${selectedClasses}`;
          } else {
            buttonClasses +=
              ' border-white/15 hover:border-white/40 hover:bg-white/5 cursor-pointer';
          }

          return (
            <button
              key={slot.index}
              type="button"
              onClick={() => available && onSelect(slot)}
              disabled={!available}
              className={buttonClasses}
            >
              <div className="font-mono text-base font-bold">
                {slot.start} - {slot.end}
              </div>
              <div className="text-xs text-white/60 mt-1">
                {slot.pricePerCourt} DHS / terrain
              </div>
              {!available && (
                <div className="text-[10px] uppercase tracking-widest text-white/40 mt-2">
                  Indisponible
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
