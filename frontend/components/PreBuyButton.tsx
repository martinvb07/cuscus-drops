'use client';

import { useState } from 'react';

export default function PreBuyButton({ available }: { available: number | null }) {
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const soldOut = available !== null && available <= 0;

  async function handleBuy() {
    setLoading(true);
    setError('');
    try {
      const res  = await fetch('/api/checkout', { method: 'POST' });
      const data = await res.json();
      if (data.error) throw new Error(data.error);
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar. Intenta de nuevo.');
      setLoading(false);
    }
  }

  if (soldOut) {
    return (
      <div className="w-full max-w-[440px] border border-[var(--line)] py-[14px] px-4 font-mono text-[11px] tracking-[0.32em] uppercase text-center text-bone-3">
        Agotado
      </div>
    );
  }

  return (
    <div className="w-full max-w-[440px] flex flex-col items-center gap-2">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-bone text-ink border border-bone py-[14px] px-4 font-mono text-[11px] tracking-[0.32em] uppercase flex items-center justify-center gap-3 transition-all duration-200 hover:bg-transparent hover:text-bone disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            Preparando checkout...
          </>
        ) : (
          <>
            Pre-comprar ahora
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 0 L13 10 L24 12 L13 14 L12 24 L11 14 L0 12 L11 10 Z" />
            </svg>
          </>
        )}
      </button>
      {error && <p className="font-mono text-[10px] text-[#e05c5c] tracking-wider">{error}</p>}
      <p className="font-mono text-[9px] tracking-[0.2em] text-bone-3 uppercase text-center">
        Pago seguro vía Shopify · COP / USD
      </p>
    </div>
  );
}
