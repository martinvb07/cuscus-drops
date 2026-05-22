'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';

const MANIFESTO = [
  { num: '01', headline: 'Solo 100.',      sub: 'En el mundo.' },
  { num: '02', headline: 'Sin reposición.', sub: 'Para siempre.' },
  { num: '03', headline: 'Para soñadores.', sub: 'Drop #1 — 2024' },
];

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

export default function EditorialSection() {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target:  ref,
    offset: ['start end', 'end start'],
  });

  const bgY = useTransform(scrollYProgress, [0, 1], ['40px', '-40px']);

  return (
    <section
      ref={ref}
      className="relative w-full border-t border-[var(--line)] py-28 sm:py-40 lg:py-52 px-4 sm:px-8 lg:px-16 overflow-hidden"
    >

      {/* ── Parallax ghost text ──────────────────────────────────────────── */}
      <motion.div
        style={{ y: bgY }}
        className="absolute inset-0 flex items-center justify-center pointer-events-none select-none"
        aria-hidden
      >
        <span
          className="font-gothic uppercase leading-none text-[rgba(235,230,219,0.025)]"
          style={{ fontSize: 'clamp(100px, 28vw, 380px)' }}
        >
          Limited
        </span>
      </motion.div>

      <div className="relative max-w-[1240px] mx-auto">

        {/* ── Section tag ─────────────────────────────────────────────────── */}
        <motion.div
          className="flex items-center gap-4 mb-16 sm:mb-20 lg:mb-24"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <div className="h-px w-7 bg-[var(--bone-3)]" />
          <span className="font-mono text-[9px] tracking-[0.5em] text-bone-3 uppercase">
            Manifiesto
          </span>
        </motion.div>

        {/* ── Statement rows ───────────────────────────────────────────────── */}
        <div className="flex flex-col">
          {MANIFESTO.map(({ num, headline, sub }, i) => (
            <motion.div
              key={num}
              className="group flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-8 border-b border-[var(--line)] pb-10 sm:pb-12 mb-10 sm:mb-12 last:border-b-0 last:mb-0 last:pb-0"
              initial={{ opacity: 0, x: -24 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.14, duration: 0.85, ease: EASE }}
            >
              {/* Number */}
              <span className="font-mono text-[9px] tracking-[0.45em] text-bone-3 uppercase shrink-0 sm:mb-2">
                {num}
              </span>

              {/* Headline */}
              <h3
                className="font-gothic uppercase leading-none text-bone tracking-wide flex-1 transition-colors duration-300 group-hover:text-bone-2"
                style={{ fontSize: 'clamp(42px, 8vw, 104px)' }}
              >
                {headline}
              </h3>

              {/* Sub */}
              <span className="font-garamond text-[16px] sm:text-[18px] italic text-bone-3 shrink-0 sm:mb-3">
                {sub}
              </span>
            </motion.div>
          ))}
        </div>

        {/* ── Bottom quote ─────────────────────────────────────────────────── */}
        <motion.blockquote
          className="mt-20 sm:mt-24 lg:mt-28 text-center flex flex-col items-center gap-4"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.9, ease: EASE }}
        >
          <div className="h-px w-10 bg-[var(--line-strong)]" />
          <p className="font-garamond text-[clamp(18px,3vw,28px)] italic text-bone-2 leading-snug max-w-[560px]">
            &ldquo;Ediciones limitadas para quienes se atreven a ser diferentes.&rdquo;
          </p>
          <span className="font-mono text-[9px] tracking-[0.45em] text-bone-3 uppercase">
            Cuscus Hats &nbsp;·&nbsp; 2024
          </span>
        </motion.blockquote>

      </div>
    </section>
  );
}
