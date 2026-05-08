interface MapEmbedProps {
  /** Requête à embarquer dans la carte (ex: "Padel+Factory+Agadir") */
  query: string;
  /** URL Google Maps complète à ouvrir au clic du bouton */
  mapsUrl: string;
  /** Texte alternatif pour l'iframe */
  title: string;
  /** Hauteur de la carte (par défaut 350) */
  height?: number;
  /** Si true, n'enveloppe pas dans une "card" (utile quand déjà dans un parent stylisé) */
  bare?: boolean;
}

/**
 * Embed Google Maps + bouton "Ouvrir dans Google Maps".
 * N'utilise pas l'API officielle (pas besoin de clé API), juste l'embed public.
 */
export default function MapEmbed({
  query,
  mapsUrl,
  title,
  height = 350,
  bare = false,
}: MapEmbedProps) {
  const embedUrl = `https://maps.google.com/maps?q=${query}&hl=fr&z=15&output=embed`;

  const content = (
    <>
      <iframe
        src={embedUrl}
        title={title}
        width="100%"
        height={height}
        style={{ border: 0, filter: 'invert(0.92) hue-rotate(180deg)' }}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        className="w-full block"
      />
      <div className="p-4 border-t border-white/10 flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 text-sm text-white/70">
          <PinIcon />
          <span>{title}</span>
        </div>
        <a
          href={mapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/15 text-sm font-bold uppercase tracking-wider hover:bg-white hover:text-black transition"
        >
          Ouvrir dans Maps
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </a>
      </div>
    </>
  );

  if (bare) {
    return <div className="overflow-hidden">{content}</div>;
  }

  return <div className="card overflow-hidden">{content}</div>;
}

function PinIcon() {
  return (
    <svg className="w-4 h-4 text-brand-lime" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 0C7.802 0 4 3.403 4 7.602C4 11.8 7.469 16.812 12 24C16.531 16.812 20 11.8 20 7.602C20 3.403 16.199 0 12 0zM12 11a3 3 0 110-6 3 3 0 010 6z" />
    </svg>
  );
}
