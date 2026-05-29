'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import Image from 'next/image';

const VIEWS = [
  { key: 'front', src: '/drop1-img/front.png', alt: 'Frente'         },
  { key: 'left',  src: '/drop1-img/left.png',  alt: 'Lado izquierdo' },
  { key: 'back',  src: '/drop1-img/back.png',  alt: 'Atrás'          },
  { key: 'right', src: '/drop1-img/right.png', alt: 'Lado derecho'   },
];

const DRAG_PER_FRAME  = 72;   // px para cambiar vista al arrastrar
const AUTO_INTERVAL   = 7000; // ms entre cambios automáticos

export default function ProductViewer360() {
  const [current,  setCurrent]  = useState(0);
  const [dragging, setDragging] = useState(false);
  const [offset,   setOffset]   = useState(0);
  const [snapping, setSnapping] = useState(false);

  const startX   = useRef(0);
  const lastX    = useRef(0);
  const dragAcc  = useRef(0);
  const autoRef  = useRef<ReturnType<typeof setInterval> | null>(null);

  // ── Auto-carousel ─────────────────────────────────────────────────────────
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

  // ── Navegación manual ─────────────────────────────────────────────────────
  const goTo = useCallback((i: number) => {
    setCurrent(i);
    resetAuto(); // reinicia el timer cuando el usuario interactúa
  }, [resetAuto]);

  // ── Pointer events ────────────────────────────────────────────────────────
  const onPointerDown = useCallback((e: React.PointerEvent) => {
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    startX.current  = e.clientX;
    lastX.current   = e.clientX;
    dragAcc.current = 0;
    setDragging(true);
    setSnapping(false);
    setOffset(0);
    if (autoRef.current) clearInterval(autoRef.current); // pausa auto al arrastrar
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
    resetAuto(); // reanuda auto tras soltar
  }, [resetAuto]);

  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft')  goTo((current - 1 + VIEWS.length) % VIEWS.length);
    if (e.key === 'ArrowRight') goTo((current + 1) % VIEWS.length);
  }, [current, goTo]);

  const clampOffset = Math.max(-60, Math.min(60, offset * 0.35));

  return (
    <div className="w-full max-w-[520px] mx-auto select-none" tabIndex={0} onKeyDown={onKeyDown}>

      {/* ── Visor ─────────────────────────────────────────────────────────── */}
      <div
        className="relative overflow-hidden rounded-sm"
        style={{
          background:  'transparent',
          aspectRatio: '1 / 1',
          cursor:      dragging ? 'grabbing' : 'grab',
        }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        {/* Strip de imágenes */}
        <div
          className="absolute inset-0 flex"
          style={{
            width:      `${VIEWS.length * 100}%`,
            transform:  `translateX(calc(-${current * (100 / VIEWS.length)}% + ${clampOffset}px))`,
            transition: snapping
              ? 'transform 0.32s cubic-bezier(0.25,1,0.5,1)'
              : dragging
              ? 'none'
              : 'transform 0.42s cubic-bezier(0.25,1,0.5,1)',
          }}
        >
          {VIEWS.map((v, i) => (
            <div key={v.key} className="relative flex-shrink-0" style={{ width: `${100 / VIEWS.length}%` }}>
              <Image
                src={v.src}
                alt={v.alt}
                fill
                sizes="520px"
                className="object-contain p-3 sm:p-8"
                priority={i === 0}
                draggable={false}
              />
            </div>
          ))}
        </div>

        {/* Badge Drop #1 */}
        <div
          className="absolute top-3 left-3 font-mono text-[9px] tracking-[0.3em] uppercase px-2 py-1 z-10"
          style={{ background: 'rgba(10,10,10,0.72)', color: '#cfc8b8', border: '1px solid rgba(235,230,219,0.18)' }}
        >
          Drop #1
        </div>
      </div>

      {/* ── Dots ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-center gap-2 mt-4">
        {VIEWS.map((v, i) => (
          <button
            key={v.key}
            onClick={() => goTo(i)}
            aria-label={v.alt}
            className="transition-all duration-300 rounded-full"
            style={{
              width:      i === current ? '20px' : '6px',
              height:     '6px',
              background: i === current ? 'var(--bone)' : 'rgba(235,230,219,0.25)',
            }}
          />
        ))}
      </div>

    </div>
  );
}
