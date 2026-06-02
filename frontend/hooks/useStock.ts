'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

const POLL_INTERVAL  = 30_000;
const FETCH_TIMEOUT  = 5_000;

export function useStock(initial: number | null): number | null {
  const [available, setAvailable] = useState<number | null>(initial);
  const latestRef = useRef(initial);
  const router    = useRouter();

  useEffect(() => {
    latestRef.current = initial;
    setAvailable(initial);
  }, [initial]);

  useEffect(() => {
    let cancelled = false;

    async function poll() {
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
      try {
        const res = await fetch('/api/stock', {
          cache:  'no-store',
          signal: controller.signal,
        });
        if (!res.ok || cancelled) return;
        const { available: fresh } = await res.json();
        if (fresh !== null && fresh !== latestRef.current) {
          latestRef.current = fresh;
          setAvailable(fresh);
          if (fresh <= 0) router.refresh();
        }
      } catch { /* silent — no bloquea UI */ } finally {
        clearTimeout(timer);
      }
    }

    const id = setInterval(poll, POLL_INTERVAL);
    return () => { cancelled = true; clearInterval(id); };
  }, [router]);

  return available;
}
