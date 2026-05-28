import Image from 'next/image';

export default function Footer() {
  return (
    <footer id="footer" className="relative border-t border-[var(--line)] pt-10 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1240px] mx-auto">

        {/* ── Top row — logo + social ───────────────────────────────────────── */}
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

          <div className="flex flex-col items-end gap-3">
            <div className="flex items-center gap-6">
              <a href="https://instagram.com/cuscus_hats" target="_blank" rel="noopener noreferrer"
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

        {/* ── Bottom row ───────────────────────────────────────────────────── */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <span className="font-mono text-[8px] tracking-[0.22em] text-bone-3 uppercase">
            &copy; 2026 Cuscus Hats &nbsp;·&nbsp; Drop #1 &nbsp;·&nbsp; 100 gorras
          </span>
          <span className="font-bebas text-bone uppercase"
            style={{ fontSize: 'clamp(20px, 2.2vw, 28px)', letterSpacing: '0.10em', opacity: 0.55 }}>
            Made to Shine &nbsp;·&nbsp; Edición Limitada
          </span>
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
