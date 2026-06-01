'use client';

import Image from 'next/image';

const WHATSAPP_NUMBER = '573143196329';
const EMAIL_ADDRESS   = 'cuscushats@gmail.com';

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-[var(--line)]">

      {/* ── Contacto ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-[var(--line)]">
        <div className="max-w-[1440px] mx-auto">

          {/* Encabezado con gorra de fondo */}
          <div className="relative flex flex-col items-center text-center px-5 sm:px-8 pt-16 sm:pt-20 pb-12 sm:pb-16 overflow-hidden"
            style={{ minHeight: 'clamp(280px, 36vh, 420px)' }}>

            {/* Gorra fantasma — referencia visual */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden>
              <Image
                src="/drop1-img/front.png"
                alt=""
                fill
                sizes="100vw"
                style={{ objectFit: 'contain', objectPosition: 'center', opacity: 0.06, padding: '4% 8% 4% 8%' }}
              />
            </div>

            {/* Degradado superior e inferior para fundir */}
            <div className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(to bottom, var(--ink) 0%, transparent 22%, transparent 78%, var(--ink) 100%)' }}
              aria-hidden />

            {/* Texto sobre la imagen */}
            <div className="relative z-10 flex flex-col items-center gap-4">
              <p className="font-mono text-[7px] tracking-[0.55em] uppercase text-bone-3" style={{ opacity: 0.35 }}>
                Contacto · Drop #1
              </p>
              <h2 className="font-bebas text-bone leading-[0.88]"
                style={{ fontSize: 'clamp(58px, 10vw, 120px)', letterSpacing: '0.04em' }}>
                ¿Hablamos?
              </h2>
              <p className="font-garamond italic text-bone-3 px-2" style={{ fontSize: 'clamp(14px, 1.8vw, 17px)', opacity: 0.50 }}>
                Responde cualquier duda sobre el Drop #1
              </p>
            </div>

          </div>

          {/* Filas de contacto */}
          <div className="mx-5 sm:mx-8 lg:mx-16 border-t border-[var(--line)]">

            {/* WhatsApp */}
            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hola%20Cuscus%20Hats%2C%20tengo%20una%20consulta%20sobre%20el%20Drop%20%231`}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-4 sm:gap-8 py-6 sm:py-7 border-b border-[var(--line)] transition-colors duration-400 hover:bg-[rgba(37,211,102,0.03)] -mx-5 sm:-mx-8 lg:-mx-16 px-5 sm:px-8 lg:px-16"
            >
              <div className="flex items-center gap-2 w-20 sm:w-32 shrink-0">
                <span className="w-[5px] h-[5px] rounded-full shrink-0" style={{ background: '#25D366' }} />
                <span className="font-mono text-[7px] tracking-[0.4em] uppercase" style={{ color: '#25D366', opacity: 0.85 }}>
                  WhatsApp
                </span>
              </div>
              <span className="font-bebas text-bone leading-none flex-1 group-hover:opacity-70 transition-opacity duration-300"
                style={{ fontSize: 'clamp(22px, 3.5vw, 44px)', letterSpacing: '0.04em' }}>
                Escríbenos directo
              </span>
              <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                <span className="font-mono text-[6.5px] tracking-[0.26em] uppercase text-bone-3" style={{ opacity: 0.30 }}>Lun – Vie</span>
                <span className="font-mono text-[6.5px] tracking-[0.26em] uppercase text-bone-3" style={{ opacity: 0.30 }}>9 am – 6 pm</span>
              </div>
              <span className="font-mono text-[15px] text-bone-3 opacity-20 group-hover:opacity-60 group-hover:translate-x-1.5 transition-all duration-300 shrink-0 ml-2">→</span>
            </a>

            {/* Email */}
            <a
              href={`mailto:${EMAIL_ADDRESS}?subject=Drop%20%231%20%E2%80%94%20Consulta`}
              className="group flex items-center gap-4 sm:gap-8 py-6 sm:py-7 border-b border-[var(--line)] transition-colors duration-400 hover:bg-[rgba(235,230,219,0.025)] -mx-5 sm:-mx-8 lg:-mx-16 px-5 sm:px-8 lg:px-16"
            >
              <div className="flex items-center gap-2 w-20 sm:w-32 shrink-0">
                <span className="w-[5px] h-[5px] rounded-full bg-bone-3 shrink-0" style={{ opacity: 0.35 }} />
                <span className="font-mono text-[7px] tracking-[0.4em] uppercase text-bone-3" style={{ opacity: 0.45 }}>
                  Email
                </span>
              </div>
              <span className="font-bebas text-bone leading-none flex-1 group-hover:opacity-70 transition-opacity duration-300 min-w-0 break-all"
                style={{ fontSize: 'clamp(16px, 2.8vw, 40px)', letterSpacing: '0.04em' }}>
                {EMAIL_ADDRESS}
              </span>
              <div className="hidden sm:flex flex-col items-end gap-0.5 shrink-0">
                <span className="font-mono text-[6.5px] tracking-[0.26em] uppercase text-bone-3" style={{ opacity: 0.30 }}>24 – 48 h</span>
              </div>
              <span className="font-mono text-[15px] text-bone-3 opacity-20 group-hover:opacity-60 group-hover:translate-x-1.5 transition-all duration-300 shrink-0 ml-2">→</span>
            </a>

          </div>

        </div>
      </div>

      {/* ── Footer base ───────────────────────────────────────────────────────── */}
      <div className="border-t border-[var(--line)] px-5 sm:px-8 lg:px-16 pt-10 sm:pt-12 pb-8 sm:pb-10">
        <div className="max-w-[1240px] mx-auto">

          {/* Top row — logo + social */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 sm:gap-0 pb-8 sm:pb-10 border-b border-[var(--line)]">

            <div className="flex flex-col gap-4">
              <Image
                src="/LOGO_FINAL.png" alt="Cuscus Hats"
                width={58} height={58}
                style={{ filter: 'brightness(0) invert(1)', opacity: 0.92 }}
              />
              <div>
                <p className="font-mono text-[9px] tracking-[0.38em] uppercase text-bone mb-1" style={{ opacity: 0.65 }}>
                  Cuscus Hats
                </p>
                <p className="font-garamond text-[14px] sm:text-[15px] italic text-bone-3">
                  Hecho para durar. No para repetirse.
                </p>
              </div>
            </div>

            <div className="flex flex-col items-start sm:items-end gap-3">
              <div className="flex items-center gap-6">
                <a href="https://instagram.com/cuscushats_" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-[9px] tracking-[0.28em] uppercase text-bone-2 hover:text-bone transition-colors duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                    <rect x="3" y="3" width="18" height="18" rx="4" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                  Instagram
                </a>
                <span className="text-bone-3 opacity-20">·</span>
                <a href="https://tiktok.com/@cuscus.hats" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-2 font-mono text-[9px] tracking-[0.28em] uppercase text-bone-2 hover:text-bone transition-colors duration-200">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
                  </svg>
                  TikTok
                </a>
              </div>
              <p className="font-mono text-[7.5px] tracking-[0.30em] uppercase text-bone-3" style={{ opacity: 0.35 }}>
                Colombia &nbsp;·&nbsp; Edición Limitada &nbsp;·&nbsp; 100 unidades
              </p>
            </div>
          </div>

          {/* Bottom row */}
          <div className="pt-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
            <span className="font-mono text-[8px] tracking-[0.22em] text-bone-3 uppercase">
              &copy; 2026 Cuscus Hats &nbsp;·&nbsp; Drop #1 &nbsp;·&nbsp; 100 gorras
            </span>
            <span className="font-bebas text-bone uppercase hidden sm:block"
              style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', letterSpacing: '0.10em', opacity: 0.55 }}>
              Made to Shine &nbsp;·&nbsp; Edición Limitada
            </span>
          </div>

        </div>
      </div>

      {/* Admin link — discreta */}
      <a href="/admin" title="Admin"
        className="fixed bottom-4 right-4 z-50 w-7 h-7 border border-[var(--line)] grid place-items-center text-bone-3 hover:text-bone hover:border-[var(--line-strong)] transition-all duration-200 opacity-15 hover:opacity-80 bg-[rgba(10,10,10,0.7)]">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="10" width="14" height="10" rx="1" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </a>
    </footer>
  );
}
