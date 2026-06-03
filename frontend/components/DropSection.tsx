'use client';

import { motion } from 'framer-motion';
import ProductViewer360 from './ProductViewer360';
import StockBadge       from './StockBadge';
import PreBuyButton     from './PreBuyButton';
import { useStock }     from '@/hooks/useStock';

interface Props {
  available: number | null;
  price:     string;
  currency:  string;
}

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

const reveal = (i: number) => ({
  initial:     { opacity: 0, y: 14 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' as const },
  transition:  { delay: i * 0.10, duration: 1.0, ease: EASE },
});

const SPECS: [string, string][] = [
  ['Cuerpo',       'Algodón premium · tejido de alta densidad'],
  ['Visera',       'Gamuza artesanal · acabado matte'],
  ['Construcción', '6 paneles · costura estructural'],
  ['Bordado',      'Corona 3D · hilo encerado'],
  ['Numeración',   'Serial individual · 001 — 100'],
  ['Despacho',     'Colombia · envío directo'],
];

export default function DropSection({ available: initialAvailable, price, currency }: Props) {
  const available = useStock(initialAvailable);
  return (
    <section
      id="drop"
      className="relative w-full border-t border-[var(--line)] py-12 sm:py-24 lg:py-36 px-5 sm:px-10 lg:px-16"
      style={{ background: 'radial-gradient(ellipse 60% 65% at 25% 50%, rgba(235,230,219,0.020) 0%, transparent 65%)' }}
    >

      {/* ── Header ────────────────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto mb-7 sm:mb-14">
        <motion.div
          className="flex items-center justify-between"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.9 }}
        >
          <span className="font-mono text-[8px] tracking-[0.50em] text-bone-3 uppercase opacity-45">
            La pieza
          </span>
          <span className="font-mono text-[8px] tracking-[0.30em] text-bone-3 uppercase opacity-30">
            Drop #1 · 2026
          </span>
        </motion.div>
      </div>

      {/* ── Grid producto ─────────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_480px] xl:grid-cols-[1fr_520px] gap-6 sm:gap-12 lg:gap-28 items-start">

        {/* Visor */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1.4, ease: EASE }}
        >
          <ProductViewer360 />
        </motion.div>

        {/* Ficha técnica */}
        <div className="flex flex-col gap-5 lg:gap-7 lg:pt-2">

          {/* Título */}
          <motion.div {...reveal(0)}>
            <h2
              className="font-bebas text-bone leading-[0.88]"
              style={{ fontSize: 'clamp(40px, 7.5vw, 88px)', letterSpacing: '0.04em' }}
            >
              Made to Shine
            </h2>
            <p className="font-garamond text-[14px] sm:text-[16px] italic text-bone-3 mt-3 tracking-wide">
              Edición Limitada &mdash; Drop #1
            </p>
          </motion.div>

          {/* Divider */}
          <motion.div className="w-8 h-px bg-[var(--bone-3)] opacity-20" {...reveal(1)} />

          {/* Descripción */}
          <motion.p
            className="font-garamond text-[15px] sm:text-[17px] text-bone-3 leading-relaxed"
            {...reveal(2)}
          >
            Algodón premium y gamuza artesanal.{' '}
            <span className="text-bone">100 unidades</span> que no se repetirán.
          </motion.p>

          {/* Especificaciones materiales */}
          <motion.ul className="flex flex-col gap-3" {...reveal(3)}>
            {SPECS.map(([k, v]) => (
              <li key={k} className="flex items-baseline gap-4">
                <span className="font-mono text-[10px] tracking-[0.28em] uppercase text-bone-3 opacity-45 w-24 shrink-0">
                  {k}
                </span>
                <span className="font-mono text-[11px] tracking-[0.14em] uppercase text-bone-2">
                  {v}
                </span>
              </li>
            ))}
          </motion.ul>

          {/* Divider */}
          <motion.div className="w-8 h-px bg-[var(--bone-3)] opacity-20" {...reveal(4)} />

          {/* Precio + Entrega */}
          <motion.div className="flex flex-col gap-3" {...reveal(5)}>

            {/* Precio */}
            <div className="flex items-baseline gap-3">
              <span
                className="font-bebas text-bone leading-none"
                style={{ fontSize: 'clamp(42px, 7vw, 74px)', letterSpacing: '0.02em' }}
              >
                {price}
              </span>
              <span className="font-mono text-[9px] tracking-[0.30em] text-bone-3 uppercase opacity-60">
                {currency}
              </span>
            </div>

            {/* Entrega estimada */}
            <div className="flex items-center gap-3">
              <div className="w-4 h-px bg-[var(--bone-3)] opacity-30" />
              <span className="font-mono text-[9px] sm:text-[10px] tracking-[0.28em] uppercase text-bone-3" style={{ opacity: 0.55 }}>
                Entrega estimada&nbsp;&nbsp;<strong className="text-bone font-normal" style={{ opacity: 1 }}>48 días</strong>
              </span>
            </div>

          </motion.div>

          {/* CTA */}
          <motion.div className="flex flex-col gap-5" {...reveal(6)}>
            <PreBuyButton available={available} />
          </motion.div>

        </div>
      </div>
    </section>
  );
}
