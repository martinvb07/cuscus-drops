'use client';

import { useEffect, useState } from 'react';

export default function Loader() {
  const [fading,  setFading]  = useState(false);
  const [mounted, setMounted] = useState(false);
  const [gone,    setGone]    = useState(false);

  useEffect(() => {
    setMounted(true);

    const fadeTimer = setTimeout(() => setFading(true), 1400);
    const goneTimer = setTimeout(() => setGone(true),   2100);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(goneTimer);
    };
  }, []);

  if (!mounted || gone) return null;

  return (
    <div className={`loader${fading ? ' loader-out' : ''}`}>
      <div className="loader-inner">
        <span className="loader-brand">Cuscus</span>
        <div className="loader-line" />
        <span className="loader-sub">Drop &nbsp;#1</span>
      </div>
    </div>
  );
}
