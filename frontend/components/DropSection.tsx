'use client';

import { motion } from 'framer-motion';
import ProductViewer360 from './ProductViewer360';
import StockBadge       from './StockBadge';
import PreBuyButton     from './PreBuyButton';

interface Props {
  available: number | null;
  price:     string;
  currency:  string;
}

const SPECS = [
  'Edición completamente limitada — 100 unidades globales',
  'Material premium de alta durabilidad',
  'Diseño exclusivo Cuscus Hats',
  'Despacho a todo Colombia',
];

const EASE = [0.25, 1, 0.5, 1] as [number, number, number, number];

const revealItem = (i: number) => ({
  initial:     { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport:    { once: true, margin: '-60px' as const },
  transition:  { delay: i * 0.1, duration: 0.7, ease: EASE },
});

export default function DropSection({ available, price, currency }: Props) {
  return (
    <section
      id="drop"
      className="relative w-full border-t border-[var(--line)] py-20 sm:py-28 lg:py-36 px-4 sm:px-8 lg:px-16"
    >
      {/* ── Section header ───────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto mb-14 sm:mb-18 flex items-center justify-between">
        <motion.div
          className="flex items-center gap-4"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7 }}
        >
          <div className="h-px w-7 bg-[var(--bone-3)]" />
          <span className="font-mono text-[9px] tracking-[0.5em] text-bone-3 uppercase">La Pieza</span>
        </motion.div>
        <motion.span
          className="font-mono text-[9px] tracking-[0.3em] text-bone-3 uppercase"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
          viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
        >
          Drop #1 &nbsp;·&nbsp; 2024
        </motion.span>
      </div>

      {/* ── Product grid ─────────────────────────────────────────────────── */}
      <div className="max-w-[1240px] mx-auto grid grid-cols-1 lg:grid-cols-[1fr_460px] xl:grid-cols-[1fr_500px] gap-10 sm:gap-14 lg:gap-24 items-start">

        {/* Viewer */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 1, ease: [0.25, 1, 0.5, 1] }}
        >
          <ProductViewer360 />
        </motion.div>

        {/* Info */}
        <div className="flex flex-col gap-7 lg:pt-2">

          {/* Product name */}
          <motion.div {...revealItem(0)}>
            <h2 className="font-gothic text-[clamp(52px,9vw,88px)] leading-none uppercase text-bone tracking-wide">
              Gorra
            </h2>
            <p className="font-garamond text-[18px] sm:text-[20px] italic text-bone-2 mt-1">
              Edición Limitada &mdash; Drop #1
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            className="font-garamond text-[15px] sm:text-[16px] text-bone-3 leading-relaxed"
            {...revealItem(1)}
          >
            Solo <strong className="text-bone font-normal">100 unidades</strong> en el mundo.
            Diseño exclusivo, calidad premium. Una vez agotado, no vuelve.
          </motion.p>

          {/* Divider */}
          <motion.div className="h-px bg-[var(--line)]" {...revealItem(2)} />

          {/* Specs */}
          <motion.ul className="flex flex-col gap-[10px]" {...revealItem(3)}>
            {SPECS.map(item => (
              <li
                key={item}
                className="flex items-start gap-3 font-mono text-[9px] sm:text-[10px] tracking-[0.16em] uppercase text-bone-3"
              >
                <span className="text-bone shrink-0 mt-px">—</span>
                {item}
              </li>
            ))}
          </motion.ul>

          {/* Divider */}
          <motion.div className="h-px bg-[var(--line)]" {...revealItem(4)} />

          {/* Price */}
          <motion.div className="flex items-baseline gap-3" {...revealItem(5)}>
            <span className="font-gothic text-[clamp(40px,6vw,60px)] text-bone leading-none">
              {price}
            </span>
            <span className="font-mono text-[11px] tracking-[0.3em] text-bone-3 uppercase">
              {currency}
            </span>
          </motion.div>

          {/* Stock + CTA */}
          <motion.div className="flex flex-col gap-5" {...revealItem(6)}>
            <StockBadge available={available} />
            <PreBuyButton available={available} />
          </motion.div>

          {/* Trust signals */}
          <motion.div
            className="flex flex-wrap gap-x-5 gap-y-2 pt-1"
            {...revealItem(7)}
          >
            {['Pago 100% seguro', 'Envío a todo Colombia', 'Soporte vía WhatsApp'].map(g => (
              <span
                key={g}
                className="font-mono text-[8px] sm:text-[9px] tracking-[0.2em] uppercase text-bone-3 flex items-center gap-1.5"
              >
                <span className="text-[#3ecf8e]">✓</span>
                {g}
              </span>
            ))}
          </motion.div>

        </div>
      </div>
    </section>
  );
}
