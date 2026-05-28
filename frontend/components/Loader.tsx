'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Loader() {
  const [fading,  setFading]  = useState(false);
  const [mounted, setMounted] = useState(false);
  const [gone,    setGone]    = useState(false);

  useEffect(() => {
    setMounted(true);
    const fadeTimer = setTimeout(() => setFading(true), 2800);
    const goneTimer = setTimeout(() => setGone(true),   4600);
    return () => { clearTimeout(fadeTimer); clearTimeout(goneTimer); };
  }, []);

  if (!mounted || gone) return null;

  return (
    <div className={`loader${fading ? ' loader-out' : ''}`}>
      <div className="loader-inner">

        {/* Logo CUSCUS — respira suavemente */}
        <div
          className="loader-logo"
          style={{
            animation: [
              'loaderReveal 1.4s cubic-bezier(0.25,1,0.5,1) 0.2s both',
              'loaderBreathe 4.5s ease-in-out 2s infinite',
            ].join(', '),
          }}
        >
          <Image
            src="/NOMBRE_FINAL.png"
            alt="Cuscus Hats"
            width={210}
            height={68}
            style={{ filter: 'brightness(0) invert(1)', opacity: 0.88 }}
            priority
          />
        </div>

        {/* Línea de stitching */}
        <div className="loader-stitch" style={{ animationDelay: '0.9s' }} />

        {/* Info — tres líneas descendentes */}
        <div className="flex flex-col items-center gap-1.5">
          <span className="loader-sub" style={{ animationDelay: '1.3s' }}>
            Drop 01
          </span>
          <span
            className="font-mono text-[7px] tracking-[0.52em] text-bone-3 uppercase opacity-0"
            style={{ animation: 'loaderSub 0.7s ease 1.7s forwards' }}
          >
            Limited Release
          </span>
          <span
            className="font-mono text-[7px] tracking-[0.52em] text-bone-3 uppercase opacity-0"
            style={{ animation: 'loaderSub 0.7s ease 2.0s forwards', opacity: 0 }}
          >
            Colombia 2026
          </span>
        </div>

      </div>
    </div>
  );
}
