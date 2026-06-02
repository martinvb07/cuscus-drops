'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TermsModal from './TermsModal';

export default function PreBuyButton({ available }: { available: number | null }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [termsOpen, setTermsOpen] = useState(false);

  const soldOut = available !== null && available <= 0;

  async function handleBuy() {
    setState('loading');
    setErrorMsg('');
    try {
      const res  = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Error al procesar. Intenta de nuevo.');
      setState('error');
    }
  }

  /* ── Sold out ────────────────────────────────────────────────────────────── */
  if (soldOut) {
    return (
      <div className="w-full border border-[var(--line)] py-[18px] px-6 font-mono text-[9px] tracking-[0.48em] uppercase text-center text-bone-3">
        Agotado &nbsp;·&nbsp; Drop #1 cerrado
      </div>
    );
  }

  /* ── Main CTA ────────────────────────────────────────────────────────────── */
  return (
    <div className="flex flex-col gap-3 w-full">

      <motion.button
        onClick={handleBuy}
        disabled={state === 'loading'}
        className="relative w-full overflow-hidden font-mono text-[9px] tracking-[0.48em] uppercase flex items-center justify-center gap-3 transition-colors duration-500 disabled:cursor-not-allowed"
        style={{
          background: state === 'loading' ? 'rgba(235,230,219,0.80)' : 'rgba(235,230,219,1)',
          color:      'rgba(10,10,10,1)',
          padding:    '18px 24px',
          border:     '1px solid rgba(235,230,219,0.90)',
        }}
        whileHover={state !== 'loading' ? { background: 'rgba(235,230,219,0.88)' } : {}}
        whileTap={state !== 'loading' ? { scale: 0.995 } : {}}
        transition={{ duration: 0.3 }}
      >
        {/* Shimmer on loading */}
        <AnimatePresence>
          {state === 'loading' && (
            <motion.div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.25) 50%, transparent 100%)',
                backgroundSize: '200% 100%',
              }}
              initial={{ backgroundPosition: '-100% 0' }}
              animate={{ backgroundPosition: '200% 0' }}
              transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
            />
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {state === 'loading' ? (
            <motion.span
              key="loading"
              className="flex items-center gap-2.5"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <span
                className="block animate-spin rounded-full border border-current border-t-transparent"
                style={{ width: '10px', height: '10px' }}
              />
              Preparando checkout
            </motion.span>
          ) : (
            <motion.span
              key="idle"
              className="flex items-center gap-3"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              Comprar ahora
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.span>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Error */}
      <AnimatePresence>
        {state === 'error' && (
          <motion.p
            className="font-mono text-[8px] tracking-[0.22em] text-center"
            style={{ color: 'rgba(224, 92, 92, 0.85)' }}
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
          >
            {errorMsg}
          </motion.p>
        )}
      </AnimatePresence>

      {/* Trust line */}
      <p className="font-mono text-[9px] tracking-[0.28em] text-bone-2 uppercase text-center" style={{ opacity: 0.75 }}>
        Checkout seguro vía Shopify &nbsp;·&nbsp; COP
      </p>

      {/* Terms link */}
      <p className="font-mono text-[9px] tracking-[0.22em] uppercase text-center" style={{ opacity: 0.65 }}>
        <span className="text-bone-3">Entrega estimada 38 días &nbsp;·&nbsp; </span>
        <button
          onClick={() => setTermsOpen(true)}
          className="text-bone-3 underline underline-offset-2 hover:opacity-70 transition-opacity duration-200"
        >
          Términos y condiciones
        </button>
      </p>

      <TermsModal open={termsOpen} onClose={() => setTermsOpen(false)} />
    </div>
  );
}
