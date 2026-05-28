'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const CENTER_LINKS = [
  { label: 'Collection', href: '#drop'      },
  { label: 'Drop',       href: '#drop'      },
  { label: 'Manifiesto', href: '#manifesto' },
  { label: 'Envíos',     href: '#footer'    },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-40 grid items-center px-8 sm:px-10 lg:px-14 transition-all duration-700"
      style={{
        gridTemplateColumns:  '1fr auto 1fr',
        height:               '70px',
        background:           scrolled ? 'rgba(10,10,10,0.92)' : 'transparent',
        borderBottom:         scrolled ? '1px solid rgba(235,230,219,0.07)' : '1px solid transparent',
        backdropFilter:       scrolled ? 'blur(24px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(24px)' : 'none',
      }}
    >
      {/* Logo — CC mark */}
      <a href="/" className="flex items-center">
        <Image
          src="/LOGO_FINAL.png"
          alt="Cuscus Hats"
          width={38}
          height={38}
          style={{
            filter:     'brightness(0) invert(1)',
            opacity:    scrolled ? 0.92 : 0.84,
            transition: 'opacity 0.7s ease',
            height:     'auto',
            width:      'clamp(30px, 2.8vw, 38px)',
          }}
          priority
        />
      </a>

      {/* Center links */}
      <div className="hidden lg:flex items-center gap-10">
        {CENTER_LINKS.map(({ label, href }) => (
          <a
            key={label}
            href={href}
            className="font-mono text-[8px] tracking-[0.40em] uppercase text-bone-3 hover:text-bone transition-colors duration-500"
          >
            {label}
          </a>
        ))}
      </div>

      {/* Right — status + buy CTA */}
      <div className="flex items-center justify-end gap-5">
        <span
          className="hidden md:block font-mono text-[7px] tracking-[0.32em] text-bone-3 uppercase"
          style={{ opacity: 0.30 }}
        >
          Drop Activo
        </span>
        <a
          href="#drop"
          className="font-mono text-[8px] tracking-[0.38em] uppercase text-bone border border-[rgba(235,230,219,0.22)] px-6 py-[10px] hover:border-[rgba(235,230,219,0.50)] hover:bg-[rgba(235,230,219,0.05)] transition-all duration-500"
        >
          Comprar
        </a>
      </div>
    </nav>
  );
}
