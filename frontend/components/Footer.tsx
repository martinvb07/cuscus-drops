export default function Footer() {
  return (
    <footer className="relative border-t border-[var(--line)] pt-10 sm:pt-12 pb-8 sm:pb-10 px-4 sm:px-8 lg:px-16">
      <div className="max-w-[1240px] mx-auto">

        {/* ── Top row ──────────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 sm:gap-0 pb-8 sm:pb-10 border-b border-[var(--line)]">

          {/* Brand block */}
          <div className="flex flex-col gap-1.5">
            <span
              className="font-gothic uppercase tracking-widest text-bone leading-none"
              style={{ fontSize: 'clamp(22px, 4vw, 32px)' }}
            >
              Cuscus Hats
            </span>
            <span className="font-garamond text-[13px] sm:text-[14px] italic text-bone-3">
              Ediciones limitadas para soñadores
            </span>
          </div>

          {/* Social links */}
          <div className="flex items-center gap-5">
            <a
              href="https://instagram.com/cuscus_hats"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-bone-3 hover:text-bone transition-colors duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4">
                <rect x="3" y="3" width="18" height="18" rx="4" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
              </svg>
              Instagram
            </a>

            <span className="text-bone-3 opacity-30 text-[10px]">·</span>

            <a
              href="https://tiktok.com/@cuscus.hats"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 font-mono text-[9px] tracking-[0.3em] uppercase text-bone-3 hover:text-bone transition-colors duration-200"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.75a4.85 4.85 0 0 1-1.01-.06z" />
              </svg>
              TikTok
            </a>
          </div>
        </div>

        {/* ── Bottom row ───────────────────────────────────────────────────── */}
        <div className="pt-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 sm:gap-0">
          <span className="font-mono text-[8px] tracking-[0.22em] text-bone-3 uppercase">
            &copy; 2024 Cuscus Hats &nbsp;·&nbsp; Drop #1 &nbsp;·&nbsp; 100 unidades
          </span>
          <span className="font-mono text-[8px] tracking-[0.22em] text-bone-3 uppercase">
            Hecho con amor en Colombia
          </span>
        </div>

      </div>

      {/* Admin link — discreta */}
      <a
        href="/admin"
        title="Admin"
        className="fixed bottom-4 right-4 z-50 w-7 h-7 border border-[var(--line)] grid place-items-center text-bone-3 hover:text-bone hover:border-[var(--line-strong)] transition-all duration-200 opacity-15 hover:opacity-80 bg-[rgba(10,10,10,0.7)]"
      >
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="5" y="10" width="14" height="10" rx="1" />
          <path d="M8 10V7a4 4 0 0 1 8 0v3" />
        </svg>
      </a>
    </footer>
  );
}
