'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 flex justify-between items-center px-4 sm:px-8 lg:px-12 py-4 sm:py-5 transition-all duration-500"
      style={{
        background:     scrolled ? 'rgba(10,10,10,0.85)' : 'transparent',
        borderBottom:   scrolled ? '1px solid rgba(235,230,219,0.08)' : '1px solid transparent',
        backdropFilter: scrolled ? 'blur(14px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(14px)' : 'none',
      }}
    >

      {/* Logo */}
      <a href="/" className="flex items-center shrink-0">
        <Image
          src="/NOMBRE_FINAL.png"
          alt="Cuscus Hats"
          width={110} height={30}
          className="h-auto w-[72px] sm:w-[90px]"
          style={{ filter: 'brightness(0) invert(1)' }}
          priority
        />
      </a>

      {/* Right actions */}
      <div className="flex items-center gap-3 sm:gap-5">
        <a
          href="#"
          className="hidden sm:flex items-center gap-2 font-mono text-[9px] tracking-[0.30em] uppercase text-bone-3 hover:text-bone transition-colors duration-200"
        >
          <svg
            className="w-3.5 h-3.5 stroke-current fill-none shrink-0"
            style={{ strokeWidth: 1.4 }}
            viewBox="0 0 24 24"
          >
            <path d="M3 16V6h11v10H3z" />
            <path d="M14 9h5l2 3v4h-7" />
            <circle cx="7" cy="18" r="2" />
            <circle cx="17" cy="18" r="2" />
          </svg>
          Estado del envío
        </a>

        <a
          href="#drop"
          className="font-mono text-[9px] sm:text-[10px] tracking-[0.32em] uppercase text-bone border border-[var(--line)] px-4 sm:px-6 py-2 sm:py-[9px] hover:border-[var(--line-strong)] hover:bg-[rgba(235,230,219,0.06)] transition-all duration-250"
        >
          Comprar
        </a>
      </div>

    </nav>
  );
}
