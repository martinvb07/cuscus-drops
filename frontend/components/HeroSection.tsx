'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];
const BASE = 1.3;

const appear = (delay: number) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { delay: BASE + delay, duration: 1.2, ease: 'easeOut' as const },
});
const into = (delay: number, y = 14) => ({
  initial:    { opacity: 0, y },
  animate:    { opacity: 1, y: 0 },
  transition: { delay: BASE + delay, duration: 1.3, ease: EASE },
});

const HOTSPOTS = [
  { fx: 43, fy: 28 }, // corona  → Algodón premium
  { fx: 52, fy: 48 }, // bordado → Bordado 3D
  { fx: 47, fy: 73 }, // visera  → Gamuza artesanal
];

const SPECS = [
  { label: 'Algodón premium',  detail: 'Tejido de alta densidad.'        },
  { label: 'Bordado 3D',       detail: 'Relieve visible en hilo negro.'  },
  { label: 'Gamuza artesanal', detail: 'Visera con acabado matte suave.' },
];

const STARS = [
  { top: '14%', left: '73%', w: 1.1, dur: 3.4, d: 0.7 },
  { top:  '7%', left: '41%', w: 0.7, dur: 4.2, d: 0.4 },
  { top: '83%', left: '89%', w: 1.0, dur: 2.8, d: 1.1 },
  { top: '87%', left: '11%', w: 0.6, dur: 3.9, d: 0.3 },
];

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen overflow-hidden">

      {/* Star field */}
      <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden>
        {STARS.map((s, i) => (
          <div key={i} className="absolute rounded-full bg-bone" style={{
            top: s.top, left: s.left,
            width: `${s.w}px`, height: `${s.w}px`,
            animation: `twinkle ${s.dur}s ease-in-out infinite`,
            animationDelay: `${s.d}s`,
          }} />
        ))}
      </div>

      {/* ══ DESKTOP — 3-column ══════════════════════════════════════════════ */}
      <div
        className="relative z-10 hidden lg:grid min-h-screen"
        style={{ gridTemplateColumns: 'clamp(280px, 24vw, 360px) 1fr clamp(240px, 20vw, 300px)' }}
      >

        {/* ── LEFT: Branding ────────────────────────────────────────────────── */}
        <div
          className="relative flex flex-col border-r border-[var(--line)] overflow-hidden min-h-screen"
          style={{
            paddingLeft:   'clamp(28px, 3.0vw, 48px)',
            paddingRight:  'clamp(22px, 2.2vw, 36px)',
            paddingBottom: '52px',
          }}
        >
          {/* Vertical rail */}
          <motion.div
            className="absolute pointer-events-none"
            style={{ left: '11px', bottom: '56px', writingMode: 'vertical-rl', transform: 'rotate(180deg)', zIndex: 2 }}
            {...appear(0.55)}
          >
            <span className="font-mono uppercase" style={{ fontSize: '5.5px', letterSpacing: '0.62em', color: 'rgba(235,230,219,0.16)' }}>
              Colombia · 2026
            </span>
          </motion.div>

          {/* Nav clearance */}
          <div style={{ height: '70px', flexShrink: 0 }} />

          {/* Drop identifier */}
          <motion.div className="flex items-center gap-2.5" style={{ marginTop: 'clamp(24px, 3.2vh, 44px)' }} {...appear(0)}>
            <div style={{ width: '14px', height: '1px', background: 'rgba(235,230,219,0.45)' }} />
            <span className="font-mono uppercase" style={{ fontSize: '6.5px', letterSpacing: '0.55em', color: 'rgba(235,230,219,0.65)' }}>
              Drop #01 — 2026
            </span>
          </motion.div>

          {/* Spacer above title */}
          <div className="flex-1" style={{ maxHeight: '68px' }} />

          {/* Title — editorial protagonist */}
          <motion.h1
            className="font-bebas text-bone"
            style={{
              fontSize:   'clamp(52px, 5.6vw, 88px)',
              lineHeight: 0.86,
              letterSpacing: '0.04em',
              textShadow: '0 0 100px rgba(235,230,219,0.12)',
            }}
            {...into(0.08)}
          >
            Edición<br />Limitada.
          </motion.h1>

          {/* Serial under title */}
          <motion.div className="flex items-center gap-3 mt-5" {...appear(0.14)}>
            <div style={{ width: '24px', height: '1px', background: 'rgba(235,230,219,0.16)' }} />
            <span className="font-mono uppercase" style={{ fontSize: '6px', letterSpacing: '0.44em', color: 'rgba(235,230,219,0.28)' }}>
              100 unidades
            </span>
          </motion.div>

          {/* Spacer below title */}
          <div className="flex-1" style={{ maxHeight: '56px' }} />

          {/* Rule */}
          <motion.div className="w-full h-px mb-7" style={{ background: 'rgba(235,230,219,0.07)' }} {...appear(0.20)} />

          {/* Tagline */}
          <motion.p
            className="font-garamond italic text-bone-3"
            style={{ fontSize: 'clamp(13px, 1.10vw, 17px)', lineHeight: 1.55, opacity: 0.78 }}
            {...into(0.24, 8)}
          >
            Hecha para quienes<br />entienden el detalle.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#drop"
            className="group relative flex items-center justify-between mt-7 py-[17px] transition-all duration-500"
            style={{
              paddingLeft:  'clamp(16px, 1.6vw, 22px)',
              paddingRight: 'clamp(16px, 1.6vw, 22px)',
              border:       '1px solid rgba(235,230,219,0.28)',
              background:   'rgba(235,230,219,0.03)',
            }}
            whileHover={{ borderColor: 'rgba(235,230,219,0.68)', background: 'rgba(235,230,219,0.07)' }}
            {...appear(0.32)}
          >
            <span className="font-mono uppercase text-bone whitespace-nowrap" style={{ fontSize: '8px', letterSpacing: '0.46em' }}>
              Comprar ahora
            </span>
            <motion.span
              className="font-mono text-bone ml-3"
              style={{ fontSize: '14px', opacity: 0.55 }}
              whileHover={{ x: 5 }}
              transition={{ duration: 0.3 }}
            >
              →
            </motion.span>
          </motion.a>

          {/* Access badge */}
          <motion.div
            className="flex items-center justify-center mt-3"
            style={{
              border:    '1px solid rgba(235,230,219,0.14)',
              padding:   '9px 14px',
              boxShadow: '0 0 24px rgba(235,230,219,0.04)',
            }}
            {...appear(0.42)}
          >
            <motion.div
              className="rounded-full mr-2.5 shrink-0"
              style={{ width: '4px', height: '4px', background: 'rgba(235,230,219,0.52)' }}
              animate={{ opacity: [0.52, 1, 0.52] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="font-mono uppercase" style={{ fontSize: '6.5px', letterSpacing: '0.42em', color: 'rgba(235,230,219,0.42)' }}>
              Acceso limitado
            </span>
          </motion.div>
        </div>

        {/* ── CENTER: Cap protagonist ────────────────────────────────────────── */}
        <div className="relative overflow-hidden">

          {/* Ghost "01" */}
          <motion.div
            className="absolute pointer-events-none select-none"
            style={{ left: '0%', bottom: '3%', zIndex: 9, lineHeight: 0.82, userSelect: 'none' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: BASE + 0.8, duration: 3.2, ease: 'easeOut' }}
            aria-hidden
          >
            <span
              className="font-garamond italic"
              style={{ fontSize: 'clamp(180px, 19vw, 280px)', color: 'rgba(235,230,219,0.036)', letterSpacing: '-0.02em', display: 'block' }}
            >
              01
            </span>
          </motion.div>

          {/* Top/bottom vignette */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,0.52) 0%, transparent 20%, transparent 78%, rgba(10,10,10,0.52) 100%)' }}
            aria-hidden />
          {/* Right blend into specs panel */}
          <div className="absolute inset-0 pointer-events-none z-10"
            style={{ background: 'linear-gradient(to right, transparent 65%, rgba(10,10,10,0.32) 84%, rgba(10,10,10,0.58) 100%)' }}
            aria-hidden />

          {/* Cap — centered in column */}
          <motion.div className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: BASE, duration: 2.6, ease: EASE }}
          >
            <Image
              src="/drop1-img/front.png"
              alt="Gorra Cuscus Hats — Drop #1 · 100 unidades"
              fill priority
              style={{ objectFit: 'contain', padding: '5% 5% 5% 3%' }}
            />
          </motion.div>

          {/* Hotspot dots */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 25 }} aria-hidden>
            {HOTSPOTS.map(({ fx, fy }, i) => (
              <motion.g key={i}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                transition={{ delay: BASE + 0.55 + i * 0.22, duration: 1.8 }}
              >
                <motion.circle
                  cx={`${fx}%`} cy={`${fy}%`} r={8}
                  fill="rgba(235,230,219,0.04)"
                  stroke="rgba(235,230,219,0.35)"
                  strokeWidth="0.8"
                  animate={{ r: [8, 13, 8], opacity: [1, 0.12, 1] }}
                  transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut', delay: i * 1.2, repeatDelay: 0.8 }}
                />
                <circle cx={`${fx}%`} cy={`${fy}%`} r="5.5"
                  fill="rgba(0,0,0,0.42)" stroke="rgba(0,0,0,0.48)" strokeWidth="3" />
                <circle cx={`${fx}%`} cy={`${fy}%`} r="5"
                  fill="rgba(235,230,219,0.06)" stroke="rgba(235,230,219,0.70)" strokeWidth="0.9" />
                <circle cx={`${fx}%`} cy={`${fy}%`} r="2.8" fill="rgba(235,230,219,1)" />
              </motion.g>
            ))}
          </svg>

          {/* Bottom metadata */}
          <motion.p
            className="absolute bottom-7 left-1/2 font-mono uppercase whitespace-nowrap"
            style={{ zIndex: 30, transform: 'translateX(-50%)', fontSize: '6.5px', letterSpacing: '0.44em', color: 'rgba(235,230,219,0.30)' }}
            {...appear(0.90)}
          >
            Drop 01 · 100 unidades · Colombia
          </motion.p>
        </div>

        {/* ── RIGHT: Specs panel ────────────────────────────────────────────── */}
        {/* paddingLeft: 0 — connector lines start at the border itself */}
        <div
          className="relative flex flex-col border-l border-[var(--line)] overflow-hidden min-h-screen"
          style={{
            paddingLeft:   0,
            paddingRight:  'clamp(24px, 2.4vw, 40px)',
            paddingBottom: '52px',
          }}
        >
          {/* Nav clearance */}
          <div style={{ height: '70px', flexShrink: 0 }} />

          {/* Panel label */}
          <motion.div
            className="flex items-center gap-2"
            style={{ marginTop: 'clamp(20px, 2.8vh, 36px)', paddingLeft: 'clamp(20px, 2.0vw, 32px)' }}
            {...appear(0.10)}
          >
            <span className="font-mono uppercase" style={{ fontSize: '6.5px', letterSpacing: '0.55em', color: 'rgba(235,230,219,0.45)' }}>
              Especificaciones
            </span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(235,230,219,0.12)' }} />
          </motion.div>

          {/* Specs — connector line emerges from left border */}
          <div
            className="flex flex-col flex-1 justify-around"
            style={{ marginTop: 'clamp(32px, 5vh, 60px)', marginBottom: 'clamp(32px, 5vh, 60px)' }}
          >
            {SPECS.map(({ label, detail }, i) => (
              <motion.div
                key={label}
                className="flex items-start gap-0"
                initial={{ opacity: 0, x: 14 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: BASE + 0.72 + i * 0.22, duration: 1.2, ease: EASE }}
              >
                {/* Connector: line from border + terminal dot */}
                <div className="flex items-center shrink-0" style={{ paddingTop: '6px' }}>
                  <div style={{
                    width: 'clamp(20px, 2.2vw, 34px)',
                    height: '1px',
                    background: 'linear-gradient(to right, rgba(235,230,219,0.22), rgba(235,230,219,0.60))',
                    flexShrink: 0,
                  }} />
                  <div className="rounded-full shrink-0" style={{
                    width:      '4px',
                    height:     '4px',
                    background: 'rgba(235,230,219,0.65)',
                    marginLeft: '1px',
                  }} />
                </div>
                {/* Content */}
                <div style={{ paddingLeft: '12px' }}>
                  <p
                    className="font-mono text-bone uppercase leading-none mb-2"
                    style={{ fontSize: 'clamp(8px, 0.82vw, 11.5px)', letterSpacing: '0.36em', textShadow: '0 0 20px rgba(235,230,219,0.16)' }}
                  >
                    {label}
                  </p>
                  <p
                    className="font-garamond italic text-bone-3"
                    style={{ fontSize: 'clamp(12px, 0.92vw, 15px)', opacity: 0.65, lineHeight: 1.44 }}
                  >
                    {detail}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Bottom mark */}
          <motion.div
            className="flex items-center gap-2"
            style={{ paddingLeft: 'clamp(20px, 2.0vw, 32px)' }}
            {...appear(0.52)}
          >
            <div style={{ width: '16px', height: '1px', background: 'rgba(235,230,219,0.18)' }} />
            <span className="font-mono uppercase" style={{ fontSize: '6px', letterSpacing: '0.38em', color: 'rgba(235,230,219,0.22)' }}>
              Edición única
            </span>
          </motion.div>
        </div>

      </div>

      {/* ══ MOBILE — stack vertical ══════════════════════════════════════════ */}
      <div className="relative z-10 lg:hidden flex flex-col min-h-screen">

        {/* 1. Title block */}
        <div className="px-6 pt-[86px] pb-7" style={{ background: 'rgba(10,10,10,1)' }}>
          <motion.div className="flex items-center gap-2.5 mb-5" {...appear(0)}>
            <div style={{ width: '14px', height: '1px', background: 'rgba(235,230,219,0.42)' }} />
            <span className="font-mono uppercase" style={{ fontSize: '6.5px', letterSpacing: '0.55em', color: 'rgba(235,230,219,0.62)' }}>
              Drop #01 — 2026
            </span>
          </motion.div>

          <motion.h1
            className="font-bebas text-bone"
            style={{
              fontSize:      'clamp(60px, 15vw, 78px)',
              lineHeight:    0.84,
              letterSpacing: '0.04em',
              textShadow:    '0 0 60px rgba(235,230,219,0.12)',
            }}
            {...into(0.08)}
          >
            Edición<br />Limitada.
          </motion.h1>

          <motion.div className="flex items-center gap-2.5 mt-5" {...appear(0.14)}>
            <div style={{ width: '20px', height: '1px', background: 'rgba(235,230,219,0.18)' }} />
            <span className="font-mono uppercase" style={{ fontSize: '6px', letterSpacing: '0.44em', color: 'rgba(235,230,219,0.28)' }}>
              100 unidades
            </span>
          </motion.div>
        </div>

        {/* 2. Cap */}
        <div className="relative shrink-0" style={{ height: '46vh', minHeight: '260px' }}>
          <motion.div className="absolute inset-0"
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: BASE, duration: 2.2, ease: EASE }}
          >
            <Image src="/drop1-img/front.png" alt="Gorra Cuscus Hats" fill priority
              style={{ objectFit: 'contain', padding: '10px 8%' }} />
          </motion.div>
          <div className="absolute top-0 left-0 right-0 h-10 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, rgba(10,10,10,1), transparent)' }} aria-hidden />
          <div className="absolute bottom-0 left-0 right-0 h-20 pointer-events-none"
            style={{ background: 'linear-gradient(to bottom, transparent, rgba(10,10,10,1))' }} aria-hidden />
        </div>

        {/* 3. Specs + CTA */}
        <div className="flex flex-col px-6 pt-3 pb-12 gap-6" style={{ background: 'rgba(10,10,10,1)', flex: 1 }}>

          {/* Specs */}
          <motion.div className="flex flex-col gap-4 pb-6 border-b border-[rgba(235,230,219,0.07)]" {...appear(0.20)}>
            {SPECS.map(({ label, detail }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="rounded-full shrink-0" style={{ width: '5px', height: '5px', marginTop: '5px', background: 'rgba(235,230,219,0.48)' }} />
                <div>
                  <p className="font-mono uppercase text-bone mb-1" style={{ fontSize: '7px', letterSpacing: '0.34em' }}>{label}</p>
                  <p className="font-garamond italic text-bone-3 leading-snug" style={{ fontSize: '13px', opacity: 0.62 }}>{detail}</p>
                </div>
              </div>
            ))}
          </motion.div>

          {/* Tagline */}
          <motion.p className="font-garamond italic text-bone-3" style={{ fontSize: '15px', lineHeight: 1.52, opacity: 0.70 }} {...into(0.26, 8)}>
            Hecha para quienes<br />entienden el detalle.
          </motion.p>

          {/* CTA */}
          <motion.a
            href="#drop"
            className="flex items-center justify-between px-5 py-[16px] transition-all duration-500"
            style={{ border: '1px solid rgba(235,230,219,0.30)', background: 'rgba(235,230,219,0.04)' }}
            whileHover={{ borderColor: 'rgba(235,230,219,0.66)', background: 'rgba(235,230,219,0.08)' }}
            {...appear(0.32)}
          >
            <span className="font-mono uppercase text-bone" style={{ fontSize: '8.5px', letterSpacing: '0.46em' }}>
              Comprar ahora
            </span>
            <span className="font-mono text-bone text-[13px] opacity-40">→</span>
          </motion.a>

          {/* Status */}
          <motion.div
            className="flex items-center justify-center"
            style={{ border: '1px solid rgba(235,230,219,0.13)', padding: '9px 14px' }}
            {...appear(0.42)}
          >
            <motion.div
              className="rounded-full mr-2.5 shrink-0"
              style={{ width: '4px', height: '4px', background: 'rgba(235,230,219,0.52)' }}
              animate={{ opacity: [0.52, 1, 0.52] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: 'easeInOut' }}
            />
            <span className="font-mono uppercase" style={{ fontSize: '6.5px', letterSpacing: '0.40em', color: 'rgba(235,230,219,0.38)' }}>
              Acceso limitado
            </span>
          </motion.div>

        </div>
      </div>

      {/* Visor curve */}
      <div className="visor-curve" aria-hidden>
        <svg viewBox="0 0 1440 72" preserveAspectRatio="none" fill="none" className="w-full h-full">
          <path d="M0,72 Q360,14 720,32 Q1080,50 1440,72" stroke="rgba(235,230,219,0.04)" strokeWidth="1" />
        </svg>
      </div>

    </section>
  );
}
