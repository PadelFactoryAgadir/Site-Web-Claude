'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import CalendarPicker from './CalendarPicker';
import SlotPicker from './SlotPicker';
import CourtPicker from './CourtPicker';
import {
  buildWhatsappLink,
  buildWhatsappMessage,
  calculatePrice,
  type ReservationDraft,
} from '@/lib/whatsapp';
import type { TimeSlot } from '@/lib/availability';

interface ReservationFlowProps {
  clubName: string;
  totalCourts: number;
  whatsappNumber: string;
  rentalPricePerRacket: number;
  accent: 'blue' | 'green';
}

/**
 * Wizard de réservation en disposition 3 colonnes (desktop).
 * Sur mobile : empilement vertical.
 *
 *   ┌─────────────┬──────────────┬──────────────┐
 *   │ 1. Date     │ 2. Créneau   │ 3. Terrain   │
 *   │ (calendrier │ (slots si    │ (courts si   │
 *   │  compact)   │  date choisie│  slot choisi)│
 *   └─────────────┴──────────────┴──────────────┘
 *               ↓ (quand tout est choisi)
 *   ┌──────────────────────────────────────────┐
 *   │ 4. Récap + Coordonnées + Envoi WhatsApp │
 *   └──────────────────────────────────────────┘
 */
export default function ReservationFlow({
  clubName,
  totalCourts,
  whatsappNumber,
  rentalPricePerRacket,
  accent,
}: ReservationFlowProps) {
  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [court, setCourt] = useState<number | null>(null);
  const [rackets, setRackets] = useState(0);

  // Contact
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+212');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  // État final
  const [sent, setSent] = useState(false);

  // Réf vers le bas pour scroller automatiquement quand le récap apparaît
  const summaryRef = useRef<HTMLDivElement | null>(null);

  // Quand la date change, on reset le créneau et le terrain
  const handleDateChange = (d: Date) => {
    setDate(d);
    setSlot(null);
    setCourt(null);
  };
  const handleSlotChange = (s: TimeSlot) => {
    setSlot(s);
    setCourt(null);
  };
  const handleCourtChange = (n: number) => {
    setCourt(n);
  };

  // Quand un terrain est choisi, scroller en douceur jusqu'au récap
  useEffect(() => {
    if (court !== null && summaryRef.current) {
      summaryRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [court]);

  const draft: ReservationDraft | null = useMemo(() => {
    if (!date || !slot || !court) return null;
    return {
      clubName,
      whatsappNumber,
      date,
      slot,
      courtNumber: court,
      rackets,
      rentalPricePerRacket,
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      phonePrefix,
      phoneNumber: phoneNumber.trim(),
      email: email.trim(),
    };
  }, [
    date, slot, court, rackets,
    clubName, whatsappNumber, rentalPricePerRacket,
    firstName, lastName, phonePrefix, phoneNumber, email,
  ]);

  const isContactComplete =
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    phoneNumber.trim().length >= 6 &&
    email.includes('@');

  const canSend = draft !== null && isContactComplete;

  const handleSend = () => {
    if (!draft || !canSend) return;
    const link = buildWhatsappLink(draft, 'fr');
    window.open(link, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  if (sent) {
    return (
      <SentConfirmation
        onReset={() => {
          setSent(false);
          setDate(null);
          setSlot(null);
          setCourt(null);
          setRackets(0);
        }}
      />
    );
  }

  return (
    <div>
      {/* TROIS COLONNES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Colonne 1 : Date */}
        <Column step={1} title="Date" filled={!!date} accent={accent}>
          <CalendarPicker selected={date} onSelect={handleDateChange} accent={accent} />
        </Column>

        {/* Colonne 2 : Créneau */}
        <Column
          step={2}
          title="Créneau"
          filled={!!slot}
          accent={accent}
          info={date ? formatDateShort(date) : null}
          disabled={!date}
        >
          {date ? (
            <SlotPicker
              date={date}
              selectedSlotIndex={slot?.index ?? null}
              onSelect={handleSlotChange}
              accent={accent}
            />
          ) : (
            <EmptyState
              icon="📅"
              text="Sélectionnez d'abord une date dans le calendrier"
            />
          )}
        </Column>

        {/* Colonne 3 : Terrain */}
        <Column
          step={3}
          title="Terrain"
          filled={court !== null}
          accent={accent}
          info={
            date && slot
              ? `${formatDateShort(date)} · ${slot.start}—${slot.end}`
              : null
          }
          disabled={!slot}
        >
          {date && slot ? (
            <CourtPicker
              date={date}
              slotIndex={slot.index}
              totalCourts={totalCourts}
              selectedCourt={court}
              onSelect={handleCourtChange}
              accent={accent}
            />
          ) : (
            <EmptyState
              icon="🎾"
              text="Sélectionnez d'abord un créneau"
            />
          )}
        </Column>
      </div>

      {/* SECTION DU BAS : récap + raquettes + formulaire + envoi */}
      {draft && (
        <div ref={summaryRef} className="mt-12 scroll-mt-24 animate-slide-up">
          <BottomFlow
            draft={draft}
            rackets={rackets}
            setRackets={setRackets}
            rentalPricePerRacket={rentalPricePerRacket}
            firstName={firstName}
            setFirstName={setFirstName}
            lastName={lastName}
            setLastName={setLastName}
            phonePrefix={phonePrefix}
            setPhonePrefix={setPhonePrefix}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            email={email}
            setEmail={setEmail}
            accent={accent}
            canSend={canSend}
            onSend={handleSend}
          />
        </div>
      )}
    </div>
  );
}

// ============================================================================
// COMPOSANTS UTILITAIRES
// ============================================================================

function Column({
  step,
  title,
  filled,
  accent,
  info,
  disabled = false,
  children,
}: {
  step: number;
  title: string;
  filled: boolean;
  accent: 'blue' | 'green';
  info?: string | null;
  disabled?: boolean;
  children: React.ReactNode;
}) {
  const accentBg = accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-green';
  const accentText = accent === 'green' ? 'text-black' : 'text-white';

  return (
    <div
      className={`card p-5 transition-opacity ${disabled ? 'opacity-50' : ''}`}
    >
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
            filled ? `${accentBg} ${accentText}` : 'bg-white/10 text-white/60'
          }`}
        >
          {filled ? '✓' : step}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold uppercase tracking-tight">
            {title}
          </h3>
          {info && (
            <p className="text-[11px] text-white/60 truncate mt-0.5">{info}</p>
          )}
        </div>
      </div>
      <div>{children}</div>
    </div>
  );
}

function EmptyState({ icon, text }: { icon: string; text: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-3xl opacity-30 mb-3">{icon}</div>
      <p className="text-xs text-white/40 max-w-[180px] leading-relaxed">{text}</p>
    </div>
  );
}

function formatDateShort(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
  }).format(date);
}

function formatDateLong(date: Date): string {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

// ============================================================================
// SECTION DU BAS (récap + raquettes + form + envoi)
// ============================================================================

interface BottomFlowProps {
  draft: ReservationDraft;
  rackets: number;
  setRackets: (n: number) => void;
  rentalPricePerRacket: number;
  firstName: string;
  setFirstName: (v: string) => void;
  lastName: string;
  setLastName: (v: string) => void;
  phonePrefix: string;
  setPhonePrefix: (v: string) => void;
  phoneNumber: string;
  setPhoneNumber: (v: string) => void;
  email: string;
  setEmail: (v: string) => void;
  accent: 'blue' | 'green';
  canSend: boolean;
  onSend: () => void;
}

function BottomFlow(props: BottomFlowProps) {
  const {
    draft,
    rackets,
    setRackets,
    rentalPricePerRacket,
    firstName,
    setFirstName,
    lastName,
    setLastName,
    phonePrefix,
    setPhonePrefix,
    phoneNumber,
    setPhoneNumber,
    email,
    setEmail,
    accent,
    canSend,
    onSend,
  } = props;

  const price = calculatePrice(draft);
  const message = buildWhatsappMessage(draft, 'fr');
  const accentBg = accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-green';
  const accentTextSel = accent === 'green' ? 'text-black' : 'text-white';

  return (
    <div className="space-y-6">
      {/* Récap haut : ce qu'on a sélectionné */}
      <div className={`card p-6 border-l-4 ${accent === 'blue' ? 'border-l-brand-blue' : 'border-l-brand-green'}`}>
        <p className="text-xs font-bold uppercase tracking-[0.3em] text-brand-lime mb-3">
          Votre sélection
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RecapItem label="Date" value={formatDateLong(draft.date)} />
          <RecapItem label="Créneau" value={`${draft.slot.start} - ${draft.slot.end}`} />
          <RecapItem label="Terrain" value={`Court ${draft.courtNumber}`} />
        </div>
      </div>

      {/* Raquettes + Contact côte à côte */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Raquettes */}
        <div className="card p-6">
          <h4 className="font-extrabold uppercase tracking-wider text-sm mb-2">
            Location de raquettes
          </h4>
          <p className="text-xs text-white/60 mb-4">
            Combien de raquettes ? ({rentalPricePerRacket} DHS l'unité)
          </p>
          <div className="grid grid-cols-5 gap-2">
            {[0, 1, 2, 3, 4].map((n) => (
              <button
                key={n}
                type="button"
                onClick={() => setRackets(n)}
                className={`py-3 rounded-lg border-2 font-extrabold text-base transition ${
                  rackets === n
                    ? `${accentBg} ${accentTextSel} border-transparent`
                    : 'border-white/15 hover:border-white/40 text-white'
                }`}
              >
                {n}
              </button>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div className="card p-6">
          <h4 className="font-extrabold uppercase tracking-wider text-sm mb-4">
            Vos coordonnées
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Field
                label="Prénom"
                value={firstName}
                onChange={setFirstName}
                placeholder="Nacer"
                required
              />
              <Field
                label="Nom"
                value={lastName}
                onChange={setLastName}
                placeholder="Benzekri"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1.5">
                Téléphone *
              </label>
              <div className="flex gap-2">
                <select
                  value={phonePrefix}
                  onChange={(e) => setPhonePrefix(e.target.value)}
                  className="bg-black border border-white/15 rounded-lg px-2 py-2.5 text-white text-sm focus:border-white/50 focus:outline-none transition"
                  aria-label="Indicatif"
                >
                  <option value="+212">🇲🇦 +212</option>
                  <option value="+33">🇫🇷 +33</option>
                  <option value="+34">🇪🇸 +34</option>
                  <option value="+44">🇬🇧 +44</option>
                  <option value="+1">🇺🇸 +1</option>
                  <option value="+971">🇦🇪 +971</option>
                  <option value="+966">🇸🇦 +966</option>
                  <option value="+49">🇩🇪 +49</option>
                  <option value="+39">🇮🇹 +39</option>
                  <option value="+32">🇧🇪 +32</option>
                  <option value="+31">🇳🇱 +31</option>
                  <option value="+41">🇨🇭 +41</option>
                </select>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="6XX XX XX XX"
                  className="flex-1 bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-white/50 focus:outline-none transition"
                  required
                />
              </div>
            </div>

            <Field
              label="Email"
              type="email"
              value={email}
              onChange={setEmail}
              placeholder="exemple@email.com"
              required
            />
          </div>
        </div>
      </div>

      {/* Estimation de prix */}
      <div className="card p-6">
        <h4 className="font-extrabold uppercase tracking-wider text-sm text-brand-lime mb-4">
          Estimation tarifaire
        </h4>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between text-white/80">
            <span>Terrain ({draft.slot.start} - {draft.slot.end})</span>
            <span className="font-bold">{price.court} DHS</span>
          </div>
          {draft.rackets > 0 && (
            <div className="flex justify-between text-white/80">
              <span>Raquettes × {draft.rackets}</span>
              <span className="font-bold">{price.rackets} DHS</span>
            </div>
          )}
          <div className="h-px bg-white/10 my-3" />
          <div className="flex justify-between text-xl">
            <span className="font-bold">Total</span>
            <span className={`font-black ${accent === 'blue' ? 'text-brand-blue' : 'text-brand-green'}`}>
              {price.total} DHS
            </span>
          </div>
        </div>
      </div>

      {/* Aperçu du message */}
      <div className="card p-6">
        <h4 className="font-extrabold uppercase tracking-wider text-sm mb-3">
          Aperçu du message envoyé
        </h4>
        <p className="text-xs text-white/50 mb-4">
          Voici le message qui sera envoyé au club par WhatsApp.
        </p>
        <pre className="bg-black/50 border border-white/10 rounded-lg p-4 text-xs text-white/80 whitespace-pre-wrap font-mono leading-relaxed overflow-auto">
          {message}
        </pre>
      </div>

      {/* AVERTISSEMENT */}
      <div className="rounded-2xl border-2 border-brand-lime bg-brand-lime/10 p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-brand-lime text-black flex items-center justify-center flex-shrink-0 font-black text-xl">
            !
          </div>
          <div>
            <h4 className="font-extrabold uppercase tracking-wider text-brand-lime mb-2">
              Important — à lire avant d'envoyer
            </h4>
            <p className="text-sm text-white leading-relaxed">
              Votre demande sera envoyée par WhatsApp. <strong>Votre réservation
              n'est PAS confirmée tant que le club ne vous a pas explicitement
              répondu</strong> par message pour valider votre créneau et votre terrain.
            </p>
            <p className="text-sm text-white/80 leading-relaxed mt-3">
              Pensez à <strong>bien attendre la réponse du club</strong>. Sans
              cette confirmation, votre créneau peut être attribué à un autre
              joueur entre-temps.
            </p>
          </div>
        </div>
      </div>

      {/* Bouton envoyer */}
      <button
        type="button"
        onClick={onSend}
        disabled={!canSend}
        className={`w-full inline-flex items-center justify-center gap-3 px-6 py-5 rounded-xl font-black uppercase tracking-wider text-lg transition-all ${
          canSend
            ? 'bg-[#25D366] hover:bg-[#1eb858] text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-glow-green'
            : 'bg-white/10 text-white/40 cursor-not-allowed'
        }`}
      >
        <WhatsAppIcon />
        Envoyer la demande au club
      </button>

      {!canSend && (
        <p className="text-center text-xs text-white/50">
          Complétez vos coordonnées pour pouvoir envoyer.
        </p>
      )}
    </div>
  );
}

function RecapItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">
        {label}
      </p>
      <p className="font-bold text-white text-base">{value}</p>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1.5">
        {label}
        {required && ' *'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-white/50 focus:outline-none transition"
      />
    </div>
  );
}

function SentConfirmation({ onReset }: { onReset: () => void }) {
  return (
    <div className="card p-8 sm:p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-lime/20 flex items-center justify-center mx-auto mb-6">
        <svg
          className="w-10 h-10 text-brand-lime"
          fill="none"
          stroke="currentColor"
          strokeWidth={2}
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
        Message envoyé au club
      </h3>

      <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-6">
        Une conversation WhatsApp avec le club vient de s'ouvrir. Vérifiez bien
        que vous avez cliqué sur "Envoyer" dans WhatsApp pour finaliser votre demande.
      </p>

      <div className="rounded-2xl border-2 border-brand-lime bg-brand-lime/10 p-5 text-left max-w-2xl mx-auto mb-8">
        <p className="text-sm text-white leading-relaxed">
          <strong className="text-brand-lime uppercase tracking-wider text-xs block mb-2">
            ⚠️ Rappel important
          </strong>
          Votre réservation devient <strong>définitive uniquement</strong> quand
          le club vous renvoie un message de confirmation par WhatsApp. Restez
          attentif à la réponse, sans quoi le créneau peut être pris par
          quelqu'un d'autre.
        </p>
      </div>

      <button
        type="button"
        onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition"
      >
        Faire une autre réservation
      </button>
    </div>
  );
}

function WhatsAppIcon() {
  return (
    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
    </svg>
  );
}
