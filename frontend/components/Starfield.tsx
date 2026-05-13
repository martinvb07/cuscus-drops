'use client';

import { useEffect, useRef } from 'react';

interface Star {
  x: number;
  y: number;
  r: number;
  baseOpacity: number;
  speed: number;
  offset: number;
  glowMax: number;
  bright: boolean;
}

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let stars: Star[] = [];

    function buildStars(w: number, h: number) {
      stars = [];

      // 180 estrellas normales
      for (let i = 0; i < 180; i++) {
        const bright = Math.random() < 0.12;
        stars.push({
          x:           Math.random() * w,
          y:           Math.random() * h,
          r:           bright ? Math.random() * 1.2 + 0.8 : Math.random() * 0.8 + 0.3,
          baseOpacity: bright ? Math.random() * 0.3 + 0.6 : Math.random() * 0.4 + 0.2,
          speed:       Math.random() * 0.6 + 0.3,
          offset:      Math.random() * Math.PI * 2,
          glowMax:     bright ? Math.random() * 14 + 8 : Math.random() < 0.35 ? Math.random() * 6 + 3 : 0,
          bright,
        });
      }

      // 18 super-estrellas brillantes en la zona del cielo
      for (let i = 0; i < 18; i++) {
        stars.push({
          x:           Math.random() * w,
          y:           Math.random() * h * 0.65,
          r:           Math.random() * 1.4 + 1.2,
          baseOpacity: Math.random() * 0.2 + 0.75,
          speed:       Math.random() * 0.9 + 0.5,
          offset:      Math.random() * Math.PI * 2,
          glowMax:     Math.random() * 22 + 18,
          bright:      true,
        });
      }
    }

    function resize() {
      canvas!.width  = window.innerWidth;
      canvas!.height = window.innerHeight;
      buildStars(canvas!.width, canvas!.height);
    }

    const startTime = performance.now();

    function draw(now: number) {
      const w = canvas!.width;
      const h = canvas!.height;
      ctx!.clearRect(0, 0, w, h);

      const t = (now - startTime) / 1000;

      for (const s of stars) {
        const wave    = (Math.sin(t * s.speed + s.offset) + 1) / 2; // 0–1
        const opacity = s.baseOpacity * (0.3 + 0.7 * wave);
        const r       = s.r * (0.6 + 0.7 * wave);
        const glow    = s.glowMax * wave;

        ctx!.save();
        ctx!.globalAlpha = opacity;

        if (glow > 0) {
          ctx!.shadowBlur  = glow;
          ctx!.shadowColor = s.bright
            ? 'rgba(255, 255, 255, 1)'
            : 'rgba(235, 230, 219, 0.85)';
        }

        ctx!.fillStyle = s.bright ? '#ffffff' : '#ebe6db';
        ctx!.beginPath();
        ctx!.arc(s.x, s.y, Math.max(r, 0.3), 0, Math.PI * 2);
        ctx!.fill();

        // Halo extra para super-estrellas en el pico del brillo
        if (s.bright && wave > 0.75) {
          const extra = (wave - 0.75) * 4; // 0–1
          ctx!.globalAlpha = opacity * extra * 0.25;
          ctx!.shadowBlur  = glow * 2;
          ctx!.beginPath();
          ctx!.arc(s.x, s.y, r * 2.5, 0, Math.PI * 2);
          ctx!.fill();
        }

        ctx!.restore();
      }

      animId = requestAnimationFrame(draw);
    }

    resize();
    window.addEventListener('resize', resize);
    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 z-[2] pointer-events-none"
    />
  );
}
