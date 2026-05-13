'use client';

import { useEffect, useState } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

function pad(n: number) {
  return String(Math.max(0, n)).padStart(2, '0');
}

export default function Countdown() {
  const [time, setTime] = useState({ d: '00', h: '00', m: '00', s: '00' });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    let target: number;

    async function fetchTarget() {
      try {
        const res = await fetch(`${API_URL}/api/countdown`);
        if (res.ok) {
          const { targetDate } = await res.json();
          target = targetDate;
        }
      } catch {
        // fallback a localStorage si el backend no está disponible
      }

      if (!target || target < Date.now()) {
        const key = 'cuscus_drop_target';
        target = parseInt(localStorage.getItem(key) || '0', 10);
        if (!target || target < Date.now()) {
          target = Date.now() + 14 * 24 * 60 * 60 * 1000;
          localStorage.setItem(key, String(target));
        }
      }

      function tick() {
        const diff = Math.max(0, target - Date.now());
        setTime({
          d: pad(Math.floor(diff / (1000 * 60 * 60 * 24))),
          h: pad(Math.floor((diff / (1000 * 60 * 60)) % 24)),
          m: pad(Math.floor((diff / (1000 * 60)) % 60)),
          s: pad(Math.floor((diff / 1000) % 60)),
        });
      }

      tick();
      const interval = setInterval(tick, 1000);
      return () => clearInterval(interval);
    }

    fetchTarget();
  }, []);

  const cells = [
    { val: time.d, label: 'Días' },
    { val: time.h, label: 'Horas' },
    { val: time.m, label: 'Min' },
    { val: time.s, label: 'Seg' },
  ];

  return (
    <div
      className="w-full max-w-[460px] mt-1"
      style={{ opacity: mounted ? 1 : 0, transition: 'opacity 0.4s ease' }}
    >
      {/* Separator */}
      <div className="flex items-center gap-3 mb-2">
        <span className="flex-1 h-px bg-[var(--line)]" />
        <span className="font-mono text-[8px] tracking-[0.38em] text-bone-3 uppercase whitespace-nowrap">
          Próximo drop en
        </span>
        <span className="flex-1 h-px bg-[var(--line)]" />
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 gap-[6px]">
        {cells.map(({ val, label }) => (
          <div
            key={label}
            className="cd-cell border border-[var(--line)] text-center"
            style={{
              background: 'linear-gradient(180deg, rgba(235,230,219,0.06) 0%, rgba(235,230,219,0.02) 100%)',
              padding: '8px 4px 7px',
            }}
          >
            <div
              className="font-garamond font-light leading-none text-bone"
              style={{
                fontSize: 'clamp(24px, 5vw, 30px)',
                fontVariantNumeric: 'tabular-nums',
                letterSpacing: '-0.02em',
                textShadow: '0 0 20px rgba(235,230,219,0.15)',
              }}
            >
              {val}
            </div>
            <div className="mt-[4px] text-[7px] text-bone-3 font-mono uppercase tracking-[0.22em]">
              {label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
