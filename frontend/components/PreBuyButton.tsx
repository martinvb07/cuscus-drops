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
      <div className="w-full border border-[var(--line)] py-4 px-6 font-mono text-[10px] tracking-[0.45em] uppercase text-center text-bone-3">
        Agotado &nbsp;·&nbsp; Drop #1 cerrado
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 w-full">
      <button
        onClick={handleBuy}
        disabled={loading}
        className="w-full bg-bone text-ink py-4 sm:py-[18px] px-6 font-mono text-[10px] tracking-[0.42em] uppercase flex items-center justify-center gap-3 transition-all duration-300 hover:bg-[rgba(235,230,219,0.88)] active:scale-[0.99] disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {loading ? (
          <>
            <span className="inline-block w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />
            Preparando checkout...
          </>
        ) : (
          <>
            Comprar ahora
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </>
        )}
      </button>

      {error && (
        <p className="font-mono text-[9px] text-[#e05c5c] tracking-[0.2em] text-center">
          {error}
        </p>
      )}

      <p className="font-mono text-[8px] tracking-[0.25em] text-bone-3 uppercase text-center">
        Pago seguro vía Shopify &nbsp;·&nbsp; COP
      </p>
    </div>
  );
}
