import { ImageResponse } from 'next/og';

/**
 * Image affichée quand le site est partagé sur WhatsApp, Instagram, Facebook, Twitter...
 * Générée automatiquement à la construction du site (1200x630).
 *
 * Plus tard, on pourra remplacer ce design par une vraie photo des terrains
 * une fois que Nacer aura fourni le matériel.
 */
export const alt = 'Padel Factory Agadir — Le padel comme vous ne l\'avez jamais vécu';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 50%, #1a1a1c 100%)',
          padding: '80px',
          position: 'relative',
        }}
      >
        {/* Halo bleu en haut à gauche */}
        <div
          style={{
            position: 'absolute',
            top: '-100px',
            left: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(0,1,255,0.4) 0%, rgba(0,1,255,0) 70%)',
            display: 'flex',
          }}
        />
        {/* Halo vert en bas à droite */}
        <div
          style={{
            position: 'absolute',
            bottom: '-100px',
            right: '-100px',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(5,223,114,0.3) 0%, rgba(5,223,114,0) 70%)',
            display: 'flex',
          }}
        />

        {/* Étiquette lime en haut */}
        <div
          style={{
            color: '#cdd550',
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '8px',
            textTransform: 'uppercase',
            marginBottom: '40px',
            display: 'flex',
          }}
        >
          ★ PADEL FACTORY AGADIR ★
        </div>

        {/* Titre principal */}
        <div
          style={{
            color: 'white',
            fontSize: '88px',
            fontWeight: 900,
            fontStyle: 'italic',
            textAlign: 'center',
            lineHeight: 1,
            letterSpacing: '-2px',
            textTransform: 'uppercase',
            display: 'flex',
            maxWidth: '1000px',
          }}
        >
          Le padel comme vous ne l'avez jamais vécu
        </div>

        {/* Stats en bas */}
        <div
          style={{
            display: 'flex',
            gap: '80px',
            marginTop: '60px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '64px', fontWeight: 900, color: '#cdd550' }}>2</div>
            <div style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '4px', color: 'rgba(255,255,255,0.6)' }}>Clubs</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '64px', fontWeight: 900, color: '#cdd550' }}>7</div>
            <div style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '4px', color: 'rgba(255,255,255,0.6)' }}>Terrains</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div style={{ fontSize: '64px', fontWeight: 900, color: '#cdd550' }}>+3</div>
            <div style={{ fontSize: '16px', textTransform: 'uppercase', letterSpacing: '4px', color: 'rgba(255,255,255,0.6)' }}>Ans</div>
          </div>
        </div>

        {/* Domaine en bas */}
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '16px',
            fontFamily: 'monospace',
            display: 'flex',
          }}
        >
          padelfactoryagadir.com
        </div>
      </div>
    ),
    { ...size }
  );
}
