import Image from 'next/image';
import Starfield from './Starfield';
import ShootingStars from './ShootingStars';

export default function SoldOut() {
  return (
    <div className="fixed inset-0 overflow-hidden" style={{ background: '#060606' }}>

      {/* Fondo */}
      <Image
        src="/fondo.png" alt="" fill priority
        className="object-cover object-bottom"
        style={{ zIndex: 0 }}
      />

      {/* Overlay oscuro */}
      <div className="absolute inset-0 pointer-events-none" style={{
        zIndex: 1,
        background: 'linear-gradient(180deg, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.22) 44%, rgba(0,0,0,0.52) 100%)',
      }} />

      <Starfield />
      <ShootingStars />

      {/* ── Bloque centrado en el cielo ─────────────────────────────────── */}
      <div
        className="so-in absolute inset-x-0 flex flex-col items-center text-center"
        style={{ zIndex: 3, top: 0, bottom: '28%',
                 flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-end',
                 padding: '0 24px clamp(20px, 3vh, 36px)' }}
      >

        {/* CUSCUS — mismo tamaño que pre-reg */}
        <Image
          src="/NOMBRE_FINAL.png" alt="CUSCUS"
          width={340} height={104} priority
          style={{
            width: 'clamp(200px, 26vw, 340px)', height: 'auto',
            filter: 'brightness(0) invert(1)', opacity: 0.96,
          }}
        />

        {/* SOLD  [logo]  OUT — misma gramática que LIMITED [logo] DROP */}
        <div className="flex items-center"
          style={{ gap: 'clamp(22px, 3.2vw, 46px)', marginTop: '32px', marginBottom: '48px' }}>
          <span className="font-mono uppercase"
            style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', letterSpacing: '0.54em',
                     color: 'rgba(235,230,219,0.48)' }}>
            SOLD
          </span>
          <Image
            src="/LOGO_FINAL.png" alt=""
            width={120} height={120}
            style={{
              width: 'clamp(80px, 11vw, 120px)', height: 'auto',
              filter: 'brightness(0) invert(1)', opacity: 0.90,
            }}
          />
          <span className="font-mono uppercase"
            style={{ fontSize: 'clamp(9px, 0.9vw, 11px)', letterSpacing: '0.54em',
                     color: 'rgba(235,230,219,0.48)' }}>
            OUT
          </span>
        </div>

        {/* Regla — igual que en el pre-reg */}
        <div style={{
          width: 'clamp(300px, 44vw, 600px)', height: '1px', marginBottom: '28px',
          background: 'linear-gradient(90deg, transparent, rgba(235,230,219,0.18) 22%, rgba(235,230,219,0.18) 78%, transparent)',
        }} />

        {/* Label — mismo estilo que "SÉ EL PRIMERO EN SABER" */}
        <p className="font-mono uppercase"
          style={{ fontSize: 'clamp(7px, 0.72vw, 8.5px)', letterSpacing: '0.44em',
                   color: 'rgba(235,230,219,0.42)', marginBottom: '28px' }}>
          Este drop ya encontró a sus dueños.
        </p>

        {/* Botón — igual que "RECIBE ALERTAS +" del pre-reg */}
        <a
          href="https://instagram.com/cuscus_hats"
          target="_blank" rel="noopener noreferrer"
          className="font-mono uppercase transition-opacity hover:opacity-85"
          style={{
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            width: 'clamp(300px, 44vw, 600px)',
            padding: '17px 0',
            background: 'rgba(235,230,219,0.93)',
            color: '#080808',
            fontSize: 'clamp(8.5px, 0.88vw, 10.5px)',
            letterSpacing: '0.44em',
            textDecoration: 'none',
          }}
        >
          Síguenos para el próximo drop &nbsp;+
        </a>

        {/* Legal — igual que "AL REGISTRARTE ACEPTAS..." */}
        <p className="font-mono uppercase"
          style={{ fontSize: '6px', letterSpacing: '0.28em', marginTop: '22px',
                   color: 'rgba(235,230,219,0.20)' }}>
          Cuscus Hats &nbsp;·&nbsp; Colombia &nbsp;·&nbsp; Edición limitada 001 — 100
        </p>

      </div>

      {/* ── Footer negro ───────────────────────────────── */}
      <div
        className="so-in absolute bottom-0 inset-x-0 flex items-center justify-between px-7 sm:px-10 py-4"
        style={{ zIndex: 4, background: 'rgba(0,0,0,0.88)', borderTop: '1px solid rgba(235,230,219,0.06)' }}
      >
        <div className="flex items-center gap-5">
          <a href="https://instagram.com/cuscus_hats" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"
            style={{ opacity: 0.65, color: 'var(--bone)' }}>
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="5"/>
              <circle cx="12" cy="12" r="4"/>
              <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
            </svg>
            <span className="font-mono uppercase"
              style={{ fontSize: '7px', letterSpacing: '0.28em' }}>@cuscus_hats</span>
          </a>
          <a href="https://tiktok.com/@cuscus.hats" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"
            style={{ opacity: 0.65, color: 'var(--bone)' }}>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.83 1.56V6.79a4.85 4.85 0 01-1.06-.1z"/>
            </svg>
            <span className="font-mono uppercase"
              style={{ fontSize: '7px', letterSpacing: '0.28em' }}>@cuscus.hats</span>
          </a>
        </div>
        <p className="hidden sm:block font-mono uppercase"
          style={{ fontSize: '6.5px', letterSpacing: '0.30em', color: 'rgba(235,230,219,0.38)' }}>
          Ediciones limitadas &nbsp;✦&nbsp; Hecho para soñadores
        </p>
      </div>

      <style>{`
        .so-in { opacity: 0; animation: soFade 0.75s ease forwards; }
        @keyframes soFade { to { opacity: 1; } }
      `}</style>

    </div>
  );
}
