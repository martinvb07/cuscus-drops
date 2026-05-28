import Image from 'next/image';
import Link  from 'next/link';

export const metadata = { title: 'Orden confirmada — Cuscus Hats' };

export default function SuccessPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 text-center gap-10">

      {/* Logo */}
      <Image
        src="/LOGO_FINAL.png"
        alt="Cuscus Hats"
        width={44} height={44}
        style={{ filter: 'brightness(0) invert(1)', opacity: 0.72 }}
        priority
      />

      {/* Rule */}
      <div style={{ width: '32px', height: '1px', background: 'rgba(235,230,219,0.18)' }} />

      {/* Content */}
      <div className="flex flex-col items-center gap-4 max-w-[400px]">
        <span className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.52em', color: 'rgba(62,207,142,0.85)' }}>
          ✓ &nbsp; Compra confirmada
        </span>

        <h1
          className="font-garamond italic text-bone"
          style={{ fontSize: 'clamp(44px, 8vw, 68px)', fontWeight: 300, lineHeight: 0.88 }}
        >
          Gracias.
        </h1>

        <p className="font-garamond italic text-bone-3" style={{ fontSize: '16px', lineHeight: 1.60, opacity: 0.72 }}>
          Tu gorra Drop #1 está reservada.<br />
          Recibirás un correo con los detalles del envío.
        </p>
      </div>

      {/* Rule */}
      <div style={{ width: '32px', height: '1px', background: 'rgba(235,230,219,0.10)' }} />

      {/* Contact */}
      <div className="flex flex-col items-center gap-2">
        <p className="font-mono uppercase" style={{ fontSize: '7px', letterSpacing: '0.30em', color: 'rgba(235,230,219,0.32)' }}>
          Seguimiento del pedido
        </p>
        <a
          href="https://instagram.com/cuscus_hats"
          target="_blank" rel="noopener noreferrer"
          className="font-mono uppercase text-bone-3 transition-colors duration-300 hover:text-bone"
          style={{ fontSize: '8px', letterSpacing: '0.28em' }}
        >
          @cuscus_hats
        </a>
      </div>

      {/* Back */}
      <Link
        href="/"
        className="font-mono uppercase text-bone-3 transition-all duration-400 hover:text-bone"
        style={{
          fontSize:    '7.5px',
          letterSpacing: '0.36em',
          border:      '1px solid rgba(235,230,219,0.16)',
          padding:     '11px 20px',
        }}
      >
        Volver al inicio
      </Link>

    </div>
  );
}
