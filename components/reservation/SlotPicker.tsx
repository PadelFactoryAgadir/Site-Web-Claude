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
 * Compact, optimisé pour une colonne étroite.
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
    <div className="space-y-5">
      {!allPeak && offPeak.length > 0 && (
        <SlotGroup
          title="Heures creuses"
          subtitle="Lun-Ven hors fériés"
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
          subtitle={allPeak ? 'WE / férié' : 'En soirée'}
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
      <div className="flex items-center gap-2 mb-3">
        <span className={`w-2 h-2 rounded-full ${dotColor}`} />
        <div>
          <h4 className={`font-extrabold uppercase tracking-wider text-xs ${titleColor}`}>
            {title}
          </h4>
          <p className="text-[10px] text-white/50">{subtitle}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {slots.map((slot) => {
          const available = isSlotAvailable(date, slot.index);
          const isSelected = selectedSlotIndex === slot.index;

          let buttonClasses =
            'p-3 rounded-lg border-2 text-left transition-all duration-200';
          if (!available) {
            buttonClasses +=
              ' border-white/10 bg-white/[0.02] text-white/30 cursor-not-allowed';
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
              <div className={`font-mono text-sm font-bold ${!available ? 'line-through' : ''}`}>
                {slot.start}—{slot.end}
              </div>
              <div className="text-[10px] text-white/60 mt-0.5">
                {available ? `${slot.pricePerCourt} DHS` : 'Indispo'}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
