'use client';

import { useEffect } from 'react';

const API = process.env.NEXT_PUBLIC_API_URL ?? '';

export default function PageViewTracker() {
  useEffect(() => {
    fetch(`${API}/api/analytics/event`, {
      method:  'POST',
      headers: { 'Content-Type': 'application/json' },
      body:    JSON.stringify({ event: 'page_view' }),
    }).catch(() => {});
  }, []);

  return null;
}
