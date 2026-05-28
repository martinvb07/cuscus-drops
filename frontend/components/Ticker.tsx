'use client';

import { useRef, useEffect } from 'react';
import gsap from 'gsap';

const ITEMS = [
  'Drop 01',
  '100 Unidades',
  'Colombia · 2026',
  'Edición Limitada',
  'Sin Reposición',
  'Algodón Premium',
  'Bordado 3D',
  'Gamuza Artesanal',
  'Hecho para durar',
  'No es mercancía · es archivo',
];

const DOT = (
  <span aria-hidden style={{ opacity: 0.14, margin: '0 20px', fontSize: '10px' }}>✦</span>
);

export default function Ticker() {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    tweenRef.current = gsap.to(track, {
      x:        '-50%',
      duration: 26,
      ease:     'none',
      repeat:   -1,
    });

    const onEnter = () => tweenRef.current?.timeScale(0.35);
    const onLeave = () => tweenRef.current?.timeScale(1);
    track.parentElement?.addEventListener('mouseenter', onEnter);
    track.parentElement?.addEventListener('mouseleave', onLeave);

    return () => {
      tweenRef.current?.kill();
      track.parentElement?.removeEventListener('mouseenter', onEnter);
      track.parentElement?.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  const all = [...ITEMS, ...ITEMS];

  return (
    <div
      className="relative border-t border-b border-[var(--line)] overflow-hidden select-none cursor-default"
      style={{ paddingTop: '13px', paddingBottom: '13px' }}
    >
      <div ref={trackRef} className="flex items-center" style={{ width: 'max-content' }}>
        {all.map((item, i) => (
          <span key={i} className="flex items-center shrink-0">
            <span
              className="font-mono uppercase text-bone-3"
              style={{ fontSize: '7px', letterSpacing: '0.50em', opacity: 0.32 }}
            >
              {item}
            </span>
            {DOT}
          </span>
        ))}
      </div>
    </div>
  );
}
