'use client';

import { useEffect, useRef } from 'react';

export default function ShootingStars() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const layer = ref.current;
    if (!layer) return;

    function shoot() {
      if (!layer) return;
      const el = document.createElement('div');
      el.className = 'shoot';

      const startX = Math.random() * window.innerWidth * 0.7;
      const startY = Math.random() * window.innerHeight * 0.45;
      const angle = 18 + Math.random() * 18;
      const dist = 700 + Math.random() * 400;
      const rad = (angle * Math.PI) / 180;

      el.style.left = startX + 'px';
      el.style.top = startY + 'px';
      el.style.setProperty('--dx', Math.cos(rad) * dist + 'px');
      el.style.setProperty('--dy', Math.sin(rad) * dist + 'px');
      el.style.setProperty('--ang', angle + 'deg');

      const dur = 0.9 + Math.random() * 0.8;
      el.style.animation = `shoot ${dur}s linear forwards`;
      layer.appendChild(el);
      setTimeout(() => el.remove(), dur * 1000 + 200);
    }

    let loopTimeout: ReturnType<typeof setTimeout>;

    function loop() {
      shoot();
      if (Math.random() < 0.2) setTimeout(shoot, 300 + Math.random() * 400);
      loopTimeout = setTimeout(loop, 3500 + Math.random() * 6500);
    }

    const initialTimeout = setTimeout(loop, 1200);

    return () => {
      clearTimeout(initialTimeout);
      clearTimeout(loopTimeout);
    };
  }, []);

  return (
    <div ref={ref} className="absolute inset-0 overflow-hidden pointer-events-none z-[3]" />
  );
}
