'use client';

import { useMemo, useState } from 'react';
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
  whatsappNumber: string; // sans + ni espaces
  rentalPricePerRacket: number;
  /** Couleur du club */
  accent: 'blue' | 'green';
}

/**
 * Wizard de réservation en 5 étapes :
 *  1. Date
 *  2. Créneau
 *  3. Terrain
 *  4. Raquettes + Contact
 *  5. Aperçu + envoi WhatsApp
 *
 * Toutes les étapes sont visibles sur la même page (pas de page suivante).
 * Quand une étape est validée, la suivante apparaît avec animation.
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

  const accentBg = accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-green';

  // Quand une nouvelle date est choisie, on reset le créneau et le terrain
  const handleDateChange = (d: Date) => {
    setDate(d);
    setSlot(null);
    setCourt(null);
  };
  const handleSlotChange = (s: TimeSlot) => {
    setSlot(s);
    setCourt(null);
  };

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
    date,
    slot,
    court,
    rackets,
    clubName,
    whatsappNumber,
    rentalPricePerRacket,
    firstName,
    lastName,
    phonePrefix,
    phoneNumber,
    email,
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

  // Si déjà envoyé, on affiche l'écran de confirmation
  if (sent) {
    return <SentConfirmation onReset={() => {
      setSent(false);
      setDate(null);
      setSlot(null);
      setCourt(null);
      setRackets(0);
    }} />;
  }

  return (
    <div className="space-y-10">
      {/* Étape 1 : Date */}
      <Step number={1} title="Choisissez votre date" active={true} done={!!date} accent={accent}>
        <CalendarPicker
          selected={date}
          onSelect={handleDateChange}
          accent={accent}
        />
      </Step>

      {/* Étape 2 : Créneau */}
      {date && (
        <Step number={2} title="Choisissez votre créneau" active={true} done={!!slot} accent={accent}>
          <SlotPicker
            date={date}
            selectedSlotIndex={slot?.index ?? null}
            onSelect={handleSlotChange}
            accent={accent}
          />
        </Step>
      )}

      {/* Étape 3 : Terrain */}
      {date && slot && (
        <Step number={3} title="Choisissez votre terrain" active={true} done={court !== null} accent={accent}>
          <CourtPicker
            date={date}
            slotIndex={slot.index}
            totalCourts={totalCourts}
            selectedCourt={court}
            onSelect={setCourt}
            accent={accent}
          />
        </Step>
      )}

      {/* Étape 4 : Raquettes + Contact */}
      {date && slot && court !== null && (
        <Step number={4} title="Vos informations" active={true} done={isContactComplete} accent={accent}>
          {/* Raquettes */}
          <div className="card p-6 mb-6">
            <h4 className="font-extrabold uppercase tracking-wider text-sm mb-2">
              Location de raquettes
            </h4>
            <p className="text-sm text-white/60 mb-4">
              Combien de raquettes avez-vous besoin ? ({rentalPricePerRacket} DHS l'unité)
            </p>
            <div className="grid grid-cols-5 gap-3">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setRackets(n)}
                  className={`py-4 rounded-xl border-2 font-extrabold text-lg transition ${
                    rackets === n
                      ? `${accentBg} text-white border-transparent ${
                          accent === 'green' ? 'text-black' : ''
                        }`
                      : 'border-white/15 hover:border-white/40 text-white'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Formulaire contact */}
          <div className="card p-6">
            <h4 className="font-extrabold uppercase tracking-wider text-sm mb-4">
              Vos coordonnées
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

              {/* Téléphone avec indicatif */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
                  Téléphone *
                </label>
                <div className="flex gap-2">
                  <select
                    value={phonePrefix}
                    onChange={(e) => setPhonePrefix(e.target.value)}
                    className="bg-black border border-white/15 rounded-lg px-3 py-3 text-white focus:border-white/50 focus:outline-none transition"
                    aria-label="Indicatif téléphonique"
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
                    className="flex-1 bg-black border border-white/15 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none transition"
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
                className="sm:col-span-2"
              />
            </div>
          </div>
        </Step>
      )}

      {/* Étape 5 : Aperçu + Envoi */}
      {draft && (
        <Step number={5} title="Aperçu et envoi" active={true} done={false} accent={accent}>
          <PreviewAndSend
            draft={draft}
            canSend={canSend}
            onSend={handleSend}
            accent={accent}
          />
        </Step>
      )}
    </div>
  );
}

// ============================================================================
// Composants utilitaires
// ============================================================================

function Step({
  number,
  title,
  active,
  done,
  children,
  accent,
}: {
  number: number;
  title: string;
  active: boolean;
  done: boolean;
  children: React.ReactNode;
  accent: 'blue' | 'green';
}) {
  const accentBg = accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-green';
  const textColor = accent === 'green' ? 'text-black' : 'text-white';

  return (
    <section className="animate-slide-up">
      <header className="flex items-center gap-4 mb-6">
        <div
          className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-lg ${
            active ? `${accentBg} ${textColor}` : 'bg-white/10 text-white/50'
          }`}
        >
          {done ? '✓' : number}
        </div>
        <h3 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight">
          {title}
        </h3>
      </header>
      {children}
    </section>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = 'text',
  required,
  className = '',
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
  className?: string;
}) {
  return (
    <div className={className}>
      <label className="block text-xs font-bold uppercase tracking-widest text-white/60 mb-2">
        {label}
        {required && ' *'}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="w-full bg-black border border-white/15 rounded-lg px-4 py-3 text-white placeholder:text-white/30 focus:border-white/50 focus:outline-none transition"
      />
    </div>
  );
}

function PreviewAndSend({
  draft,
  canSend,
  onSend,
  accent,
}: {
  draft: ReservationDraft;
  canSend: boolean;
  onSend: () => void;
  accent: 'blue' | 'green';
}) {
  const price = calculatePrice(draft);
  const message = buildWhatsappMessage(draft, 'fr');

  return (
    <div className="space-y-6">
      {/* Récapitulatif prix */}
      <div className="card p-6">
        <h4 className="font-extrabold uppercase tracking-wider text-sm text-brand-lime mb-4">
          Récapitulatif tarifaire
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
          <div className="flex justify-between text-lg">
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
          Voici le message qui sera envoyé au club par WhatsApp en cliquant sur "Envoyer".
        </p>
        <pre className="bg-black/50 border border-white/10 rounded-lg p-4 text-xs text-white/80 whitespace-pre-wrap font-mono leading-relaxed overflow-auto">
          {message}
        </pre>
      </div>

      {/* AVERTISSEMENT IMPORTANT */}
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
          Complétez d'abord vos coordonnées pour pouvoir envoyer.
        </p>
      )}
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

      {/* Avertissement final */}
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
