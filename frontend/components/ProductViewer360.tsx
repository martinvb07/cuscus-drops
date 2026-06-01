'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

const VIEWS = [
  { key: 'front', src: '/drop1-img/front.png', alt: 'Frente'         },
  { key: 'left',  src: '/drop1-img/left.png',  alt: 'Lado izquierdo' },
  { key: 'back',  src: '/drop1-img/back.png',  alt: 'Atrás'          },
  { key: 'right', src: '/drop1-img/right.png', alt: 'Lado derecho'   },
];

const DRAG_PER_FRAME = 72;
const AUTO_INTERVAL  = 7000;

export default function ProductViewer360() {
  const [current,  setCurrent]  = useState(0);
  const [dragging, setDragging] = useState(false);
  const [offset,   setOffset]   = useState(0);
  const [snapping, setSnapping] = useState(false);

  const startX  = useRef(0);
  const lastX   = useRef(0);
  const dragAcc = useRef(0);
  const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const resetAuto = useCallback(() => {
    if (autoRef.current) clearInterval(autoRef.current);
    autoRef.current = setInterval(() => {
      setCurrent(c => (c + 1) % VIEWS.length);
    }, AUTO_INTERVAL);
  }, []);

  useEffect(() => {
    resetAuto();
    return () => { if (autoRef.current) clearInterval(autoRef.current); };
  }, [resetAuto]);

  const goTo = useCallback((i: number) => {
    setCurrent(i);
    resetAuto();
  }, [resetAuto]);

  const prev = useCallback(() => goTo((current - 1 + VIEWS.length) % VIEWS.length), [current, goTo]);
  const next = useCallback(() => goTo((current + 1) % VIEWS.length), [current, goTo]);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startX.current  = e.clientX;
    lastX.current   = e.clientX;
    dragAcc.current = 0;
    setDragging(true);
    setSnapping(false);
    setOffset(0);
    if (autoRef.current) clearInterval(autoRef.current);
  }, []);

  const onPointerMove = useCallback((e: React.PointerEvent) => {
    if (!dragging) return;
    const dx = e.clientX - lastX.current;
    lastX.current    = e.clientX;
    dragAcc.current += dx;
    if (Math.abs(dragAcc.current) >= DRAG_PER_FRAME) {
      const dir = dragAcc.current > 0 ? -1 : 1;
      setCurrent(c => (c + dir + VIEWS.length) % VIEWS.length);
      dragAcc.current = 0;
    }
    setOffset(e.clientX - startX.current);
  }, [dragging]);

  const onPointerUp = useCallback(() => {
    setDragging(false);
    setSnapping(true);
    setOffset(0);
    dragAcc.current = 0;
    setTimeout(() => setSnapping(false), 320);
    resetAuto();
  }, [resetAuto]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  prev();
    if (e.key === 'ArrowRight') next();
  }, [prev, next]);

  const clampOffset = Math.max(-60, Math.min(60, offset * 0.35));

  return (
    <div
      className="w-full max-w-[480px] sm:max-w-[540px] mx-auto select-none"
      tabIndex={0}
      onKeyDown={onKeyDown}
    >
      {/* ── Fila: flecha ‹ | imagen | flecha › ───────────────────────────── */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Flecha anterior — FUERA del drag zone */}
        <button
          onClick={prev}
          aria-label="Vista anterior"
          className="shrink-0 flex items-center justify-center transition-opacity duration-200 hover:opacity-100"
          style={{ opacity: 0.38, width: '28px', height: '28px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="rgba(235,230,219,0.9)" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M15 18l-6-6 6-6" />
          </svg>
        </button>

        {/* Zona de imagen — solo drag aquí */}
        <div className="relative flex-1 overflow-hidden"
          style={{
            aspectRatio: '1 / 1',
            background:  'transparent',
            cursor:      dragging ? 'grabbing' : 'grab',
          }}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={onPointerUp}
          onPointerLeave={onPointerUp}
        >
          {/* Halo de luz detrás */}
          <div className="absolute inset-0 pointer-events-none z-0" style={{
            background: [
              'radial-gradient(ellipse 75% 60% at 50% 48%, rgba(220,205,175,0.22) 0%, rgba(180,158,120,0.12) 38%, transparent 65%)',
              'radial-gradient(ellipse 50% 35% at 50% 52%, rgba(255,240,200,0.08) 0%, transparent 55%)',
            ].join(', '),
          }} />

          {/* Strip de imágenes */}
          <div
            className="absolute inset-0 flex z-10"
            style={{
              width:      `${VIEWS.length * 100}%`,
              transform:  `translateX(calc(-${current * (100 / VIEWS.length)}% + ${clampOffset}px))`,
              transition: snapping
                ? 'transform 0.32s cubic-bezier(0.25,1,0.5,1)'
                : dragging ? 'none'
                : 'transform 0.42s cubic-bezier(0.25,1,0.5,1)',
            }}
          >
            {VIEWS.map((v, i) => (
              <div key={v.key} className="relative flex-shrink-0" style={{ width: `${100 / VIEWS.length}%` }}>
                <Image
                  src={v.src}
                  alt={v.alt}
                  fill
                  sizes="(max-width: 640px) calc(100vw - 100px), (max-width: 1024px) 45vw, 480px"
                  className="object-contain p-2 sm:p-4"
                  quality={100}
                  priority={i === 0}
                  draggable={false}
                />
              </div>
            ))}
          </div>

          {/* Badge Drop #1 */}
          <div
            className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.3em] uppercase px-2 py-1 z-20"
            style={{ background: 'rgba(8,8,8,0.72)', color: '#cfc8b8', border: '1px solid rgba(235,230,219,0.12)' }}
          >
            Drop #1
          </div>
        </div>

        {/* Flecha siguiente — FUERA del drag zone */}
        <button
          onClick={next}
          aria-label="Vista siguiente"
          className="shrink-0 flex items-center justify-center transition-opacity duration-200 hover:opacity-100"
          style={{ opacity: 0.38, width: '28px', height: '28px' }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"
            stroke="rgba(235,230,219,0.9)" strokeWidth="1.6"
            strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 18l6-6-6-6" />
          </svg>
        </button>
      </div>

      {/* ── Barra inferior: label + dots ──────────────────────────────────── */}
      <div className="flex items-center justify-between mt-3" style={{ paddingLeft: '40px', paddingRight: '40px' }}>
        <span className="font-mono text-[8px] tracking-[0.4em] uppercase" style={{ color: 'rgba(235,230,219,0.28)' }}>
          {VIEWS[current].alt}
        </span>
        <div className="flex items-center gap-2">
          {VIEWS.map((v, i) => (
            <button
              key={v.key}
              onClick={() => goTo(i)}
              aria-label={v.alt}
              className="transition-all duration-300 rounded-full"
              style={{
                width:      i === current ? '18px' : '5px',
                height:     '5px',
                background: i === current ? 'var(--bone)' : 'rgba(235,230,219,0.22)',
              }}
            />
          ))}
        </div>
      </div>

    </div>
  );
}
