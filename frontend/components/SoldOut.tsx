'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SoldOut() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="fixed inset-0 bg-black overflow-hidden" style={{ height: '100dvh' }}>

      {/* ── Video de fondo ───────────────────────────────────────────────── */}
      <video
        src="/drop1-img/IMG_2038.MP4"
        autoPlay muted loop playsInline
        className="absolute inset-0 w-full h-full object-cover"
        style={{ opacity: 0.55 }}
      />

      {/* ── Overlay ───────────────────────────────────────────────────────── */}
      <div className="absolute inset-0" style={{
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.68) 0%, rgba(0,0,0,0.35) 45%, rgba(0,0,0,0.72) 100%)',
      }} />

      {/* ── Contenido ─────────────────────────────────────────────────────── */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-between"
        style={{
          padding:    'clamp(20px, 3vh, 36px) clamp(16px, 4vw, 56px)',
          opacity:     visible ? 1 : 0,
          transition: 'opacity 1.2s ease',
        }}
      >

        {/* Top — CUSCUS wordmark */}
        <div className="flex justify-center">
          <Image src="/NOMBRE_FINAL.png" alt="CUSCUS"
            width={200} height={62} priority
            style={{ width: 'clamp(130px, 15vw, 200px)', height: 'auto',
                     filter: 'brightness(0) invert(1)', opacity: 0.88 }}
          />
        </div>

        {/* Centro — SOLD OUT protagonista */}
        <div className="flex flex-col items-center w-full" style={{ gap: 'clamp(10px, 1.8vh, 22px)' }}>

          {/* SOLD OUT — logo en el centro exacto de la pantalla */}
          <div className="flex items-center w-full"
            style={{ gap: 'clamp(16px, 2.5vw, 40px)' }}>

            {/* SOLD — flex-1 alineado a la derecha */}
            <div className="flex flex-1 justify-end">
              <p className="font-bebas text-bone leading-none"
                style={{
                  fontSize:      'clamp(72px, 14vw, 172px)',
                  letterSpacing: '0.04em',
                  textShadow:    '0 4px 60px rgba(0,0,0,0.6)',
                }}>
                SOLD
              </p>
            </div>

            {/* Logo CC — centrado exacto */}
            <div className="flex items-center justify-center flex-shrink-0"
              style={{ width: 'clamp(40px, 5.5vw, 72px)', height: 'clamp(40px, 5.5vw, 72px)' }}>
              <Image src="/LOGO_FINAL.png" alt=""
                width={72} height={72}
                style={{ width: '100%', height: 'auto',
                         filter: 'brightness(0) invert(1)', opacity: 0.70 }}
              />
            </div>

            {/* OUT — flex-1 alineado a la izquierda */}
            <div className="flex flex-1 justify-start">
              <p className="font-bebas text-bone leading-none"
                style={{
                  fontSize:      'clamp(72px, 14vw, 172px)',
                  letterSpacing: '0.04em',
                  textShadow:    '0 4px 60px rgba(0,0,0,0.6)',
                }}>
                OUT
              </p>
            </div>
          </div>

          {/* Línea separadora */}
          <div style={{
            width:      'clamp(200px, 36vw, 520px)',
            height:     '1px',
            background: 'linear-gradient(90deg, transparent, rgba(235,230,219,0.22) 30%, rgba(235,230,219,0.22) 70%, transparent)',
          }} />

          {/* Copy */}
          <p className="font-mono uppercase text-center"
            style={{ fontSize: 'clamp(6.5px, 0.72vw, 8.5px)', letterSpacing: '0.46em',
                     color: 'rgba(235,230,219,0.45)' }}>
            Este drop ya encontró a sus dueños.
          </p>

          {/* Serial */}
          <p className="font-mono uppercase"
            style={{ fontSize: 'clamp(5.5px, 0.60vw, 7px)', letterSpacing: '0.50em',
                     color: 'rgba(235,230,219,0.25)' }}>
            001 — 100 &nbsp;·&nbsp; Colombia 2026
          </p>

        </div>

        {/* Bottom — CTA + footer */}
        <div className="flex flex-col items-center w-full" style={{ gap: 'clamp(12px, 1.8vh, 20px)' }}>

          {/* Botón */}
          <a
            href="https://instagram.com/cuscushats_"
            target="_blank" rel="noopener noreferrer"
            className="font-mono uppercase transition-opacity duration-400 hover:opacity-88"
            style={{
              display:       'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              width:         'clamp(240px, 36vw, 500px)',
              padding:       'clamp(12px, 1.5vh, 16px) 0',
              background:    'rgba(235,230,219,0.93)',
              color:         '#060606',
              fontSize:      'clamp(7px, 0.74vw, 9px)',
              letterSpacing: '0.46em',
            }}
          >
            Síguenos para el próximo drop
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </a>

          {/* Footer social */}
          <div className="flex items-center justify-between w-full border-t pt-3"
            style={{ borderColor: 'rgba(235,230,219,0.08)' }}>
            <div className="flex items-center gap-5">
              <a href="https://instagram.com/cuscushats_" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"
                style={{ opacity: 0.50, color: 'var(--bone)' }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                  <rect x="2" y="2" width="20" height="20" rx="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="1.2" fill="currentColor" stroke="none"/>
                </svg>
                <span className="font-mono uppercase" style={{ fontSize: '6.5px', letterSpacing: '0.28em' }}>@cuscushats_</span>
              </a>
              <a href="https://tiktok.com/@cuscus.hats" target="_blank" rel="noopener noreferrer"
                className="flex items-center gap-1.5 hover:opacity-100 transition-opacity"
                style={{ opacity: 0.50, color: 'var(--bone)' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.22 8.22 0 004.83 1.56V6.79a4.85 4.85 0 01-1.06-.1z"/>
                </svg>
                <span className="font-mono uppercase" style={{ fontSize: '6.5px', letterSpacing: '0.28em' }}>@cuscus.hats</span>
              </a>
            </div>
            <p className="font-mono uppercase hidden sm:block"
              style={{ fontSize: '6px', letterSpacing: '0.28em', color: 'rgba(235,230,219,0.28)' }}>
              Ediciones limitadas &nbsp;✦&nbsp; Hecho para soñadores
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}
