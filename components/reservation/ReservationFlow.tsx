'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { useLocale } from 'next-intl';
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
import type { ApiAvailability } from '@/lib/availability';

interface ReservationFlowProps {
  clubName: string;
  clubSlug: string;
  totalCourts: number;
  whatsappNumber: string;
  rentalPricePerRacket: number;
  accent: 'blue' | 'green';
  apiData: ApiAvailability | null;
}

/**
 * Wizard de réservation en 3 colonnes (desktop) / vertical (mobile).
 * Reçoit les données de disponibilité depuis l'API ERP via la prop apiData.
 */
export default function ReservationFlow({
  clubName,
  totalCourts,
  whatsappNumber,
  rentalPricePerRacket,
  accent,
  apiData,
}: ReservationFlowProps) {
  const locale = useLocale();
  const isFr = locale === 'fr';

  const [date, setDate] = useState<Date | null>(null);
  const [slot, setSlot] = useState<TimeSlot | null>(null);
  const [court, setCourt] = useState<number | null>(null);
  const [rackets, setRackets] = useState(0);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phonePrefix, setPhonePrefix] = useState('+212');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');

  const [sent, setSent] = useState(false);

  const summaryRef = useRef<HTMLDivElement | null>(null);

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
    const link = buildWhatsappLink(draft, isFr ? 'fr' : 'en');
    window.open(link, '_blank', 'noopener,noreferrer');
    setSent(true);
  };

  // Si l'API est indisponible, on affiche un message d'erreur avec lien WhatsApp direct
  if (!apiData) {
    const whatsappLink = `https://wa.me/${whatsappNumber}`;
    return (
      <div className="card p-8 sm:p-12 text-center border border-white/20">
        <p className="text-white/50 text-sm mb-6">
          {isFr
            ? 'Les disponibilités sont temporairement indisponibles. Contactez-nous directement sur WhatsApp.'
            : 'Availability is temporarily unavailable. Contact us directly on WhatsApp.'}
        </p>
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-3 px-8 py-4 rounded-xl font-black uppercase tracking-wider text-base bg-[#25D366] hover:bg-[#1eb858] text-white transition-all"
        >
          <WhatsAppIcon />
          {isFr ? 'Contacter le club sur WhatsApp' : 'Contact the club on WhatsApp'}
        </a>
      </div>
    );
  }

  if (sent) {
    return (
      <SentConfirmation
        isFr={isFr}
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
        <Column step={1} title={isFr ? 'Date' : 'Date'} filled={!!date} accent={accent}>
          <CalendarPicker selected={date} onSelect={handleDateChange} accent={accent} apiData={apiData} />
        </Column>

        {/* Colonne 2 : Créneau */}
        <Column
          step={2}
          title={isFr ? 'Créneau' : 'Time slot'}
          filled={!!slot}
          accent={accent}
          info={date ? formatDateShort(date, locale) : null}
          disabled={!date}
        >
          {date ? (
            <SlotPicker
              date={date}
              selectedSlotIndex={slot?.index ?? null}
              onSelect={handleSlotChange}
              accent={accent}
              apiData={apiData}
            />
          ) : (
            <EmptyState
              icon="📅"
              text={
                isFr
                  ? "Sélectionnez d'abord une date dans le calendrier"
                  : 'Pick a date in the calendar first'
              }
            />
          )}
        </Column>

        {/* Colonne 3 : Terrain */}
        <Column
          step={3}
          title={isFr ? 'Terrain' : 'Court'}
          filled={court !== null}
          accent={accent}
          info={
            date && slot
              ? `${formatDateShort(date, locale)} · ${slot.start}—${slot.end}`
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
              apiData={apiData}
            />
          ) : (
            <EmptyState
              icon="🎾"
              text={
                isFr
                  ? "Sélectionnez d'abord un créneau"
                  : 'Pick a time slot first'
              }
            />
          )}
        </Column>
      </div>

      {/* SECTION DU BAS : récap + raquettes + form + envoi */}
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
            isFr={isFr}
            locale={locale}
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
  step, title, filled, accent, info, disabled = false, children,
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
    <div className={`card p-5 transition-opacity ${disabled ? 'opacity-50' : ''}`}>
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black flex-shrink-0 ${
            filled ? `${accentBg} ${accentText}` : 'bg-white/10 text-white/60'
          }`}
        >
          {filled ? '✓' : step}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-base font-extrabold uppercase tracking-tight">{title}</h3>
          {info && <p className="text-[11px] text-white/60 truncate mt-0.5">{info}</p>}
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

function formatDateShort(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'short', day: 'numeric', month: 'short',
  }).format(date);
}

function formatDateLong(date: Date, locale: string): string {
  return new Intl.DateTimeFormat(locale === 'fr' ? 'fr-FR' : 'en-US', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  }).format(date);
}

// ============================================================================
// SECTION DU BAS
// ============================================================================

interface BottomFlowProps {
  draft: ReservationDraft;
  rackets: number;
  setRackets: (n: number) => void;
  rentalPricePerRacket: number;
  firstName: string; setFirstName: (v: string) => void;
  lastName: string; setLastName: (v: string) => void;
  phonePrefix: string; setPhonePrefix: (v: string) => void;
  phoneNumber: string; setPhoneNumber: (v: string) => void;
  email: string; setEmail: (v: string) => void;
  accent: 'blue' | 'green';
  canSend: boolean;
  onSend: () => void;
  isFr: boolean;
  locale: string;
}

function BottomFlow(props: BottomFlowProps) {
  const {
    draft, rackets, setRackets, rentalPricePerRacket,
    firstName, setFirstName, lastName, setLastName,
    phonePrefix, setPhonePrefix, phoneNumber, setPhoneNumber,
    email, setEmail, accent, canSend, onSend, isFr, locale,
  } = props;

  const price = calculatePrice(draft);
  const message = buildWhatsappMessage(draft, isFr ? 'fr' : 'en');
  const accentBg = accent === 'blue' ? 'bg-brand-blue' : 'bg-brand-green';
  const accentTextSel = accent === 'green' ? 'text-black' : 'text-white';
  const accentTotalText = accent === 'blue' ? 'text-brand-blue' : 'text-brand-green';

  return (
    <div className="space-y-4">
      <div className={`card p-4 border-l-4 ${accent === 'blue' ? 'border-l-brand-blue' : 'border-l-brand-green'}`}>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-brand-lime mb-2">
          {isFr ? 'Votre sélection' : 'Your selection'}
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <RecapItem label={isFr ? 'Date' : 'Date'} value={formatDateLong(draft.date, locale)} />
          <RecapItem label={isFr ? 'Créneau' : 'Time slot'} value={`${draft.slot.start} - ${draft.slot.end}`} />
          <RecapItem label={isFr ? 'Terrain' : 'Court'} value={`Court ${draft.courtNumber}`} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Raquettes + Prix */}
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="font-extrabold uppercase tracking-wider text-sm mb-1">
              {isFr ? 'Raquettes' : 'Rackets'}
            </h4>
            <p className="text-[11px] text-white/60 mb-3">
              {rentalPricePerRacket} DHS {isFr ? "l'unité" : 'each'}
            </p>
            <div className="grid grid-cols-5 gap-1.5">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n} type="button" onClick={() => setRackets(n)}
                  className={`py-2.5 rounded-lg border-2 font-extrabold text-base transition ${
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

          <div className="card p-5">
            <h4 className="font-extrabold uppercase tracking-wider text-sm text-brand-lime mb-3">
              {isFr ? 'Estimation tarifaire' : 'Price estimate'}
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-white/80 gap-2">
                <span className="text-xs">{isFr ? 'Terrain' : 'Court'} ({draft.slot.start}—{draft.slot.end})</span>
                <span className="font-bold whitespace-nowrap">{price.court} DHS</span>
              </div>
              {draft.rackets > 0 && (
                <div className="flex justify-between text-white/80">
                  <span className="text-xs">{isFr ? 'Raquettes' : 'Rackets'} × {draft.rackets}</span>
                  <span className="font-bold whitespace-nowrap">{price.rackets} DHS</span>
                </div>
              )}
              <div className="h-px bg-white/10 my-2" />
              <div className="flex justify-between items-baseline">
                <span className="font-bold">Total</span>
                <span className={`text-2xl font-black ${accentTotalText}`}>{price.total} DHS</span>
              </div>
            </div>
          </div>
        </div>

        {/* Coordonnées */}
        <div className="card p-5">
          <h4 className="font-extrabold uppercase tracking-wider text-sm mb-4">
            {isFr ? 'Vos coordonnées' : 'Your details'}
          </h4>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-2">
              <Field label={isFr ? 'Prénom' : 'First name'} value={firstName} onChange={setFirstName} placeholder="Nacer" required />
              <Field label={isFr ? 'Nom' : 'Last name'} value={lastName} onChange={setLastName} placeholder="Benzekri" required />
            </div>
            <div>
              <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1.5">
                {isFr ? 'Téléphone' : 'Phone'} *
              </label>
              <div className="flex gap-2">
                <select
                  value={phonePrefix} onChange={(e) => setPhonePrefix(e.target.value)}
                  className="bg-black border border-white/15 rounded-lg px-2 py-2.5 text-white text-sm focus:border-white/50 focus:outline-none transition"
                  aria-label={isFr ? 'Indicatif' : 'Country code'}
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
                  type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="6XX XX XX XX" required
                  className="flex-1 min-w-0 bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-white/50 focus:outline-none transition"
                />
              </div>
            </div>
            <Field label="Email" type="email" value={email} onChange={setEmail} placeholder={isFr ? 'exemple@email.com' : 'example@email.com'} required />
          </div>
        </div>

        {/* Aperçu + Bouton */}
        <div className="space-y-4">
          <div className="card p-5">
            <h4 className="font-extrabold uppercase tracking-wider text-sm mb-2">
              {isFr ? 'Aperçu du message' : 'Message preview'}
            </h4>
            <p className="text-[11px] text-white/50 mb-3">
              {isFr ? 'Le message envoyé au club via WhatsApp' : 'The message sent to the club via WhatsApp'}
            </p>
            <pre className="bg-black/50 border border-white/10 rounded-lg p-3 text-[11px] text-white/80 whitespace-pre-wrap font-mono leading-relaxed max-h-44 overflow-auto">
              {message}
            </pre>
          </div>

          <div className="rounded-xl border-2 border-brand-lime bg-brand-lime/10 p-4">
            <div className="flex items-start gap-2.5">
              <div className="w-7 h-7 rounded-full bg-brand-lime text-black flex items-center justify-center flex-shrink-0 font-black">!</div>
              <div>
                <h4 className="font-extrabold uppercase tracking-wider text-brand-lime text-xs mb-1.5">
                  {isFr ? 'Important' : 'Important'}
                </h4>
                <p className="text-xs text-white leading-relaxed">
                  {isFr ? (
                    <>Votre réservation <strong>n&apos;est PAS confirmée</strong> tant que le club ne vous a pas explicitement répondu sur WhatsApp. <strong>Attendez bien la réponse</strong>, sans quoi le créneau peut être pris par un autre joueur.</>
                  ) : (
                    <>Your booking is <strong>NOT confirmed</strong> until the club has explicitly replied to you on WhatsApp. <strong>Wait for their reply</strong>, otherwise the slot could be taken by another player.</>
                  )}
                </p>
              </div>
            </div>
          </div>

          <button
            type="button" onClick={onSend} disabled={!canSend}
            className={`w-full inline-flex items-center justify-center gap-2.5 px-5 py-4 rounded-xl font-black uppercase tracking-wider text-base transition-all ${
              canSend
                ? 'bg-[#25D366] hover:bg-[#1eb858] text-white hover:scale-[1.02] active:scale-[0.98] cursor-pointer shadow-glow-green'
                : 'bg-white/10 text-white/40 cursor-not-allowed'
            }`}
          >
            <WhatsAppIcon />
            {isFr ? 'Envoyer au club' : 'Send to the club'}
          </button>

          {!canSend && (
            <p className="text-center text-[11px] text-white/50">
              {isFr ? "Complétez vos coordonnées pour activer l'envoi." : 'Fill in your details to enable sending.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function RecapItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">{label}</p>
      <p className="font-bold text-white text-base">{value}</p>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text', required }: {
  label: string; value: string; onChange: (v: string) => void;
  placeholder: string; type?: string; required?: boolean;
}) {
  return (
    <div>
      <label className="block text-[10px] font-bold uppercase tracking-widest text-white/60 mb-1.5">
        {label}{required && ' *'}
      </label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder} required={required}
        className="w-full bg-black border border-white/15 rounded-lg px-3 py-2.5 text-white text-sm placeholder:text-white/30 focus:border-white/50 focus:outline-none transition"
      />
    </div>
  );
}

function SentConfirmation({ isFr, onReset }: { isFr: boolean; onReset: () => void }) {
  return (
    <div className="card p-8 sm:p-12 text-center">
      <div className="w-20 h-20 rounded-full bg-brand-lime/20 flex items-center justify-center mx-auto mb-6">
        <svg className="w-10 h-10 text-brand-lime" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight mb-3">
        {isFr ? 'Message envoyé au club' : 'Message sent to the club'}
      </h3>
      <p className="text-white/70 max-w-md mx-auto leading-relaxed mb-6">
        {isFr
          ? 'Une conversation WhatsApp avec le club vient de s\'ouvrir. Vérifiez bien que vous avez cliqué sur "Envoyer" dans WhatsApp pour finaliser votre demande.'
          : 'A WhatsApp conversation with the club just opened. Make sure you clicked "Send" in WhatsApp to finalize your request.'}
      </p>
      <div className="rounded-2xl border-2 border-brand-lime bg-brand-lime/10 p-5 text-left max-w-2xl mx-auto mb-8">
        <p className="text-sm text-white leading-relaxed">
          <strong className="text-brand-lime uppercase tracking-wider text-xs block mb-2">
            ⚠️ {isFr ? 'Rappel important' : 'Important reminder'}
          </strong>
          {isFr ? (
            <>Votre réservation devient <strong>définitive uniquement</strong>{' '}quand le club vous renvoie un message de confirmation par WhatsApp. Restez attentif à la réponse, sans quoi le créneau peut être pris par quelqu&apos;un d&apos;autre.</>
          ) : (
            <>Your booking becomes <strong>final only</strong> when the club sends you a confirmation message via WhatsApp. Stay alert for their reply, otherwise the slot could be taken by someone else.</>
          )}
        </p>
      </div>
      <button
        type="button" onClick={onReset}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-white/20 text-white font-semibold uppercase tracking-wider hover:bg-white hover:text-black transition"
      >
        {isFr ? 'Faire une autre réservation' : 'Make another booking'}
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
