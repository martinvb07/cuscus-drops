'use client';

import { motion } from 'framer-motion';

const TICKER = [
  'Drop #1', 'Edición Limitada', '100 Unidades',
  'Solo en Colombia', 'Sin Reposición', 'Cuscus Hats',
  'Drop #1', 'Edición Limitada', '100 Unidades',
  'Solo en Colombia', 'Sin Reposición', 'Cuscus Hats',
];

const DELAY_BASE = 2.0;
const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

const fadeUp = (delay: number) => ({
  initial:    { opacity: 0, y: 28 },
  animate:    { opacity: 1, y: 0 },
  transition: { delay: DELAY_BASE + delay, duration: 0.9, ease: EASE },
});

const fadeIn = (delay: number) => ({
  initial:    { opacity: 0 },
  animate:    { opacity: 1 },
  transition: { delay: DELAY_BASE + delay, duration: 0.8, ease: 'easeOut' as const },
});

export default function HeroSection() {
  return (
    <section className="relative w-full min-h-screen flex flex-col items-center justify-center overflow-hidden">

      {/* ── Ticker line ──────────────────────────────────────────────────── */}
      <motion.div
        className="absolute top-[64px] sm:top-[72px] left-0 right-0 border-t border-b border-[var(--line)] overflow-hidden py-[6px]"
        {...fadeIn(0.1)}
      >
        <div className="marquee-track font-mono text-[8px] tracking-[0.45em] text-bone-3 uppercase">
          {TICKER.map((item, i) => (
            <span key={i} className="inline-flex items-center shrink-0">
              {item}
              <span className="mx-5 opacity-30">·</span>
            </span>
          ))}
        </div>
      </motion.div>

      {/* ── Center content ───────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-5 sm:gap-6 px-6 text-center z-10">

        {/* Brand label */}
        <motion.div className="flex items-center gap-4" {...fadeIn(0.15)}>
          <div className="h-px w-8 bg-[var(--bone-3)]" />
          <span className="font-mono text-[9px] tracking-[0.55em] text-bone-3 uppercase">
            Cuscus Hats
          </span>
          <div className="h-px w-8 bg-[var(--bone-3)]" />
        </motion.div>

        {/* Main display word */}
        <motion.h1
          className="font-gothic text-[clamp(80px,20vw,240px)] leading-none tracking-wider text-bone uppercase"
          {...fadeUp(0.2)}
        >
          DROP
        </motion.h1>

        {/* Number row */}
        <motion.div
          className="flex items-center gap-4 sm:gap-10 w-full justify-center"
          {...fadeIn(0.35)}
        >
          <div className="h-px flex-1 max-w-[60px] sm:max-w-[140px] bg-[var(--line-strong)]" />
          <span className="font-garamond text-[clamp(20px,3.5vw,42px)] italic text-bone-2 leading-none">
            N&deg;&nbsp;01
          </span>
          <div className="h-px flex-1 max-w-[60px] sm:max-w-[140px] bg-[var(--line-strong)]" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          className="font-mono text-[9px] sm:text-[10px] tracking-[0.48em] text-bone-3 uppercase"
          {...fadeIn(0.45)}
        >
          100 unidades &nbsp;·&nbsp; Edición sin reposición
        </motion.p>

        {/* CTA */}
        <motion.a
          href="#drop"
          className="mt-3 sm:mt-4 inline-block font-mono text-[9px] sm:text-[10px] tracking-[0.40em] uppercase text-bone border border-[var(--line)] px-8 sm:px-10 py-3 hover:border-[var(--line-strong)] hover:bg-[rgba(235,230,219,0.05)] transition-all duration-300"
          {...fadeIn(0.55)}
        >
          Ver la colección
        </motion.a>
      </div>

      {/* ── Scroll indicator ─────────────────────────────────────────────── */}
      <motion.div
        className="absolute bottom-8 sm:bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        {...fadeIn(0.75)}
      >
        <span className="font-mono text-[7px] tracking-[0.6em] text-bone-3 uppercase">Scroll</span>
        <div
          className="w-px h-10 bg-gradient-to-b from-[var(--bone-3)] to-transparent scroll-line"
        />
      </motion.div>

      {/* ── Vertical side labels (desktop) ───────────────────────────────── */}
      <motion.span
        className="hidden lg:block absolute left-6 bottom-1/3 font-mono text-[8px] tracking-[0.5em] text-bone-3 uppercase"
        style={{ writingMode: 'vertical-lr', transform: 'rotate(180deg)' }}
        {...fadeIn(0.6)}
      >
        Colección 2024
      </motion.span>

      <motion.span
        className="hidden lg:block absolute right-6 bottom-1/3 font-mono text-[8px] tracking-[0.5em] text-bone-3 uppercase"
        style={{ writingMode: 'vertical-lr' }}
        {...fadeIn(0.6)}
      >
        Lanzamiento oficial
      </motion.span>

    </section>
  );
}
